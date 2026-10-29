import { useEffect, useRef, useState, type FocusEvent } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useHomeMotion } from "@/components/HomeMotion";
import { navGroups } from "@/data/navMenu";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { useAllWorkPosts } from "@/hooks/useAllWorkPosts";
import { getWorkPath } from "@/lib/workSlug";

// 지역 이름은 상단 메뉴의 관리지역 목록(/area/<slug>)에서 가져온다
const AREA_LABELS: Record<string, string> = {
  downtown: "이천 시내권",
  ...Object.fromEntries(
    navGroups
      .flatMap((group) => group.items)
      .filter((item) => item.href.startsWith("/area/"))
      .map((item) => [item.href.slice("/area/".length), item.label])
  ),
};

// 타임라인에서 돌아가는 최신 작업일지 개수
const POST_COUNT = 8;
// 카드가 화면에 들어온 뒤 맨 위(가장 최신) 글을 읽을 시간을 두고 움직이기 시작한다
const START_DELAY_MS = 1500;

function WorkLogRow({ post, duplicate = false }: { post: AreaPost; duplicate?: boolean }) {
  const areaLabel = post.area ? AREA_LABELS[post.area] : undefined;
  const kind = post.workType || post.buildingType;

  return (
    <Link
      href={getWorkPath(post)}
      // 끊김 없이 반복하려고 한 번 더 그린 목록은 화면에만 보이고, 스크린리더·키보드에서는 건너뛴다
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      className="group grid grid-cols-[116px_minmax(0,1fr)] gap-8 focus:outline-none"
    >
      <div className="pt-0.5">
        <p className="text-base font-bold text-slate-500">{post.date}</p>
        {areaLabel ? <p className="mt-1.5 text-sm font-extrabold text-primary">{areaLabel}</p> : null}
        {kind ? <p className="mt-0.5 text-xs font-semibold text-slate-400">{kind}</p> : null}
      </div>
      <div className="relative pb-9 pl-8 before:absolute before:left-[5px] before:top-3 before:h-full before:w-px before:bg-blue-100">
        <span className="absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full bg-primary ring-4 ring-blue-50" />
        <h3 className="text-xl font-extrabold leading-snug text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
          {post.title}
          {/* 줄마다 '보기' 버튼을 두지 않고, 마우스를 올린 글에만 화살표를 띄워 누를 수 있음을 알린다 */}
          <ArrowRight
            aria-hidden="true"
            className="ml-1.5 inline-block h-5 w-5 -translate-x-1 align-[-0.15em] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          />
        </h3>
        {post.description ? (
          <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{post.description}</p>
        ) : null}
      </div>
    </Link>
  );
}

// PC 홈: 노션 작업일지 최신 글이 흰 카드 안에서 아래에서 위로 천천히 자동 스크롤된다 (무한 반복).
// 마우스를 올리거나 키보드로 글에 들어가면 멈춘다.
export default function HomeWorkLogTimeline() {
  const { posts } = useAllWorkPosts("home-work-log", { live: false });
  const { reveal, reduced } = useHomeMotion();
  const [paused, setPaused] = useState(false);
  const latest = posts.slice(0, POST_COUNT);

  // 페이지를 열자마자 돌기 시작하면 이 섹션까지 내려왔을 때 중간 글부터 보이므로, 화면에 들어온 뒤에 시작한다
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.5 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setTimeout(() => setStarted(true), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [inView]);

  if (latest.length === 0) return null;

  // 같은 목록을 두 벌 이어 붙이고 -50%(목록 한 벌 높이)까지 올려 끊김 없이 반복한다.
  // 움직임 줄이기 설정이면 한 벌만 두고 직접 스크롤하게 한다.
  const sets = reduced ? [false] : [false, true];
  const scrollDuration = Math.max(latest.length * 5, 20);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    // 키보드 이동 중 브라우저가 카드 안을 스크롤했으면 처음 위치로 되돌리고 다시 움직인다
    if (!reduced) event.currentTarget.scrollTop = 0;
    setPaused(false);
  };

  return (
    <section className="bg-blue-50/60 py-16 md:py-24">
      <motion.div className="container max-w-6xl" {...reveal(0, 32)}>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-extrabold tracking-[0.28em] text-primary">WORK LOG</p>
          <h2 className="font-['GmarketSans'] text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
            <span className="text-primary">최신 작업일지</span> 확인하기
          </h2>
          <p className="mt-2.5 text-sm text-muted-foreground md:text-base">
            부부가 직접 다녀온 이천 현장을 날짜순으로 기록합니다
          </p>
        </div>

        <div
          ref={cardRef}
          className="relative mx-auto h-[420px] max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.05)]"
        >
          <div
            // 위 여백은 움직이는 목록 밖에 둔다. 그래야 목록 한 벌만큼 올라간 순간 첫 글이 처음과 같은 자리에 와서 이음새가 없다
            className={`h-full px-12 pt-[4.5rem] ${reduced ? "overflow-y-auto" : "overflow-hidden"}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={handleBlur}
          >
            <div
              style={
                reduced
                  ? undefined
                  : {
                      animation: `blogScrollUp ${scrollDuration}s linear infinite`,
                      animationPlayState: started && !paused ? "running" : "paused",
                    }
              }
            >
              {sets.map((duplicate) => (
                <div key={duplicate ? "loop" : "list"}>
                  {latest.map((post, index) => (
                    <WorkLogRow key={`${getWorkPath(post)}-${index}`} post={post} duplicate={duplicate} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 위·아래 페이드로 글이 자연스럽게 사라지고 나타나게 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/records"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            전체 작업일지 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
