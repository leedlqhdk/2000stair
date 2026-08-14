import { useState, type FormEvent } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Phone, MapPin, User, Mail, MessageSquare, LogIn, Clock } from "lucide-react";
import { Link } from "wouter";

const STATUS_LABELS: Record<string, string> = {
  pending: "대기",
  contacted: "연락완료",
  confirmed: "확정",
  canceled: "취소",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  canceled: "bg-gray-100 text-gray-500 border-gray-200",
};

const PLAN_NAMES: Record<string, string> = {
  stair_2_3: "2-3층 계단",
  stair_4: "4층 계단",
  stair_5_6: "5-6층 계단",
  bathroom: "화장실/유리청소",
};

function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function AdminQuotes() {
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();

  const { data: quotes, isLoading } = trpc.quote.list.useQuery(undefined, {
    enabled: isAdmin,
  });

  const passwordLogin = trpc.auth.passwordLogin.useMutation({
    onSuccess: async (data) => {
      toast.success("관리자 로그인 완료");
      setPassword("");
      utils.auth.me.setData(undefined, data.user);
      await utils.quote.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateStatus = trpc.quote.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("상태가 업데이트되었습니다.");
      utils.quote.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const handlePasswordLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }
    passwordLogin.mutate({ password });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-blue-50/30 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-[1.5rem] border border-blue-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold tracking-[0.25em] text-primary mb-3">ADMIN</p>
          <h1 className="text-2xl font-extrabold text-foreground mb-3">관리자 비밀번호가 필요합니다</h1>
          <p className="text-sm leading-7 text-muted-foreground mb-6">
            견적 신청 목록은 관리자 비밀번호를 입력한 뒤 확인할 수 있습니다.
          </p>
          <form onSubmit={handlePasswordLogin} className="mx-auto max-w-sm space-y-3 text-left">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="admin-password">
              관리자 비밀번호
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="비밀번호 입력"
              className="h-12 w-full rounded-xl border border-blue-100 bg-white px-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <Button type="submit" className="w-full" disabled={passwordLogin.isPending}>
              <LogIn className="w-4 h-4 mr-2" />
              {passwordLogin.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const pending = quotes?.filter((q) => q.status === "pending") ?? [];
  const others = quotes?.filter((q) => q.status !== "pending") ?? [];

  return (
    <div className="min-h-screen bg-blue-50/30 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-primary mb-1">ADMIN</p>
            <h1 className="text-2xl font-extrabold text-foreground">견적 신청 목록</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/blog">
              <Button variant="outline" size="sm">블로그 관리</Button>
            </Link>
          </div>
        </div>

        {/* 통계 */}
        {quotes && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["pending", "contacted", "confirmed", "canceled"] as const).map((s) => (
              <div key={s} className="rounded-xl border bg-white p-4 text-center shadow-sm">
                <div className="text-2xl font-extrabold text-foreground">
                  {quotes.filter((q) => q.status === s).length}
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">{STATUS_LABELS[s]}</div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {quotes?.length === 0 && (
          <div className="rounded-2xl border bg-white p-12 text-center text-muted-foreground shadow-sm">
            아직 견적 신청이 없습니다.
          </div>
        )}

        {/* 대기 중 */}
        {pending.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-yellow-700 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 응답 대기 ({pending.length}건)
            </h2>
            <div className="space-y-3">
              {pending.map((q) => (
                <QuoteCard key={q.id} quote={q} onStatusChange={(status) => updateStatus.mutate({ id: q.id, status })} isPending={updateStatus.isPending} />
              ))}
            </div>
          </div>
        )}

        {/* 나머지 */}
        {others.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-muted-foreground mb-3">처리된 신청</h2>
            <div className="space-y-3">
              {others.map((q) => (
                <QuoteCard key={q.id} quote={q} onStatusChange={(status) => updateStatus.mutate({ id: q.id, status })} isPending={updateStatus.isPending} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type Quote = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  address: string;
  serviceType: "in_person" | "non_contact";
  planId: string;
  message?: string | null;
  status: "pending" | "contacted" | "confirmed" | "canceled";
  createdAt: string | Date;
};

function QuoteCard({ quote, onStatusChange, isPending }: {
  quote: Quote;
  onStatusChange: (status: Quote["status"]) => void;
  isPending: boolean;
}) {
  const nextStatuses: Quote["status"][] = (["pending", "contacted", "confirmed", "canceled"] as const).filter(
    (s) => s !== quote.status
  );

  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm transition ${quote.status === "canceled" ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[quote.status]}`}>
            {STATUS_LABELS[quote.status]}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(quote.createdAt)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {nextStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              disabled={isPending}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition hover:opacity-80 disabled:opacity-40 ${STATUS_COLORS[s]}`}
            >
              → {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <User className="w-4 h-4 text-muted-foreground shrink-0" />
          {quote.name}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
          <a href={`tel:${quote.phone}`} className="text-primary font-semibold hover:underline">
            {quote.phone}
          </a>
        </div>
        {quote.email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4 shrink-0" />
            {quote.email}
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          {quote.address}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
          {PLAN_NAMES[quote.planId] ?? quote.planId}
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
          {quote.serviceType === "in_person" ? "대면" : "비대면"}
        </span>
      </div>

      {quote.message && (
        <div className="mt-3 flex gap-2 rounded-xl bg-slate-50 p-3 text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{quote.message}</span>
        </div>
      )}
    </div>
  );
}
