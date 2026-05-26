import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, Home, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { getWorkPath } from "@/lib/workSlug";

type AreaTimelineProps = {
  areaName: string;
  areaSlug: string;
  posts: AreaPost[];
  title?: string;
  description?: string;
  emptyMessage?: string;
};

function getPostType(post: AreaPost) {
  if (post.workType) return post.workType.split(",")[0].trim();
  if (/견적/.test(post.title)) return "현장 견적";
  if (/정기/.test(post.title)) return "정기청소";
  if (/화장실/.test(post.title)) return "화장실청소";
  if (/유리|창/.test(post.title)) return "유리청소";
  return "계단청소";
}

function getPlace(post: AreaPost, areaName: string) {
  const matches = post.title.match(/[가-힣]+(?:리|동|면|읍|권)/g) ?? [];
  const found = matches.find((item) => item !== "이천" && item !== areaName);
  return found ?? areaName;
}

function getSummary(post: AreaPost, areaName: string) {
  if (post.description) return post.description;
  if (/견적/.test(post.title)) return "사진과 현장 상태를 기준으로 관리 범위를 확인한 기록입니다.";
  if (/정기/.test(post.title)) return "공용공간 상태를 확인하고 정기 관리가 필요한 부분을 정리했습니다.";
  if (/계단/.test(post.title)) return "계단과 공동현관 주변을 중심으로 오염 상태를 확인했습니다.";
  return `${areaName} 현장 관리 내용을 짧게 정리한 작업 기록입니다.`;
}

export default function AreaTimeline({
  areaName,
  areaSlug,
  posts,
  title = `${areaName} 작업 일지`,
  description = `${areaName} 현장을 날짜순으로 확인해보세요.`,
  emptyMessage = `${areaName} 작업 기록은 사진 정리 후 순서대로 추가할게요.`,
}: AreaTimelineProps) {
  const filters = useMemo(() => {
    const types = posts.map(getPostType).filter(Boolean);
    return ["전체", ...Array.from(new Set(types)).slice(0, 5)];
  }, [posts]);
  const [selectedFilter, setSelectedFilter] = useState("전체");

  const filteredPosts = selectedFilter === "전체"
    ? posts
    : posts.filter((post) => getPostType(post) === selectedFilter);

  return (
    <section className="mb-12 md:mb-16">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <Link href={`/records?area=${areaSlug}`}>
          <a className="inline-flex w-fit items-center text-sm font-bold text-primary transition hover:opacity-80">
            전체 보기
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>

      {posts.length > 0 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-all md:text-sm ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-blue-50 text-primary hover:bg-primary/10"
                }`}
                aria-pressed={isActive}
              >
                {filter}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-7 lg:grid-cols-[1fr_260px] lg:items-start">
        <div className="relative">
          {filteredPosts.length > 0 ? (
            <div className="space-y-4 md:space-y-5">
              {filteredPosts.map((post, index) => {
                const type = getPostType(post);
                const place = getPlace(post, areaName);
                const summary = getSummary(post, areaName);

                return (
                  <motion.div
                    key={`${post.title}-${post.date}-${index}`}
                    className="relative grid gap-3 md:grid-cols-[82px_1fr] md:gap-5"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
                  >
                    <div className="hidden md:block">
                      <div className="relative flex h-full justify-end pr-5">
                        <div className="absolute right-[7px] top-0 h-full w-px bg-blue-100" />
                        <div className="relative z-10 mt-8 h-3.5 w-3.5 rounded-full border-4 border-white bg-primary shadow-sm ring-2 ring-primary/20" />
                        <p className="absolute right-8 top-6 whitespace-nowrap text-[11px] font-extrabold text-slate-500">
                          {post.date}
                        </p>
                      </div>
                    </div>

                    <Link href={getWorkPath(post)}>
                      <a className="group grid overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg md:grid-cols-[170px_1fr]">
                        <div className="relative h-44 overflow-hidden bg-blue-50 md:h-full md:min-h-[126px]">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute left-3 top-3 md:hidden rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-primary shadow-sm">
                            {post.date}
                          </div>
                        </div>

                        <div className="flex min-w-0 flex-col p-4 md:p-5">
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-primary">
                              {type}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-600">
                              {place}
                            </span>
                          </div>

                          <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-foreground md:text-lg">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {summary}
                          </p>

                          <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-primary">
                            <span className="inline-flex items-center gap-1 text-slate-400 md:hidden">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {post.date}
                            </span>
                            <span className="ml-auto inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                              자세히 보기
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
              <img
                src="/booboo.webp"
                alt="이천계단지기 부부 캐릭터"
                className="mx-auto mb-4 w-28 md:w-36"
                loading="lazy"
              />
              <p className="text-base font-extrabold text-foreground md:text-lg">업데이트 중입니다.</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{emptyMessage}</p>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6 text-center shadow-sm lg:sticky lg:top-24">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
            <Home className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-extrabold leading-snug text-foreground">
            {areaName} 전 지역
            <br />
            관리 가능합니다
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            오천리, 관리리, 창전리, 덕평리 등 인근 건물도 상담 가능합니다.
          </p>
          <a
            href="https://pf.kakao.com/_IiNfn/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:opacity-90"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            문의하기
          </a>
        </aside>
      </div>
    </section>
  );
}
