import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import { daewolPosts } from "@/data/areas/daewol";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";
import CareGuideSection from "@/components/CareGuideSection";

const areaCards = [
  {
    name: "곤지암",
    slug: "gonjiam",
    count: "업데이트 준비 중",
    position: "top-[17%] left-[19%]",
  },
  {
    name: "신둔면",
    slug: "sindun",
    count: "문의 가능 지역",
    position: "top-[23%] left-[27%]",
  },
  {
    name: "백사면",
    slug: "baeksa",
    count: "업데이트 준비 중",
    position: "top-[25%] left-[48%]",
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
    count: "업데이트 준비 중",
    position: "top-[45%] left-[67%]",
  },
  {
    name: "대월면",
    slug: "daewol",
    count: "최근 작업 12건",
    position: "top-[66%] left-[64%]",
  },
];

type AreaChip = {
  name: string;
  slug: string;
  featured?: boolean;
};

type AreaGroup = {
  title: string;
  note?: string;
  items: AreaChip[];
};

const areaGroups: AreaGroup[] = [
  {
    title: "시내권",
    note: "당일 방문 가능",
    items: [
      { name: "증포동", slug: "downtown", featured: true },
      { name: "창전동", slug: "downtown" },
      { name: "중리동", slug: "downtown" },
      { name: "관고동", slug: "downtown" },
    ],
  },
  {
    title: "읍 지역",
    items: [
      { name: "부발읍", slug: "bubal" },
    ],
  },
  {
    title: "면 지역",
    items: [
      { name: "신둔면", slug: "sindun" },
      { name: "백사면", slug: "baeksa" },
      { name: "마장면", slug: "majang" },
      { name: "대월면", slug: "daewol" },
    ],
  },
  {
    title: "인근",
    items: [
      { name: "곤지암", slug: "gonjiam" },
    ],
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

            <p className="text-xs md:text-sm font-bold tracking-[0.25em] text-primary mb-4">
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
                    이천 북부 지역
                    <br />
                    직접 방문합니다
                  </h2>
                  <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground md:max-w-xl">
                    현재 등록된 관리 가능 지역을 기준으로 주소와 사진을 확인한 뒤 무료 방문 견적을 안내드립니다.
                  </p>
                </div>

                <p className="hidden md:block text-sm font-medium text-primary">
                  지역 버튼을 클릭하면 해당 관리 현장으로 이동합니다
                </p>
              </div>

              <AreaChipList />

              <DesktopAreaSelector />
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
                  <Skeleton className="h-52 md:h-64 w-full" />
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
                        <div className="relative h-52 md:h-72 overflow-hidden bg-blue-50">
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

function AreaChipList() {
  const selectedArea = areaGroups[0].items[0];

  return (
    <div className="space-y-6 md:hidden">
      {areaGroups.map((group) => (
        <section key={group.title} aria-labelledby={`area-group-${group.title}`}>
          <div className="mb-3 flex items-center gap-3">
            <h3
              id={`area-group-${group.title}`}
              className="shrink-0 text-sm font-extrabold text-slate-600"
            >
              {group.title}
            </h3>
            {group.note && (
              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-primary">
                {group.note}
              </span>
            )}
            <div className="h-px flex-1 bg-blue-100" />
          </div>

          <div className="flex flex-wrap gap-2">
            {group.items.map((area) => (
              <Link key={`${group.title}-${area.name}`} href={`/area/${area.slug}`}>
                <a
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-extrabold transition ${
                    area.featured
                      ? "border-primary bg-primary text-white shadow-md shadow-blue-900/15"
                      : "border-blue-100 bg-white text-foreground hover:border-primary/40 hover:bg-blue-50"
                  }`}
                >
                  {area.name}
                </a>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm font-bold leading-relaxed text-slate-700">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p>
          {selectedArea.name}은 당일 방문도 가능한 지역입니다. 건물 주소를 보내주시면 방문 일정을 바로 안내드려요.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://pf.kakao.com/_IiNfn/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#FEE500] px-5 text-base font-extrabold text-[#191919] shadow-sm transition hover:bg-[#F4DC00]"
        >
          <MessageCircle className="h-5 w-5 fill-current" />
          카톡으로 견적 받기
        </a>
        <a
          href="tel:01084381887"
          aria-label="전화 문의하기"
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-sm transition hover:bg-blue-50"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}

function DesktopAreaSelector() {
  const primaryArea = areaCards.find((area) => area.slug === "downtown") ?? areaCards[0];

  return (
    <div className="hidden md:block max-w-[900px]">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="relative h-[300px] bg-blue-50/80">
            <img
              src="/images/2000map.png"
              alt="이천 북부 관리 가능 지역 지도"
              className="h-full w-full object-cover object-center opacity-90"
            />
            <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
              <Link href={`/area/${primaryArea.slug}`}>
                <a className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-base font-extrabold text-white shadow-lg shadow-blue-900/20">
                  {primaryArea.name}
                  <MapPin className="h-5 w-5 fill-current" />
                </a>
              </Link>
            </div>
            <div className="absolute bottom-4 right-4 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-primary shadow-sm">
              이천 북부·인근 지역 방문
            </div>
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <h3 className="shrink-0 text-base font-extrabold text-slate-700">동네 선택</h3>
            <div className="h-px flex-1 bg-blue-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {areaCards.map((area) => (
              <Link key={area.slug} href={`/area/${area.slug}`}>
                <a
                  className={`group flex min-h-20 items-center justify-between rounded-2xl border bg-white px-6 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md ${
                    area.slug === primaryArea.slug ? "border-primary bg-blue-50/80" : "border-blue-100"
                  }`}
                  title={area.count}
                >
                  <span>
                    <span className="block text-xl font-extrabold text-foreground group-hover:text-primary">
                      {area.name}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-muted-foreground">
                      {area.count}
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary" />
                </a>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://pf.kakao.com/_IiNfn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#FEE500] px-6 text-base font-extrabold text-[#191919] shadow-sm transition hover:bg-[#F4DC00]"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              선택한 지역 견적 받기
            </a>
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
    </div>
  );
}
