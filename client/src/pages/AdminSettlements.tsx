import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SettlementAppInstall from "@/components/SettlementAppInstall";
import "./settlements-app.css";

const money = (value: number) => `${value.toLocaleString("ko-KR")}원`;
const currentMonth = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit" }).format(new Date());
const emptyForm = (month: string) => ({ building: "", month, billed: "", paid: "0", paidAt: "", memo: "" });
const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";
export default function AdminSettlements() {
  return <div className="settlements-app"><SettlementAppInstall /><SettlementContent /></div>;
}
function SettlementContent() {
  const { user, loading } = useAuth();
  const admin = user?.role === "admin";
  const [password, setPassword] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("전체");
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const query = trpc.settlements.list.useQuery({ month }, { enabled: admin, retry: false, refetchOnWindowFocus: true });
  const login = trpc.auth.passwordLogin.useMutation({ onSuccess: data => { utils.auth.me.setData(undefined, data.user); setPassword(""); }, onError: e => toast.error(e.message) });
  const saved = async () => { toast.success("노션에 저장했습니다."); setForm(null); setEditingId(null); await utils.settlements.list.invalidate(); };
  const create = trpc.settlements.create.useMutation({ onSuccess: saved, onError: e => toast.error(e.message), retry: false });
  const update = trpc.settlements.update.useMutation({ onSuccess: saved, onError: e => toast.error(e.message), retry: false });
  const saving = create.isPending || update.isPending;
  const rows = query.data?.rows || [];
  const filtered = rows.filter(row => row.building.toLowerCase().includes(search.trim().toLowerCase()) && (status === "전체" || row.status === status));
  const totals = rows.reduce((sum, row) => ({ billed: sum.billed + row.billed, paid: sum.paid + row.paid, outstanding: sum.outstanding + row.outstanding }), { billed: 0, paid: 0, outstanding: 0 });
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form || saving) return;
    const input = { ...form, billed: Number(form.billed), paid: Number(form.paid) };
    if (editingId) update.mutate({ ...input, id: editingId });
    else create.mutate(input);
  }
  if (loading) return <div className="p-12 text-center">관리자 확인 중…</div>;
  if (!admin) return <main className="min-h-screen bg-slate-50 px-4 py-20"><form className="mx-auto max-w-md space-y-5 rounded-2xl border bg-white p-8" onSubmit={e => { e.preventDefault(); login.mutate({ password }); }}><p className="text-sm font-bold text-blue-600">이천계단지기 · 관리자</p><h1 className="text-2xl font-bold">정산리스트 로그인</h1><p className="text-sm text-slate-500">정산 내역은 관리자만 확인할 수 있습니다.</p><label className="block">관리자 비밀번호<input className={`${inputClass} mt-2`} type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label><Button className="w-full" disabled={login.isPending}>{login.isPending ? "확인 중…" : "로그인"}</Button></form></main>;
  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b bg-white px-4 py-5"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-widest text-blue-600">이천계단지기 · ADMIN</p><h1 className="mt-1 text-2xl font-bold">정산리스트</h1></div><nav className="flex gap-2"><Link href="/admin/quotes"><Button variant="outline">견적 관리</Button></Link><Link href="/admin/field"><Button variant="outline">현장관리</Button></Link></nav></div></header>
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-lg font-semibold">건물별 청구와 입금을 한눈에</h2><p className="mt-1 text-sm text-slate-500">저장한 내역은 노션에 반영됩니다. 노션에서 변경한 내용은 새로고침으로 확인하세요.</p></div><div className="flex gap-2"><Button variant="outline" disabled={query.isFetching || saving} onClick={() => query.refetch()}>{query.isFetching ? "불러오는 중…" : "새로고침"}</Button><Button disabled={!query.data?.configured || query.isError || saving} onClick={() => { setEditingId(null); setForm(emptyForm(month)); }}>정산 등록</Button></div></div>
      <div className="flex flex-wrap gap-3"><label className="text-sm font-medium">정산월<input aria-label="정산월" className={`${inputClass} mt-1`} type="month" required value={month} onChange={e => { if (e.target.value) setMonth(e.target.value); }} /></label><label className="min-w-48 flex-1 text-sm font-medium">건물 검색<input className={`${inputClass} mt-1`} placeholder="건물명으로 검색" value={search} onChange={e => setSearch(e.target.value)} /></label><label className="text-sm font-medium">입금 상태<select className={`${inputClass} mt-1`} value={status} onChange={e => setStatus(e.target.value)}>{["전체", "미입금", "부분입금", "입금완료", "초과입금"].map(s => <option key={s}>{s}</option>)}</select></label></div>
      {query.isError ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5">{query.error.message}<p className="mt-2 text-sm">합계는 표시하지 않습니다. 연결 상태를 확인한 뒤 새로고침해주세요.</p></div> : query.isLoading ? <div className="rounded-xl border bg-white p-10 text-center" role="status">노션 정산 내역을 불러오고 있습니다…</div> : query.data && !query.data.configured ? <section className="rounded-xl border border-blue-200 bg-white p-6"><h2 className="text-lg font-bold">노션 정산 표를 연결해주세요</h2><p className="mt-2 text-sm leading-7 text-slate-600">노션에 건물명, 정산월, 청구금액, 입금액, 입금일, 메모 항목이 있는 정산 표를 준비해주세요. 연결이 완료되면 이 화면에서 조회와 등록·수정이 가능합니다.</p></section> : <>
      <div className="grid gap-3 sm:grid-cols-3">{([["월 청구금액", totals.billed], ["월 입금액", totals.paid], ["월 미수금", totals.outstanding]] as const).map(([label, value]) => <section key={label} className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${label === "월 미수금" ? "text-amber-700" : "text-blue-700"}`}>{money(value)}</p></section>)}</div><p className="text-xs text-slate-500">합계는 선택한 정산월 전체 기준입니다. 초과입금은 다른 건물의 미수금에서 차감하지 않습니다.</p>
      <section className="overflow-hidden rounded-xl border bg-white"><div className="border-b px-5 py-4 font-semibold">정산 내역 <span className="text-blue-600">{filtered.length}건</span></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{["건물명", "청구금액", "입금액", "미수금", "상태", "입금일", "관리"].map(h => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{filtered.map(row => <tr key={row.id} className="border-t hover:bg-blue-50/30"><td className="px-4 py-4"><span className="font-semibold">{row.building || "이름 없음"}</span>{row.memo && <p className="mt-1 max-w-60 whitespace-pre-wrap break-words text-xs text-slate-500">{row.memo}</p>}</td><td className="px-4 py-4 tabular-nums">{money(row.billed)}</td><td className="px-4 py-4 tabular-nums">{money(row.paid)}</td><td className="px-4 py-4 tabular-nums">{money(row.outstanding)}</td><td className="px-4 py-4"><span className={`rounded-full px-2 py-1 text-xs ${row.status === "입금완료" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-800"}`}>{row.status}</span></td><td className="px-4 py-4">{row.paidAt || "—"}</td><td className="px-4 py-4"><Button variant="outline" size="sm" disabled={saving} onClick={() => { setEditingId(row.id); setForm({ building: row.building, month: row.month, billed: String(row.billed), paid: String(row.paid), paidAt: row.paidAt, memo: row.memo }); }}>수정</Button><a className="ml-3 text-blue-700 underline" href={`https://www.notion.so/${row.id.replace(/-/g, "")}`} target="_blank" rel="noopener noreferrer">노션</a></td></tr>)}</tbody></table></div>{!filtered.length && <p className="p-12 text-center text-slate-500">{rows.length ? "검색 조건에 맞는 내역이 없습니다." : "이번 달에 등록된 정산 내역이 없습니다."}</p>}</section></>}
      {form && <section className="rounded-xl border border-blue-200 bg-white p-6"><h2 className="mb-5 text-lg font-bold">{editingId ? "정산 수정" : "정산 등록"}</h2><form onSubmit={submit}><fieldset disabled={saving} className="grid gap-4 sm:grid-cols-2">{([{ key: "building", label: "건물명", type: "text" }, { key: "month", label: "정산월", type: "month" }, { key: "billed", label: "청구금액 (원)", type: "number" }, { key: "paid", label: "입금액 (원)", type: "number" }, { key: "paidAt", label: "입금일 (선택)", type: "date" }] as const).map(field => <label key={field.key} className="text-sm font-medium">{field.label}<input className={`${inputClass} mt-1`} type={field.type} required={field.key !== "paidAt"} min={field.type === "number" ? 0 : undefined} max={field.type === "number" ? 1000000000 : undefined} step={field.type === "number" ? 1 : undefined} maxLength={field.key === "building" ? 200 : undefined} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} /></label>)}<label className="text-sm font-medium sm:col-span-2">메모<textarea className={`${inputClass} mt-1`} rows={3} maxLength={2000} value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} /></label><div className="flex gap-2 sm:col-span-2"><Button type="submit">{saving ? "노션에 저장 중…" : "노션에 저장"}</Button><Button type="button" variant="outline" onClick={() => { setForm(null); setEditingId(null); }}>취소</Button></div></fieldset></form></section>}
    </div>
  </main>;
}
