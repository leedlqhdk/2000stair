import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MousePointerClick, Star } from "lucide-react";
import { motion } from "framer-motion";
import { daewolPosts } from "@/data/areas/daewol";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";

const areaCards = [
  {
    name: "신둔면",
    slug: "sindun",
    count: "문의 가능 지역",
    position: "top-[23%] left-[27%]",
  },
  {
    name: "마장면",
    slug: "majang",
    count: "최근 작업 15건",
    position: "top-[49%] left-[21%]",
  },
  {
    name: "시내권",
    slug: "downtown",
    count: "창전동·증포동·관고동·중리동",
    position: "top-[38%] left-[48%]",
  },
  {
    name: "부발읍",
    slug: "bubal",
    count: "최근 작업 있음",
    position: "top-[45%] left-[67%]",
  },
  {
    name: "대월면",
    slug: "daewol",
    count: "최근 작업 12건",
    position: "top-[66%] left-[64%]",
  },
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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <section className="container max-w-6xl pt-24 pb-14 md:pt-32 md:pb-20">
          <motion.div
            className="mb-10 md:mb-14 text-center"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <Link href="/">
              <a className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm transition hover:border-primary/40 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4" />
                메인으로 돌아가기
              </a>
            </Link>

            <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-4">
              FIELD ARCHIVE
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.12] text-foreground mb-4">
              관리 지역
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              이천 지역 공용공간을 깨끗하게 관리합니다. 원하는 지역을 선택해 관리 현장을 확인하세요.
            </p>
          </motion.div>

          <motion.div
            className="mb-12 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm md:mb-16"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="relative bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 px-4 py-6 md:px-10 md:py-12">
              <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
                <div>
                  <div className="mb-4 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-base font-extrabold text-foreground md:text-sm md:font-bold">
                        이천 지역 관리 현황
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground md:text-sm">
                        원하는 지역을 선택해주세요.
                      </p>
                    </div>

                    <p className="hidden text-sm font-medium text-primary md:block lg:hidden">
                      지역 버튼을 클릭하면 해당 관리 현장으로 이동합니다
                    </p>
                  </div>

                  <IcheonAreaMap />
                </div>

                <MapGuidePanel />
              </div>
            </div>
          </motion.div>

          <section className="mb-12 md:mb-16">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
                  고객님들의 실제 후기
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  실제 관리 경험을 바탕으로 남겨주신 후기입니다.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <a
                  key={review.source}
                  href={review.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>

                  <p className={`text-sm font-bold mb-2 ${review.sourceClass}`}>
                    {review.source}
                  </p>

                  <p className="text-sm leading-relaxed text-foreground">
                    {review.text}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {review.area}
                    </p>
                    <span className="inline-flex items-center text-xs font-bold text-primary">
                      후기 보기
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
                최근 관리 현장
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                이천 지역 공용공간 관리 기록입니다.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white"
                >
                  <Skeleton className="h-64 w-full" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {recentPosts.slice(0, 6).map((post, index) => {
                const areaSlug = post.area ?? "downtown";
                const areaName = areaLabels[areaSlug] ?? areaSlug;
                const description = post.description || "실제 이천 지역 계단청소 현장 기록입니다.";

                return (
                  <motion.div
                    key={`${areaSlug}-${post.title}-${index}`}
                    className="h-full"
                    variants={{
                      hidden: { opacity: 0, y: 28 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.45 },
                      },
                    }}
                  >
                    <Link href={`/area/${areaSlug}`}>
                      <article className="group overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full">
                        <div className="relative h-72 overflow-hidden bg-blue-50">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                          <div className="absolute left-5 bottom-5 right-5">
                            <div className="flex items-center gap-1 text-xs text-white/80 mb-2">
                              <CalendarDays className="w-3 h-3" />
                              <span>{post.date}</span>
                            </div>

                            <h2 className="text-white text-xl font-extrabold leading-snug line-clamp-2">
                              {post.title}
                            </h2>
                          </div>
                        </div>

                        <div className="p-5">
                          <p className="text-sm font-bold text-primary mb-2">
                            {areaName}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {description}
                          </p>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}

function MapGuidePanel() {
  const featureItems = [
    "지도의 각 영역을 터치하여 직관적으로 선택",
    "터치 시 색상 하이라이트로 선택 영역 확인",
    "하단 지역 버튼으로도 빠르게 이동 가능",
  ];

  return (
    <aside className="space-y-5">
      <div>
        <p className="mb-3 text-sm font-extrabold text-foreground">특징</p>
        <div className="space-y-3">
          {featureItems.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-primary text-white" />
              <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-extrabold text-foreground">터치 시 인터랙션 예시</p>
        <MiniMapExample />
      </div>
    </aside>
  );
}

function IcheonAreaMap() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="relative mx-auto aspect-square w-full max-w-[340px] md:aspect-auto md:max-w-4xl">
        <img
          src="/images/2000map.png"
          alt="이천 지역 지도"
          className="mx-auto h-full w-full object-contain opacity-95 md:h-auto"
        />

        <div className="absolute inset-0">
          {areaCards.map((area) => (
            <Link key={area.slug} href={`/area/${area.slug}`}>
              <a
                className={`absolute ${area.position} inline-flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[11px] font-extrabold text-primary shadow-sm ring-1 ring-blue-100 backdrop-blur transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-lg md:rounded-lg md:border md:border-primary md:px-4 md:py-2.5 md:text-base md:shadow-md md:ring-0`}
                title={area.count}
              >
                <span>{area.name}</span>
                <ArrowRight className="hidden h-4 w-4 md:block" />
              </a>
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] font-medium text-muted-foreground md:hidden">
        지도에서 원하는 지역을 터치해주세요.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2 md:hidden">
        {areaCards.map((area) => (
          <Link key={area.slug} href={`/area/${area.slug}`}>
            <a className="rounded-full border border-blue-100 bg-white px-3 py-2 text-[11px] font-extrabold text-primary shadow-sm transition hover:border-primary hover:bg-blue-50">
              {area.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MiniMapExample() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[230px] rounded-lg bg-blue-50/35 p-3">
      <img src="/images/2000map.png" alt="부발읍 터치 예시" className="h-full w-full object-contain opacity-85" />
      <Link href="/area/bubal">
        <a className="absolute left-[67%] top-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-white shadow-lg ring-4 ring-primary/15">
          부발읍
        </a>
      </Link>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-[10px] font-bold text-white shadow-lg">
        부발읍 페이지로 이동합니다.
        <MousePointerClick className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
