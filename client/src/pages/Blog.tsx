import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const areaCards = [
  {
    name: "신둔면",
    slug: "sindun",
    count: "최근 작업 18건",
    position: "top-[24%] left-[14%]",
  },
  {
    name: "마장면",
    slug: "majang",
    count: "최근 작업 15건",
    position: "top-[34%] left-[42%]",
  },
  {
    name: "대월면",
    slug: "daewol",
    count: "최근 작업 12건",
    position: "top-[42%] right-[14%]",
  },
  {
    name: "부발읍",
    slug: "bubal",
    count: "문의 가능",
    position: "bottom-[24%] left-[20%]",
  },
  {
    name: "증포동",
    slug: "jeungpo",
    count: "문의 가능",
    position: "bottom-[24%] right-[26%]",
  },
];

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
      <section className="container max-w-6xl pt-24 pb-14 md:pt-32 md:pb-20">
        <motion.div
          className="mb-10 md:mb-14 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-4">
            FIELD ARCHIVE
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.12] text-foreground mb-4">
            이천 지역 관리 기록
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            원하는 지역을 선택하면 해당 지역의 작업 기록을 확인할 수 있습니다.
          </p>
        </motion.div>

        <motion.div
          className="mb-12 md:mb-16 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <div className="p-6 md:p-10 text-center border-b border-blue-50">
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-primary mb-3">
              AREA MAP
            </p>

            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
              이천 지역 관리 현황
            </h2>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              지역별 작업일지를 모아볼 수 있도록 준비했습니다.
            </p>
          </div>

          <div className="relative bg-gradient-to-b from-blue-50/40 to-white px-4 py-8 md:px-10 md:py-12">
            <img
              src="/manus-storage/icheon-map.png"
              alt="이천 지역 지도"
              className="mx-auto w-full max-w-4xl opacity-95"
            />

            <div className="hidden md:block absolute inset-0">
              {areaCards.map((area) => (
                <Link key={area.slug} href={`/area/${area.slug}`}>
                  <div
                    className={`absolute ${area.position} cursor-pointer rounded-2xl border border-blue-100 bg-white/95 px-5 py-4 shadow-md backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div className="flex items-center gap-2 text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-extrabold">{area.name}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {area.count}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
              {areaCards.map((area) => (
                <Link key={area.slug} href={`/area/${area.slug}`}>
                  <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all active:scale-[0.98]">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-extrabold text-foreground">
                          {area.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {area.count}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
                  <article className="group overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
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

                        <h2 className="text-white text-xl font-extrabold leading-snug line-clamp-2">
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
