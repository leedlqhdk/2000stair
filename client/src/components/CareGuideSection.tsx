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
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {guides.map((guide) => (
              <motion.div
                key={guide.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                }}
              >
                <Link href={guide.href}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                    <div className="aspect-[4/3] w-full overflow-hidden bg-blue-50">
                      {guide.thumbnail ? (
                        <img
                          src={guide.thumbnail}
                          alt={guide.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-blue-200">
                          <span className="text-4xl font-black">계단</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold leading-snug text-foreground line-clamp-2">
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
