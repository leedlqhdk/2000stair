import { useEffect, useMemo, useRef, useState, type FocusEvent } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { OFFICIAL_CHANNELS } from "@/components/ChannelLinks";
import { useHomeMotion } from "@/components/HomeMotion";
import { Skeleton } from "@/components/ui/skeleton";
import { navGroups } from "@/data/navMenu";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { useAllWorkPosts } from "@/hooks/useAllWorkPosts";
import { useLatestBlogPosts, type BlogPost } from "@/hooks/useLatestBlogPosts";
import { trackConversion } from "@/lib/analytics";
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

// 타임라인에서 돌아가는 최신 글 개수
const POST_COUNT = 8;
// 카드가 화면에 들어온 뒤 맨 위(가장 최신) 글을 읽을 시간을 두고 움직이기 시작한다
const START_DELAY_MS = 1500;

const blogChannel = OFFICIAL_CHANNELS.find((channel) => channel.key === "blog") ?? OFFICIAL_CHANNELS[0];

// 노션 작업일지와 네이버 블로그 글을 같은 줄 형식으로 맞춘다
type TimelineItem =
  | { source: "work"; key: string; date: string; title: string; description: string; href: string; area?: string; kind?: string }
  | { source: "blog"; key: string; date: string; title: string; description: string; href: string };

function naverPostId(url?: string) {
  return url?.match(/blog\.naver\.com\/[^/?#]+\/(\d+)/)?.[1];
}

/** 작업일지와 블로그 글을 날짜(YYYY.MM.DD) 최신순으로 섞는다. 같은 날이면 작업일지가 먼저 온다 */
function mergeTimeline(workPosts: AreaPost[], blogPosts: BlogPost[]): TimelineItem[] {
  // 작업일지에 블로그 링크로 연결된 글은 블로그 쪽에서 빼서 같은 글이 두 번 나오지 않게 한다
  const linkedBlogIds = new Set(workPosts.map((post) => naverPostId(post.blogUrl)).filter(Boolean));

  const items: TimelineItem[] = [
    ...workPosts.map((post) => ({
      source: "work" as const,
      key: getWorkPath(post),
      date: post.date,
      title: post.title,
      description: post.description ?? "",
      href: getWorkPath(post),
      area: post.area ? AREA_LABELS[post.area] : undefined,
      kind: post.workType || post.buildingType || undefined,
    })),
    ...blogPosts
      .filter((post) => !linkedBlogIds.has(naverPostId(post.link)))
      .map((post) => ({
        source: "blog" as const,
        key: post.link,
        date: post.date,
        title: post.title,
        description: post.summary,
        href: post.link,
      })),
  ];

  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, POST_COUNT);
}

function RowBody({ item }: { item: TimelineItem }) {
  // 블로그 글은 새 탭에서 열리므로 화살표 모양을 달리한다
  const Arrow = item.source === "blog" ? ArrowUpRight : ArrowRight;

  return (
    <>
      <div className="pt-0.5">
        <p className="text-base font-bold text-slate-500">{item.date}</p>
        {item.source === "blog" ? (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#03c75a]">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-[#03c75a] text-[10px] font-black text-white">
              N
            </span>
            블로그
          </p>
        ) : (
          <>
            {item.area ? <p className="mt-1.5 text-sm font-extrabold text-primary">{item.area}</p> : null}
            {item.kind ? <p className="mt-0.5 text-xs font-semibold text-slate-400">{item.kind}</p> : null}
          </>
        )}
      </div>
      <div className="relative pb-9 pl-8 before:absolute before:left-[5px] before:top-3 before:h-full before:w-px before:bg-blue-100">
        <span className="absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full bg-primary ring-4 ring-blue-50" />
        <h3 className="text-xl font-extrabold leading-snug text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
          {item.title}
          {/* 줄마다 '보기' 버튼을 두지 않고, 마우스를 올린 글에만 화살표를 띄워 누를 수 있음을 알린다 */}
          <Arrow
            aria-hidden="true"
            className="ml-1.5 inline-block h-5 w-5 -translate-x-1 align-[-0.15em] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          />
        </h3>
        {item.description ? (
          <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{item.description}</p>
        ) : null}
      </div>
    </>
  );
}

function TimelineRow({ item, duplicate = false }: { item: TimelineItem; duplicate?: boolean }) {
  const rowProps = {
    // 끊김 없이 반복하려고 한 번 더 그린 목록은 화면에만 보이고, 스크린리더·키보드에서는 건너뛴다
    "aria-hidden": duplicate || undefined,
    tabIndex: duplicate ? -1 : undefined,
    className: "group grid grid-cols-[116px_minmax(0,1fr)] gap-8 focus:outline-none",
  };

  if (item.source === "blog") {
    return (
      <a
        {...rowProps}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackConversion("review_click", { location: "home_work_log", label: item.title })}
      >
        <RowBody item={item} />
      </a>
    );
  }

  return (
    <Link {...rowProps} href={item.href}>
      <RowBody item={item} />
    </Link>
  );
}

// PC 홈: 노션 작업일지와 네이버 블로그의 최신 글이 흰 카드 안에서 아래에서 위로 천천히 자동 스크롤된다 (무한 반복).
// 마우스를 올리거나 키보드로 글에 들어가면 멈춘다.
export default function HomeWorkLogTimeline() {
  const workLog = useAllWorkPosts("home-work-log", { live: false });
  const blog = useLatestBlogPosts();
  const { reveal, reduced } = useHomeMotion();
  const [paused, setPaused] = useState(false);

  // 두 곳 모두 응답한 뒤에 목록을 그린다 (기본 작업 기록이 잠깐 보였다가 바뀌지 않게)
  const ready = !workLog.isPlaceholderData && !blog.isPending;
  const items = useMemo(
    () => (ready ? mergeTimeline(workLog.posts, blog.data ?? []) : []),
    [ready, workLog.posts, blog.data]
  );

  // 페이지를 열자마자 돌기 시작하면 이 섹션까지 내려왔을 때 중간 글부터 보이므로, 화면에 들어온 뒤에 시작한다
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.5 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!inView || !ready) return;
    const timer = window.setTimeout(() => setStarted(true), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [inView, ready]);

  if (ready && items.length === 0) return null;

  // 같은 목록을 두 벌 이어 붙이고 -50%(목록 한 벌 높이)까지 올려 끊김 없이 반복한다.
  // 움직임 줄이기 설정이면 한 벌만 두고 직접 스크롤하게 한다.
  const sets = reduced ? [false] : [false, true];
  const scrollDuration = Math.max(items.length * 5, 20);

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
            현장 작업일지와 블로그 글을 날짜순으로 모았습니다
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
            {ready ? (
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
                    {items.map((item) => (
                      <TimelineRow key={item.key} item={item} duplicate={duplicate} />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div aria-hidden="true" className="space-y-10">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="grid grid-cols-[116px_minmax(0,1fr)] gap-8">
                    <Skeleton className="h-5 w-24" />
                    <div className="space-y-3 pl-8">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 위·아래 페이드로 글이 자연스럽게 사라지고 나타나게 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/records"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            전체 작업일지 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={blogChannel.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion("review_click", { location: "home_work_log", label: "네이버 블로그 보기" })}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition hover:bg-blue-50"
          >
            네이버 블로그 보기
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
