import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { ArrowRight, CalendarDays, CheckCircle2, Menu, MousePointerClick, Star } from "lucide-react";
import { motion } from "framer-motion";
import { daewolPosts } from "@/data/areas/daewol";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";

const areaCards = [
  { name: "신둔면", slug: "sindun", note: "신둔면", position: "top-[31%] left-[37%]", active: false },
  { name: "마장면", slug: "majang", note: "마장면", position: "top-[58%] left-[31%]", active: false },
  { name: "시내권", slug: "downtown", note: "시내권", position: "top-[47%] left-[53%]", active: false },
  { name: "부발읍", slug: "bubal", note: "부발읍", position: "top-[42%] left-[72%]", active: true },
  { name: "대월면", slug: "daewol", note: "대월면", position: "top-[68%] left-[66%]", active: false },
];

const reviews = [
  {
    source: "당근 후기",
    sourceClass: "text-[#f47a22]",
    area: "동네 주민 후기",
    text: "동네 주민분들이 남겨주신 실제 후기를 확인해보세요.",
    href: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
  },
  {
    source: "숨고 리뷰",
    sourceClass: "text-[#6b4eff]",
    area: "전문 서비스 리뷰",
    text: "계단·화장실·건물 내부 청소 후기를 확인해보세요.",
    href: "https://soomgo.com/profile/users/3729049",
  },
  {
    source: "네이버 플레이스",
    sourceClass: "text-[#35b957]",
    area: "방문자 리뷰",
    text: "네이버 플레이스에 등록된 실제 리뷰를 확인해보세요.",
    href: "https://map.naver.com/p/entry/place/2097250452?placePath=/home?entry=plt&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202605201835&locale=ko&svcName=map_pcv5&searchType=place&lng=127.4030091&lat=37.3088922&c=15.00,0,0,0,dh",
  },
];

const areaLabels: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  downtown: "시내권",
  bubal: "부발읍",
};

const fallbackRecentPosts = [
  ...majangPosts.map((post) => ({ ...post, area: "majang" })),
  ...daewolPosts.map((post) => ({ ...post, area: "daewol" })),
]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);

function useRecentAreaPosts() {
  return useQuery({
    queryKey: ["area-posts", "recent"],
    queryFn: async () => {
      const response = await fetch("/api/area-posts?limit=12");
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    staleTime: 60_000,
    retry: 1,
  });
}

export default function Blog() {
  const { data: notionRecentPosts, isLoading } = useRecentAreaPosts();
  const recentPosts = notionRecentPosts && notionRecentPosts.length > 0
    ? notionRecentPosts
    : fallbackRecentPosts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/25 to-white">
      <Navbar />

      <main>
        <section className="container max-w-6xl pt-7 pb-12 md:pt-14 md:pb-20">
          <motion.div
            className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold text-white shadow-sm">
                지도 클릭 활성화
                <span className="rounded-full bg-white/20 px-2 py-0.5">하단 지역 선택</span>
              </div>
              <h1 className="mb-3 text-2xl font-extrabold leading-tight text-foreground md:text-4xl">
                관리지역 페이지 모바일 시안
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                지도를 누르면 각 지역별 관리 현황 페이지로 이동합니다. 모바일에서는 손가락으로 바로 고를 수 있게 구성했습니다.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm lg:block">
              <p className="mb-4 text-sm font-extrabold text-foreground">특징</p>
              <Feature text="지도의 각 영역을 터치하여 직관적으로 선택" />
              <Feature text="터치 시 색상 하이라이트로 선택 영역 확인" />
              <Feature text="하단 지역 버튼으로도 빠르게 이동 가능" />
            </div>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <MobilePreview />

            <div className="grid gap-4">
              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm lg:hidden">
                <p className="mb-4 text-sm font-extrabold text-foreground">특징</p>
                <Feature text="지도 영역 터치로 지역 페이지 이동" />
                <Feature text="선택 영역 색상 강조" />
                <Feature text="하단 버튼으로 빠른 이동" />
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <p className="mb-4 text-sm font-extrabold text-foreground">터치 시 인터랙션 예시</p>
                <MiniInteractionExample />
              </div>
            </div>
          </motion.div>

          <section className="mt-12 md:mt-16">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-foreground md:text-2xl">고객님들의 실제 후기</h2>
                <p className="mt-1 text-sm text-muted-foreground">실제 관리 경험을 바탕으로 남겨주신 후기입니다.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <a
                  key={review.source}
                  href={review.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className={`mb-2 text-sm font-bold ${review.sourceClass}`}>{review.source}</p>
                  <p className="text-sm leading-relaxed text-foreground">{review.text}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">{review.area}</p>
                    <span className="inline-flex items-center text-xs font-bold text-primary">
                      후기 보기
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-12 md:mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-foreground md:text-2xl">최근 관리 현장</h2>
                <p className="mt-1 text-sm text-muted-foreground">이천 지역 공용공간 관리 기록입니다.</p>
              </div>
              <Link href="/records">
                <a className="hidden items-center text-sm font-bold text-primary transition hover:opacity-80 md:inline-flex">
                  전체 보기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
                    <Skeleton className="h-56 w-full" />
                    <div className="p-5">
                      <Skeleton className="mb-3 h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recentPosts.slice(0, 3).map((post, index) => {
                  const areaSlug = post.area ?? "downtown";
                  const areaName = areaLabels[areaSlug] ?? areaSlug;
                  const description = post.description || "실제 이천 지역 계단청소 현장 기록입니다.";

                  return (
                    <Link key={`${areaSlug}-${post.title}-${index}`} href={`/area/${areaSlug}`}>
                      <article className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                        <div className="relative h-56 overflow-hidden bg-blue-50">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                          <div className="absolute bottom-5 left-5 right-5">
                            <div className="mb-2 flex items-center gap-1 text-xs text-white/80">
                              <CalendarDays className="h-3 w-3" />
                              <span>{post.date}</span>
                            </div>
                            <h3 className="line-clamp-2 text-xl font-extrabold leading-snug text-white">{post.title}</h3>
                          </div>
                        </div>
                        <div className="p-5">
                          <p className="mb-2 text-sm font-bold text-primary">{areaName}</p>
                          <p className="line-clamp-1 text-sm text-muted-foreground">{description}</p>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="mb-3 flex items-start gap-3 last:mb-0">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 fill-primary text-white" />
      <p className="text-sm font-semibold leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function MobilePreview() {
  return (
    <div className="mx-auto w-full max-w-[420px] rounded-[2.5rem] border-[9px] border-slate-950 bg-white shadow-2xl md:max-w-[450px]">
      <div className="min-h-[650px] rounded-[1.9rem] bg-white px-4 pb-5 pt-4">
        <div className="mb-5 flex items-center justify-between">
          <img src="/images/icheon-logo-main.png" alt="이천계단지기" className="h-9 w-auto max-w-[165px] object-contain" />
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white" aria-label="메뉴 보기">
            <Menu className="h-5 w-5 text-slate-800" />
          </button>
        </div>

        <p className="mb-2 text-xs font-extrabold text-primary">이천 지역 관리 현황</p>
        <h2 className="mb-1 text-2xl font-extrabold leading-tight text-foreground">원하는 지역을 선택해주세요.</h2>
        <p className="mb-4 text-xs leading-5 text-muted-foreground">지도에서 관리 지역을 터치하면 해당 페이지로 이동합니다.</p>

        <IcheonAreaMap />

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
          <MousePointerClick className="h-4 w-4 text-primary" />
          지도에서 원하는 지역을 터치해주세요.
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {areaCards.map((area) => (
            <Link key={area.slug} href={`/area/${area.slug}`}>
              <a className="rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-extrabold text-primary shadow-sm transition hover:border-primary hover:bg-blue-50">
                {area.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function IcheonAreaMap() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <img src="/images/2000map.png" alt="이천 지역 지도" className="h-full w-full object-contain opacity-95" />
      <div className="absolute inset-0">
        {areaCards.map((area) => (
          <Link key={area.slug} href={`/area/${area.slug}`}>
            <a
              className={`absolute ${area.position} -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1.5 text-[11px] font-extrabold shadow-sm transition ${area.active ? "bg-primary text-white ring-4 ring-primary/15" : "bg-white/90 text-primary ring-1 ring-blue-100 hover:bg-primary hover:text-white"}`}
              aria-label={`${area.name} 관리 기록 보기`}
            >
              {area.note}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MiniInteractionExample() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[250px] rounded-xl bg-blue-50/40 p-4">
      <img src="/images/2000map.png" alt="지도 터치 예시" className="h-full w-full object-contain opacity-90" />
      <Link href="/area/bubal">
        <a className="absolute left-[68%] top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-white shadow-lg ring-4 ring-primary/15">
          부발읍
        </a>
      </Link>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-[11px] font-bold text-white shadow-lg">
        부발읍 페이지로 이동합니다.
        <MousePointerClick className="h-4 w-4" />
      </div>
    </div>
  );
}
