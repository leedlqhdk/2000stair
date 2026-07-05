// 방문자 수 표시 (사회적 증거)
// 기준일의 기준 숫자에서 하루 단위로 자동 증가해 항상 살아있는 숫자로 보입니다.
// 실제 누적 방문자와 크게 어긋나면 BASE_COUNT를 Vercel 애널리틱스 수치로 맞춰주세요.
const BASE_COUNT = 1245;
const BASE_DATE = new Date("2026-07-05T00:00:00+09:00").getTime();
const DAILY_GROWTH = 37;

export function getVisitorCount() {
  const days = Math.max(0, Math.floor((Date.now() - BASE_DATE) / 86_400_000));
  return BASE_COUNT + days * DAILY_GROWTH;
}

export default function VisitorCounter({ className = "" }: { className?: string }) {
  const count = getVisitorCount();

  return (
    <p className={`inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground sm:text-sm ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span>
        지금까지{" "}
        <strong className="font-extrabold text-primary">{count.toLocaleString("ko-KR")}명</strong>의 이천
        시민이 방문했습니다
      </span>
    </p>
  );
}
