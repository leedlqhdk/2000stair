import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export default function Blog() {
  const params = useParams();
  const [, setLocation] = useLocation();

  const selectedTag = params.slug;

  const { data: tagsData } = trpc.blog.tags.useQuery();

  const { data, isLoading } = trpc.blog.list.useQuery({
    tag: selectedTag,
    limit: 20,
    offset: 0,
  });

  const posts = data?.posts ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <section className="container max-w-6xl py-14 md:py-20">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-sm font-bold tracking-[0.35em] text-primary mb-5">
            FIELD ARCHIVE
          </p>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-end">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-foreground">
              이천계단지기의
              <br />
              작업 기록
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              실제 이천 지역 빌라·상가·원룸 공용공간 관리 현장을 기록하고 있습니다.
            </p>
          </div>
        </motion.div>

        {tagsData && tagsData.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Button
              variant={selectedTag === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setLocation("/blog")}
              className="rounded-full h-11 px-5 text-sm"
            >
              전체
            </Button>

            {tagsData.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTag === tag.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setLocation(`/blog/category/${tag.slug}`)}
                className="rounded-full h-11 px-5 text-sm"
              >
                {tag.name}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white"
              >
                <Skeleton className="h-64 w-full" />

                <div className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground text-lg">
              아직 작업 기록이 없습니다.
            </p>
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
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45 },
                  },
                }}
              >
                <Link href={`/blog/${post.id}`}>
                  <article className="group overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                    <div className="relative h-72 overflow-hidden bg-blue-50">
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
                        <div className="flex items-center gap-1 text-xs text-white/80 mb-2">
                          <CalendarDays className="w-3 h-3" />

                          <span>
                            {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </div>

                        <h2 className="text-white text-2xl font-extrabold leading-snug line-clamp-2">
                          {post.title}
                        </h2>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        실제 이천 지역 계단청소 현장 기록입니다.
                      </p>

                      <TagBadges
                        tagIds={post.tags}
                        allTags={tagsData ?? []}
                      />
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}

function TagBadges({
  tagIds,
  allTags,
}: {
  tagIds: number[];
  allTags: { id: number; name: string; slug: string }[];
}) {
  if (!tagIds.length) return null;

  const matched = allTags.filter((t) => tagIds.includes(t.id));

  return (
    <div className="flex flex-wrap gap-1.5">
      {matched.map((t) => (
        <Badge
          key={t.id}
          variant="secondary"
          className="rounded-full text-xs"
        >
          {t.name}
        </Badge>
      ))}
    </div>
  );
}
