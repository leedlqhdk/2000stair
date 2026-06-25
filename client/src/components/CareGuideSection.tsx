import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

interface CareGuideSectionProps {
  limit?: number;
  viewAllHref?: string;
}

export default function CareGuideSection({ limit, viewAllHref }: CareGuideSectionProps) {
  const { data: postData } = trpc.blog.list.useQuery({ limit: 50, offset: 0 });

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

        {guides.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            등록된 관리정보가 아직 없습니다.
          </p>
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
