import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LatestPosts() {
  const { data } = trpc.blog.list.useQuery({ limit: 3, offset: 0 });
  const { data: allTags } = trpc.blog.tags.useQuery();

  const posts = data?.posts ?? [];

  if (!posts.length) return null;

  return (
    <section id="latest-posts" className="py-16 md:py-32 bg-blue-50/30">
      <div className="container max-w-6xl">
        <motion.div
  className="mb-10 md:mb-14 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-bold tracking-[0.35em] text-primary mb-5">
            ARCHIVE
          </p>

          <div className="space-y-5">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
              이천계단지기의
              <br />
              작업 기록
            </h2>

            <div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-5">
                실제 이천 지역 빌라·상가 계단청소 현장을 기록하고 있습니다.
                작업 전후와 관리 포인트를 블로그에서 확인해보세요.
              </p>

              <Link href="/blog">
                <Button variant="outline" className="rounded-xl bg-white">
                  전체 작업일지 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const matchedTags = (allTags ?? []).filter((t) =>
              post.tags.includes(t.id)
            );

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="group h-full overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className="relative h-64 overflow-hidden bg-blue-50">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          🧹
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                      <div className="absolute left-5 bottom-5 right-5">
                        <div className="flex items-center gap-1 text-xs text-white/85 mb-2">
                          <CalendarDays className="w-3 h-3" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-white text-xl leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        실제 이천 지역 계단청소 현장 기록입니다.
                      </p>

                      {matchedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {matchedTags.slice(0, 2).map((t) => (
                            <Badge
                              key={t.id}
                              variant="secondary"
                              className="text-xs rounded-full"
                            >
                              {t.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
