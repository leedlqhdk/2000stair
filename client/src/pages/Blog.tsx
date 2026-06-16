import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import { daewolPosts } from "@/data/areas/daewol";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";
import CareGuideSection from "@/components/CareGuideSection";

const serviceAreas = [
  {
    name: "신둔면",
    slug: "sindun",
    summary: "공동현관 · 계단 정기관리",
    position: "top-[25%] left-[32%]",
  },
  {
    name: "마장면",
    slug: "majang",
    summary: "빌라 · 상가 공용부 관리",
    position: "top-[52%] left-[24%]",
  },
  {
    name: "부발읍",
    slug: "bubal",
    summary: "상가 · 소형 건물 관리",
    position: "top-[46%] left-[74%]",
  },
  {
    name: "시내권",
    slug: "downtown",
    summary: "증포동 · 창전동 · 관고동 공용부 관리",
    position: "top-[40%] left-[52%]",
  },
  {
    name: "대월면",
    slug: "daewol",
    summary: "빌라 계단 · 정기관리",
    position: "top-[68%] left-[65%]",
    featured: true,
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
  gonjiam: "곤지암",
};

const fallbackRecentPosts: AreaPost[] = [
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
              이천 지역 공용공간을 깨끔하게 관리합니다. 원하는 지역을 선택해 관리 현장을 확인하세요.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mb-12 w-full max-w-[430px] overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm md:mb-16 md:max-w-none"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="relative bg-white px-4 py-7 md:bg-gradient-to-b md:from-blue-50/50 md:via-white md:to-blue-50/30 md:px-10 md:py-12">
              <div className="mb-7 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-sm font-extrabold text-primary">
                    홈 · 방문지역
                  </p>
                  <h2 className="text-[2rem] font-extrabold leading-tight tracking-normal text-foreground md:text-3xl">
                    이천 생활권
                    <br />
                    직접 관리합니다
                  </h2>
                  <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground md:max-w-xl">
                    홈페이지에 안내된 청소 가능지역을 기준으로 주소와 사진을 확인한 뒤 무료 방문 견적을 안내드립니다.
                  </p>
                </div>

                <p className="hidden md:block text-sm font-medium text-primary">
                  지역을 누르면 지도와 문의 버튼이 함께 반응합니다
                </p>
              </div>

              <ResponsiveAreaSelector />
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

        <CareGuideSection limit={3} viewAllHref="/guide" />
      </main>
    </div>
  );
}

function ResponsiveAreaSelector() {
  const [selectedAreaName, setSelectedAreaName] = useState(
    serviceAreas.find((area) => area.featured)?.name ?? serviceAreas[0].name
  );
  const selectedArea = serviceAreas.find((area) => area.name === selectedAreaName) ?? serviceAreas[0];

  return (
    <div className="mx-auto space-y-5 md:max-w-[920px]">
      <div>
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="relative aspect-square bg-white md:h-[560px] md:aspect-auto md:bg-blue-50/80">
            <img
              src="/images/2000map.png"
              alt="이천 생활권 청소 가능지역 지도"
              className="h-full w-full object-contain object-center p-2 opacity-90 md:object-cover md:p-0"
            />
            <button
              type="button"
              onClick={() => setSelectedAreaName(selectedArea.name)}
              className={`absolute ${selectedArea.position} z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-xl shadow-blue-900/25 transition md:px-8 md:py-5 md:text-2xl`}
            >
              {selectedArea.name}
              <MapPin className="h-4 w-4 fill-current md:h-8 md:w-8" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm font-extrabold text-slate-600 md:mt-5 md:text-lg">
          <MapPin className="h-4 w-4 shrink-0 text-primary md:h-6 md:w-6" />
          아래 동네를 누르면 지도에 위치가 표시됩니다
        </div>

        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 md:mt-5 md:flex-wrap md:gap-4 md:overflow-visible">
          {serviceAreas.map((area) => (
            <button
              key={area.name}
              type="button"
              onClick={() => setSelectedAreaName(area.name)}
              className={`shrink-0 rounded-full border px-5 py-3 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 md:min-w-32 md:px-7 md:py-4 md:text-lg ${
                area.name === selectedArea.name
                  ? "border-primary bg-primary text-white shadow-blue-900/15"
                  : "border-blue-100 bg-white text-foreground hover:bg-blue-50"
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4 md:flex md:items-center md:justify-between md:gap-5">
        <div className="mb-4 md:mb-0">
          <p className="text-sm font-extrabold text-primary">{selectedArea.name} 작업현장 선택됨</p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700">
            {selectedArea.summary}. 해당 지역의 실제 관리 기록을 확인해보세요.
          </p>
        </div>

        <div className="flex items-center gap-3 md:min-w-[320px]">
          <Link href={`/area/${selectedArea.slug}`}>
            <a
            className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full border border-white/60 bg-white/80 px-5 text-base font-extrabold text-primary shadow-md backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <ArrowRight className="h-5 w-5" />
              {selectedArea.name} 작업현장 보러가기
            </a>
          </Link>
          <a
            href="tel:01084381887"
            aria-label="전화 문의하기"
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-sm transition hover:bg-blue-50"
          >
            <Phone className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
