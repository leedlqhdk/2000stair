import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SettlementAppInstall from "@/components/SettlementAppInstall";
import "./settlements-app.css";

const money = (value: number) => `${value.toLocaleString("ko-KR")}원`;
const seoulToday = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());
const shiftMonth = (month: string, delta: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};
const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";
const AUTO_SYNC_MS = 10 * 60 * 1000;
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

type SyncResult = {
  read: number; added: string[]; updated: number; linked: string[];
  deactivated: { name: string; reason: string }[]; skipped: { name: string; reason: string }[]; conflicts: { name: string; reason: string }[];
};

export default function AdminSettlements() {
  return <div className="settlements-app"><SettlementAppInstall /><SettlementContent /></div>;
}

function SettlementContent() {
  const { user, loading } = useAuth();
  const admin = user?.role === "admin";
  const [password, setPassword] = useState("");
  const utils = trpc.useUtils();
  const login = trpc.auth.passwordLogin.useMutation({ onSuccess: data => { utils.auth.me.setData(undefined, data.user); setPassword(""); }, onError: e => toast.error(e.message) });

  if (loading) return <div className="p-12 text-center">관리자 확인 중…</div>;
  if (!admin) return (
    <main className="min-h-screen bg-slate-50 px-4 py-20">
      <form className="mx-auto max-w-md space-y-5 rounded-2xl border bg-white p-8" onSubmit={e => { e.preventDefault(); login.mutate({ password }); }}>
        <p className="text-sm font-bold text-blue-600">이천계단지기 · 관리자</p>
        <h1 className="text-2xl font-bold">정산 달력 로그인</h1>
        <p className="text-sm text-slate-500">정산 내역은 관리자만 확인할 수 있습니다.</p>
        <label className="block">관리자 비밀번호<input className={`${inputClass} mt-2`} type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        <Button className="w-full" disabled={login.isPending}>{login.isPending ? "확인 중…" : "로그인"}</Button>
      </form>
    </main>
  );
  return <Calendar />;
}

function Calendar() {
  const today = seoulToday();
  const [month, setMonth] = useState(today.slice(0, 7));
  const [selectedDay, setSelectedDay] = useState<number | null>(month === today.slice(0, 7) ? Number(today.slice(8, 10)) : null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [showCustomers, setShowCustomers] = useState(false);
  const utils = trpc.useUtils();
  const status = trpc.billing.status.useQuery(undefined, { retry: false });
  const query = trpc.billing.month.useQuery({ month }, { retry: false, refetchOnWindowFocus: true });
  const customers = trpc.billing.customers.useQuery(undefined, { enabled: showCustomers, retry: false });
  const autoRef = useRef(false);
  const [auto, setAuto] = useState(false);
  const sync = trpc.billing.syncFromNotion.useMutation({
    retry: false,
    onSuccess: async result => {
      const notable = result.added.length + result.linked.length + result.deactivated.length + result.conflicts.length + result.skipped.length > 0;
      // Auto-sync stays quiet unless something changed or needs attention.
      if (!autoRef.current || notable) setSyncResult(result);
      if (!autoRef.current) toast.success("노션 고객 동기화를 마쳤습니다.");
      autoRef.current = false; setAuto(false);
      await Promise.all([utils.billing.month.invalidate(), utils.billing.customers.invalidate(), utils.billing.status.invalidate()]);
    },
    onError: e => { toast.error(autoRef.current ? `자동 동기화 실패: ${e.message}` : e.message); autoRef.current = false; setAuto(false); },
  });
  const triedAuto = useRef(false);
  useEffect(() => {
    if (triedAuto.current || !status.data?.notionConfigured) return;
    triedAuto.current = true;
    const last = status.data.lastSyncedAt ? new Date(status.data.lastSyncedAt).getTime() : 0;
    if (Date.now() - last < AUTO_SYNC_MS) return;
    autoRef.current = true; setAuto(true);
    sync.mutate();
  }, [status.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const setStatus = trpc.billing.setStatus.useMutation({
    retry: false,
    onSuccess: () => utils.billing.month.invalidate({ month }),
    onError: e => toast.error(e.message),
  });

  const rows = query.data?.rows ?? [];
  const byDay = useMemo(() => {
    const map = new Map<number, typeof rows>();
    for (const r of rows) map.set(r.day, [...(map.get(r.day) || []), r]);
    return map;
  }, [rows]);
  const [y, m] = month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const totals = rows.reduce((t, r) => ({ due: t.due + r.monthlyFee, paid: t.paid + (r.paid ? r.monthlyFee : 0), invoices: t.invoices + (r.invoiceIssued ? 1 : 0) }), { due: 0, paid: 0, invoices: 0 });
  const dayRows = selectedDay ? byDay.get(selectedDay) || [] : [];
  const changeMonth = (delta: number) => { const next = shiftMonth(month, delta); setMonth(next); setSelectedDay(next === today.slice(0, 7) ? Number(today.slice(8, 10)) : null); };

  function toggle(row: (typeof rows)[number], patch: { paid?: boolean; invoiceIssued?: boolean }) {
    const paid = patch.paid ?? row.paid;
    const paidAt = patch.paid === true && !row.paidAt ? today : paid ? row.paidAt : "";
    setStatus.mutate({ customerId: row.customerId, month, paid, paidAt, invoiceIssued: patch.invoiceIssued ?? row.invoiceIssued });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white px-4 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-bold tracking-widest text-blue-600">이천계단지기 · ADMIN</p><h1 className="mt-1 text-2xl font-bold">정산 달력</h1></div>
          <nav className="flex gap-2"><Link href="/admin/quotes"><Button variant="outline">견적 관리</Button></Link><Link href="/admin/field"><Button variant="outline">현장관리</Button></Link></nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-600">
            고객 정보는 노션 <b>정기청소 계약관리</b>에서 가져옵니다. 입금·세금계산서 체크는 이 화면에만 저장되고 노션은 바꾸지 않습니다.
            {status.data?.lastSyncedAt && <p className="mt-1 text-xs text-slate-500">화면을 열면 10분마다 자동으로 맞춰요 · 마지막 동기화 {new Date(status.data.lastSyncedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>}
            {status.data && !status.data.notionConfigured && <p className="mt-1 font-medium text-amber-700">노션 연결 키가 아직 설정되지 않아 동기화할 수 없습니다.</p>}
          </div>
          <Button disabled={sync.isPending || !status.data?.notionConfigured} onClick={() => sync.mutate()}>{sync.isPending ? (auto ? "자동 동기화 중…" : "노션에서 가져오는 중…") : "지금 동기화"}</Button>
        </section>

        {syncResult && <SyncSummary result={syncResult} onClose={() => setSyncResult(null)} />}

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="이번 달 입금 예정" value={money(totals.due)} />
          <Stat label="입금 완료" value={money(totals.paid)} tone="text-green-700" />
          <Stat label="미입금" value={money(totals.due - totals.paid)} tone="text-red-600" />
        </div>

        <section className="rounded-xl border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => changeMonth(-1)} aria-label="이전 달">‹</Button>
            <h2 className="text-lg font-bold">{y}년 {m}월</h2>
            <Button variant="outline" size="sm" onClick={() => changeMonth(1)} aria-label="다음 달">›</Button>
          </div>
          {query.isError ? <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{query.error.message}</div> : (
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {WEEK.map((w, i) => <div key={w} className={`py-1 text-xs font-medium ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-slate-500"}`}>{w}</div>)}
              {cells.map((d, i) => {
                if (!d) return <div key={`e${i}`} />;
                const list = byDay.get(d) || [];
                const isToday = `${month}-${String(d).padStart(2, "0")}` === today;
                return (
                  <button key={d} type="button" onClick={() => setSelectedDay(d)} aria-label={`${m}월 ${d}일, 입금 예정 ${list.length}건`}
                    className={`flex min-h-16 flex-col items-center rounded-lg border p-1 ${selectedDay === d ? "border-blue-500 bg-blue-50" : "border-transparent hover:bg-slate-50"}`}>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${isToday ? "bg-blue-600 font-bold text-white" : ""}`}>{d}</span>
                    <span className="mt-1 flex flex-wrap justify-center gap-0.5">
                      {list.map(r => <span key={r.customerId} title={r.name} className={`h-2 w-2 rounded-full ${r.paid ? "bg-green-500" : "bg-red-500"}`} />)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <p className="mt-3 flex gap-4 text-xs text-slate-500"><span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500" />입금 완료</span><span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" />미입금</span><span>31일 입금 고객은 짧은 달엔 말일에 표시돼요.</span></p>
        </section>

        {selectedDay && (
          <section className="rounded-xl border bg-white">
            <h2 className="border-b px-5 py-4 font-semibold">{m}월 {selectedDay}일 입금 예정 <span className="text-blue-600">{dayRows.length}건</span></h2>
            {dayRows.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">이 날 입금 예정 고객이 없습니다.</p> : (
              <ul className="divide-y">
                {dayRows.map(r => (
                  <li key={r.customerId} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-semibold">{r.name}{!r.active && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">비활성</span>}</p>
                      <p className="text-sm text-slate-500">{money(r.monthlyFee)} · 매월 {r.dueDay}일{r.paid && r.paidAt ? ` · ${r.paidAt} 입금` : ""}</p>
                      {r.memo && <p className="mt-1 whitespace-pre-wrap break-words text-xs text-slate-500">{r.memo}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant={r.paid ? "default" : "outline"} className={r.paid ? "bg-green-600 hover:bg-green-700" : "border-red-300 text-red-600"} disabled={setStatus.isPending} onClick={() => toggle(r, { paid: !r.paid })}>{r.paid ? "입금 완료" : "미입금"}</Button>
                      <Button size="sm" variant={r.invoiceIssued ? "default" : "outline"} disabled={setStatus.isPending} onClick={() => toggle(r, { invoiceIssued: !r.invoiceIssued })}>{r.invoiceIssued ? "계산서 발행" : "계산서 미발행"}</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className="rounded-xl border bg-white">
          <button type="button" className="flex w-full items-center justify-between px-5 py-4 font-semibold" onClick={() => setShowCustomers(v => !v)}>
            동기화된 고객 목록 <span className="text-sm text-slate-500">{showCustomers ? "접기" : "펼치기"}</span>
          </button>
          {showCustomers && (customers.isLoading ? <p className="p-6 text-center text-sm">불러오는 중…</p> : (
            <ul className="divide-y border-t text-sm">
              {(customers.data || []).map(c => (
                <li key={c.id} className={`flex flex-wrap justify-between gap-2 px-5 py-3 ${c.active ? "" : "text-slate-400"}`}>
                  <span className="font-medium">{c.name}{!c.active && " (비활성)"}</span>
                  <span>{money(c.monthlyFee)} · {c.dueDay ? `매월 ${c.dueDay}일` : "입금일 없음"}</span>
                  {!c.active && c.inactiveReason && <span className="w-full text-xs">{c.inactiveReason}</span>}
                </li>
              ))}
              {!customers.data?.length && <li className="p-6 text-center text-slate-500">아직 동기화된 고객이 없습니다.</li>}
            </ul>
          ))}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, tone = "text-blue-700" }: { label: string; value: string; tone?: string }) {
  return <section className="rounded-xl border bg-white p-4"><p className="text-sm text-slate-500">{label}</p><p className={`mt-1 text-xl font-bold tabular-nums ${tone}`}>{value}</p></section>;
}

function SyncSummary({ result, onClose }: { result: SyncResult; onClose: () => void }) {
  const warn = result.conflicts.length + result.skipped.length > 0;
  return (
    <section role="status" className={`rounded-xl border p-4 text-sm ${warn ? "border-amber-300 bg-amber-50" : "border-green-200 bg-green-50"}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold">노션 {result.read}건 확인 · 새 고객 {result.added.length} · 갱신 {result.updated} · 이름으로 연결 {result.linked.length} · 비활성 {result.deactivated.length}</p>
        <button type="button" onClick={onClose} className="text-slate-500" aria-label="닫기">✕</button>
      </div>
      {result.added.length > 0 && <p className="mt-2">새로 추가: {result.added.join(", ")}</p>}
      {result.linked.length > 0 && <p className="mt-1">기존 고객과 연결: {result.linked.join(", ")}</p>}
      {[...result.deactivated.map(d => ["비활성", d] as const), ...result.conflicts.map(d => ["확인 필요", d] as const), ...result.skipped.map(d => ["건너뜀", d] as const)].map(([tag, d], i) =>
        <p key={i} className="mt-1"><b>{tag}</b> {d.name}: {d.reason}</p>)}
    </section>
  );
}
