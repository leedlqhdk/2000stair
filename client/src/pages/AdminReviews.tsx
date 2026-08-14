import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, LogIn, PenLine, Plus, Star, Trash2, X } from "lucide-react";

const COLOR_PRESETS = [
  { label: "네이버", value: "#35b957" },
  { label: "숨고", value: "#6b4eff" },
  { label: "당근", value: "#f47a22" },
  { label: "카카오", value: "#f7c600" },
  { label: "구글", value: "#2d6ff2" },
];

const EMPTY_FORM = {
  platform: "",
  dotColor: "#35b957",
  score: "5.0",
  quote: "",
  detail: "",
  url: "",
};

type ReviewForm = typeof EMPTY_FORM;

export default function AdminReviews() {
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<ReviewForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();

  const { data: reviews, isLoading } = trpc.reviews.list.useQuery(undefined, {
    enabled: isAdmin,
  });

  const invalidate = () => utils.reviews.list.invalidate();

  const passwordLogin = trpc.auth.passwordLogin.useMutation({
    onSuccess: async (data) => {
      toast.success("관리자 로그인 완료");
      setPassword("");
      utils.auth.me.setData(undefined, data.user);
      await invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("후기가 추가되었습니다.");
      setForm(EMPTY_FORM);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateReview = trpc.reviews.update.useMutation({
    onSuccess: () => {
      toast.success("후기가 수정되었습니다.");
      setForm(EMPTY_FORM);
      setEditingId(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteReview = trpc.reviews.delete.useMutation({
    onSuccess: () => {
      toast.success("후기가 삭제되었습니다.");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const swapOrder = trpc.reviews.swapOrder.useMutation({
    onSuccess: () => invalidate(),
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
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-primary">ADMIN</p>
          <h1 className="mb-3 text-2xl font-extrabold text-foreground">관리자 비밀번호가 필요합니다</h1>
          <p className="mb-6 text-sm leading-7 text-muted-foreground">
            고객 후기는 관리자 비밀번호를 입력한 뒤 추가, 수정, 삭제할 수 있습니다.
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
            <Button
              type="submit"
              disabled={passwordLogin.isPending}
              className="h-12 w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <LogIn className="h-4 w-4" />
              {passwordLogin.isPending ? "확인 중" : "관리자 로그인"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const startEdit = (review: NonNullable<typeof reviews>[number]) => {
    setEditingId(review.id);
    setForm({
      platform: review.platform,
      dotColor: review.dotColor,
      score: review.score,
      quote: review.quote,
      detail: review.detail,
      url: review.url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.platform || !form.quote || !form.url) {
      toast.error("플랫폼, 후기 내용, 링크는 필수입니다.");
      return;
    }
    if (editingId !== null) {
      updateReview.mutate({ id: editingId, ...form });
    } else {
      createReview.mutate(form);
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    if (!reviews) return;
    const target = reviews[index + direction];
    if (!target) return;
    swapOrder.mutate({ idA: reviews[index].id, idB: target.id });
  };

  const saving = createReview.isPending || updateReview.isPending;
  const inputClass =
    "h-11 w-full rounded-xl border border-blue-100 bg-white px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">고객 후기 관리</h1>
          <p className="mt-1 text-sm text-gray-400">
            메인·서비스 페이지 후기 카드 {reviews?.length ?? 0}개
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm">글 관리</Button>
          </Link>
          <Link href="/admin/quotes">
            <Button variant="outline" size="sm">견적 관리</Button>
          </Link>
        </div>
      </div>

      {/* 추가/수정 폼 */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm md:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-foreground">
            {editingId !== null ? "후기 수정" : "새 후기 추가"}
          </h2>
          {editingId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              수정 취소
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">플랫폼 이름 *</label>
            <input
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              placeholder="예: 네이버 리뷰"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">평점 *</label>
            <input
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
              placeholder="예: 5.0"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-600">후기 내용 *</label>
          <textarea
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="고객 후기 문장을 입력하세요"
            rows={2}
            className="w-full rounded-xl border border-blue-100 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              출처 표시 (지역·작성자 등)
            </label>
            <input
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
              placeholder="예: 신둔면"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">전체보기 링크 *</label>
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-600">포인트 색상</label>
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setForm({ ...form, dotColor: preset.value })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  form.dotColor === preset.value
                    ? "border-blue-500 bg-blue-50 text-primary"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.value }} />
                {preset.label}
              </button>
            ))}
            <input
              type="color"
              value={form.dotColor}
              onChange={(e) => setForm({ ...form, dotColor: e.target.value })}
              className="h-8 w-8 cursor-pointer rounded-full border border-gray-200"
              title="직접 선택"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
        >
          {editingId !== null ? <PenLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {saving ? "저장 중..." : editingId !== null ? "후기 수정하기" : "후기 추가하기"}
        </Button>
      </form>

      {/* 후기 목록 */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !reviews?.length ? (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 py-14 text-center text-sm text-muted-foreground">
          아직 등록된 후기가 없어 사이트에는 기본 후기 3개가 표시됩니다.
          <br />위 폼에서 후기를 추가하면 기본 후기 대신 노출됩니다.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="flex items-center gap-4 rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || swapOrder.isPending}
                  className="rounded p-1 text-gray-300 transition hover:text-primary disabled:opacity-30"
                  title="위로"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === reviews.length - 1 || swapOrder.isPending}
                  className="rounded p-1 text-gray-300 transition hover:text-primary disabled:opacity-30"
                  title="아래로"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: review.dotColor }} />
                  <span className="truncate text-sm font-bold text-gray-900">{review.platform}</span>
                  <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-extrabold text-primary">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    {review.score}
                  </span>
                </div>
                <p className="truncate text-sm text-gray-600">“{review.quote}”</p>
                {review.detail ? (
                  <p className="mt-0.5 text-xs text-gray-400">{review.detail}</p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(review)}
                  className="text-gray-400 hover:text-blue-600"
                  title="수정"
                >
                  <PenLine className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm(`"${review.platform}" 후기를 삭제하시겠습니까?`)) {
                      deleteReview.mutate({ id: review.id });
                    }
                  }}
                  className="text-gray-400 hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
