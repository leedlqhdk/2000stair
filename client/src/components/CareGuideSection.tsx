import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CareGuideSectionProps {
  limit?: number;
  viewAllHref?: string;
  layout?: "grid" | "list";
}

export default function CareGuideSection({ limit, viewAllHref, layout = "grid" }: CareGuideSectionProps) {
  const { data: postData, isPending } = trpc.blog.listLite.useQuery(
    { limit: 50, offset: 0 },
    { staleTime: 5 * 60_000 }
  );

  const allGuides = (postData?.posts ?? []).map((post) => ({
    id: String(post.id),
    title: post.title,
    thumbnail: post.thumbnail || "",
    href: `/blog/${post.id}`,
  }));

  const guides = limit ? allGuides.slice(0, limit) : allGuides;

  return (
    <section id="care-guide" className="py-16 md:py-24 bg-white">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-[0.25em] text-primary mb-4">
            STAIR CARE GUIDE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            빌라 계단 관리정보
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            계단 냄새, 미끄럼, 먼지처럼 현장에서 자주 만나는 문제를 쉽게 정리했습니다.
          </p>
        </motion.div>

        {isPending ? (
          layout === "list" ? (
            <div className="mx-auto max-w-2xl divide-y divide-blue-100 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3.5 p-3 sm:gap-4 sm:p-4">
                  <Skeleton className="h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                  <Skeleton className="aspect-[16/10] w-full rounded-none" />
                  <div className="space-y-2 p-5">
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : guides.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            등록된 관리정보가 아직 없습니다.
          </p>
        ) : layout === "list" ? (
          <motion.ul
            className="mx-auto max-w-2xl divide-y divide-blue-100 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {guides.map((guide) => (
              <motion.li
                key={guide.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
              >
                <Link href={guide.href}>
                  <a className="group flex items-center gap-3.5 p-3 transition-colors duration-200 hover:bg-blue-50/60 sm:gap-4 sm:p-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-blue-100 bg-blue-50 sm:h-[70px] sm:w-[70px]">
                      {guide.thumbnail ? (
                        <img
                          src={guide.thumbnail}
                          alt={guide.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-blue-200">
                          <span className="text-lg font-black">계단</span>
                        </div>
                      )}
                    </div>
                    <h3 className="min-w-0 flex-1 text-sm font-bold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary sm:text-base">
                      {guide.title}
                    </h3>
                    <ChevronRight className="h-5 w-5 shrink-0 text-blue-300 transition-colors group-hover:text-primary" />
                  </a>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {guides.map((guide) => (
              <motion.div
                key={guide.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <Link href={guide.href}>
                  <article className="group relative aspect-square overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl md:rounded-[1.5rem]">
                    {guide.thumbnail ? (
                      <img
                        src={guide.thumbnail}
                        alt={guide.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-blue-200">
                        <span className="text-4xl font-black">계단</span>
                      </div>
                    )}

                    {/* 제목 오버레이: 모바일에서는 숨김 / 데스크탑 호버 시 슬라이드업 */}
                    <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent px-3 pb-3 pt-8 transition-transform duration-300 md:block md:translate-y-full md:group-hover:translate-y-0 sm:px-4 sm:pb-4">
                      <h3 className="text-xs font-extrabold leading-snug text-white line-clamp-2 sm:text-sm">
                        {guide.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewAllHref && allGuides.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Link href={viewAllHref}>
              <Button variant="outline" className="rounded-xl bg-white">
                관리정보 전체 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
