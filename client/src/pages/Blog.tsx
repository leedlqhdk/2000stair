import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { daewolPosts } from "@/data/areas/daewol";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";
import CareGuideSection from "@/components/CareGuideSection";

const managedAreaCards = [
  {
    src: "/images/icheon-downtown-stair-cleaning.webp",
    title: "창전동",
    subtitle: "계단 · 복도 관리",
    href: "/area/changjeon",
  },
  {
    src: "/images/icheon-gwango-building-cleaning.webp",
    title: "관고동",
    subtitle: "건물 공용부 관리",
    href: "/area/gwango",
  },
  {
    src: "/images/icheon-songjeong-villa-cleaning.webp",
    title: "송정동",
    subtitle: "현관 · 복도 관리",
    href: "/area/songjeong",
  },
  {
    src: "/images/icheon-bubal-store-cleaning.webp",
    title: "부발읍",
    subtitle: "상가 공용부 관리",
    href: "/area/bubal",
  },
  {
    src: "/images/icheon-sindun-stair-cleaning.webp",
    title: "신둔면",
    subtitle: "공동현관 관리",
    href: "/area/sindun",
  },
  {
    src: "/images/icheon-majang-villa-cleaning.webp",
    title: "백사면",
    subtitle: "빌라 · 원룸 관리",
    href: "/area/baeksa",
  },
  {
    src: "/images/icheon-downtown-stair-cleaning.webp",
    title: "증포동",
    subtitle: "빌라 정기관리",
    href: "/area/downtown",
  },
  {
    src: "/images/icheon-gwango-building-cleaning.webp",
    title: "중리동",
    subtitle: "공동현관 관리",
    href: "/area/downtown",
  },
  {
    src: "/images/icheon-songjeong-villa-cleaning.webp",
    title: "대월면",
    subtitle: "계단 · 정기관리",
    href: "/area/daewol",
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
              이천 북부권을 중심으로 공용공간을 깨끗하게 관리합니다. 실제 관리 현장을 확인해보세요.
            </p>
          </motion.div>

          <div className="mx-auto mb-12 w-full md:mb-16">
            <ManagedAreaShowcase />
          </div>

          <section className="mb-12 md:mb-16">
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
        </section>

        <CareGuideSection limit={3} viewAllHref="/guide" />
        <ReviewSection />
      </main>
    </div>
  );
}

function ManagedAreaShowcase() {
  return (
    <section className="overflow-hidden py-2 md:py-4">
      <div className="grid items-center gap-5 lg:grid-cols-[0.25fr_0.75fr] lg:gap-7">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-[0.16em] text-primary md:text-sm">
            <MapPin className="h-4 w-4 text-primary stroke-[3]" />
            MAP
          </p>

          <h2 className="mb-3 text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
            실제 관리 지역
          </h2>

          <p className="max-w-xs text-sm leading-relaxed text-gray-600 line-clamp-2 md:text-base md:line-clamp-none">
            이천 북부 지역을 부부가 직접 관리합니다.
          </p>
        </motion.div>

        <div className="relative overflow-hidden pb-3 pt-1 md:pb-2 md:pt-0">
          <div className="flex w-max gap-3 md:gap-4" style={{ animation: "slideLeft 26s linear infinite" }}>
            {[...managedAreaCards, ...managedAreaCards].map((item, index) => (
              <motion.div
                key={`${item.src}-${item.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % managedAreaCards.length) * 0.04 }}
              >
                <Link href={item.href}>
                  <a className="group relative block h-48 w-40 overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)] md:h-52 md:w-44">
                    <img
                      src={item.src}
                      alt={`${item.title} 관리 현장`}
                      className="h-full w-full scale-[1.22] object-cover object-[center_96%] brightness-[1.05] contrast-[0.96] saturate-[0.88] transition-transform duration-500 group-hover:scale-[1.27]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#f5f9ff]/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-black/10 to-white/6" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                      <MapPin className="mb-1 h-4 w-4 text-white drop-shadow" />
                      <h3 className="text-sm font-extrabold leading-tight md:text-base">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[0.62rem] font-semibold text-white/78 md:text-xs">
                        {item.subtitle}
                      </p>
                    </div>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewSection() {
  return (
    <section className="container max-w-6xl pb-16 md:pb-24">
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
  );
}
