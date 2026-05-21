import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, CalendarDays, ChevronRight, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

const areaCards = [
  {
    name: "마장면",
    slug: "majang",
    count: "최근 작업 15건",
    status: "active",
    position: "top-[28%] left-[43%]",
  },
  {
    name: "대월면",
    slug: "daewol",
    count: "최근 작업 12건",
    status: "active",
    position: "top-[36%] right-[17%]",
  },
  {
    name: "부발읍",
    slug: "bubal",
    count: "최근 작업 있음",
    status: "active",
    position: "bottom-[28%] left-[23%]",
  },
  {
    name: "창전동",
    slug: "changjeon",
    count: "최근 작업 있음",
    status: "active",
    position: "bottom-[25%] right-[30%]",
  },
  {
    name: "신둔면",
    slug: "sindun",
    count: "문의 가능 지역",
    status: "inactive",
    position: "top-[32%] left-[18%]",
  },
  {
    name: "증포동",
    slug: "jeungpo",
    count: "준비중",
    status: "inactive",
    position: "bottom-[12%] right-[18%]",
  },
];

const reviews = [
  {
    source: "네이버 리뷰",
    mark: "N",
    logoClass: "rounded-[10px] bg-[#35b957] text-white shadow-[0_6px_14px_rgba(53,185,87,0.24)]",
    titleClass: "text-[#3b9f4e]",
    area: "방문자 리뷰",
    text: "네이버 플레이스에 등록된 실제 리뷰를 확인해보세요.",
    href: "https://map.naver.com/p/entry/place/2097250452?placePath=/home?entry=plt&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202605201835&locale=ko&svcName=map_pcv5&searchType=place&lng=127.4030091&lat=37.3088922&c=15.00,0,0,0,dh",
  },
  {
    source: "숨고 리뷰",
    mark: "S",
    logoClass: "rounded-[14px] bg-[#2f9b98] text-white shadow-[0_6px_14px_rgba(47,155,152,0.24)]",
    titleClass: "text-[#2f7f82]",
    area: "전문 서비스 리뷰",
    text: "계단·화장실·건물 내부 청소 후기를 확인해보세요.",
    href: "https://soomgo.com/profile/users/3729049",
  },
  {
    source: "당근 후기",
    mark: "d",
    logoClass: "rounded-full bg-[#f47a22] text-white shadow-[0_6px_14px_rgba(244,122,34,0.24)]",
    titleClass: "text-[#e67828]",
    area: "동네 주민 후기",
    text: "동네 주민분들이 남겨주신 실제 후기를 확인해보세요.",
    href: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
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
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <section className="container max-w-6xl pt-24 pb-14 md:pt-32 md:pb-20">
        <motion.div
          className="mb-10 md:mb-14 text-center"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-4">
            FIELD ARCHIVE
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.12] text-foreground mb-4">
            작업일지
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            이천 전 지역을 깨끗하게 관리합니다. 원하는 지역을 선택해 작업 기록을 확인하세요.
          </p>
        </motion.div>

        <motion.div
          className="mb-12 md:mb-16 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <div className="relative bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 px-4 py-8 md:px-10 md:py-12">
            <div className="mb-6 md:mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">
                  이천 지역 관리 현황
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  원하는 지역을 선택해주세요.
                </p>
              </div>

              <p className="hidden md:block text-sm font-medium text-primary">
                지역을 클릭하면 해당 작업일지로 이동합니다
              </p>
            </div>

            <div className="relative mx-auto max-w-5xl">
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
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {area.count}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
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

        <section className="mb-12 md:mb-16">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-extrabold text-foreground">
                고객님들의 실제 후기
                <Star className="h-6 w-6 fill-[#ffd978] text-[#ffd978] drop-shadow-sm" />
              </h2>

              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                네이버 플레이스·숨고·당근에 남겨주신 실제 후기를 바탕으로 정리했습니다.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <a
                key={review.source}
                href={review.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-[1.35rem] border border-[#eee7dc] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ded3c3] hover:shadow-xl md:p-8"
              >
                <div className="mb-7 flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center text-xl font-black leading-none ${review.logoClass}`}
                  >
                    {review.mark}
                  </span>

                  <p className={`text-xl md:text-2xl font-extrabold ${review.titleClass}`}>
                    {review.source}
                  </p>
                </div>

                <div className="mb-8 flex items-center justify-center gap-2 text-[#ffc64a]">
                  <span className="mr-1 text-2xl font-semibold text-[#4b4b4b]">
                    5.0
                  </span>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-6 w-6 fill-current" />
                  ))}
                </div>

                <p className="text-xl font-extrabold leading-relaxed text-[#252525] md:text-2xl">
                  “{review.text}”
                </p>

                <p className="mt-8 text-base font-medium text-[#8a8178]">
                  {review.area}
                </p>

                <div className="mt-8 flex items-center justify-center gap-2 rounded-md border border-[#e5e0d8] bg-[#fffdf8] px-4 py-3.5 text-lg font-extrabold text-[#315a35] transition-colors group-hover:bg-[#f6fbf4] group-hover:border-[#cfdcc9]">
                  후기 보러가기
                  <ChevronRight className="h-5 w-5 stroke-[3]" />
                </div>
              </a>
            ))}
          </div>
        </section>

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

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
              최근 작업일지
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              이천 지역 공용공간 관리 기록입니다.
            </p>
          </div>
        </div>

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
                <Link href={`/blog/${post.id}`}>
                  <article className="group overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full">
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
