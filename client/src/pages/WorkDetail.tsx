import { useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Images, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { daewolPosts } from "@/data/areas/daewol";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { getWorkSlug } from "@/lib/workSlug";

const areaLabels: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  downtown: "시내권",
};

const downtownPosts: AreaPost[] = [
  { title: "송정동 빌라 계단청소", date: "2026.05.20", image: "/images/areas/downtown/downtown-1.jpg", area: "downtown" },
  { title: "관고동 상가건물 관리", date: "2026.05.18", image: "/images/areas/downtown/downtown-2.jpg", area: "downtown" },
  { title: "관고동 상가 계단 정기청소", date: "2026.05.15", image: "/images/areas/downtown/downtown-3.jpg", area: "downtown" },
  { title: "송정동 빌라 계단 바닥 정기관리", date: "2026.05.12", image: "/images/areas/downtown/downtown-4.jpg", area: "downtown" },
  { title: "창전동 연립빌라 공동현관 유리코팅", date: "2026.04.19", image: "/images/areas/downtown/downtown-5.jpg", area: "downtown" },
  { title: "안흥동 빌라 정기관리", date: "2026.04.10", image: "/images/areas/downtown/downtown-6.jpg", area: "downtown" },
];

const fallbackPosts: AreaPost[] = [
  ...majangPosts.map((post) => ({ ...post, area: "majang" })),
  ...daewolPosts.map((post) => ({ ...post, area: "daewol" })),
  ...downtownPosts,
].sort((a, b) => b.date.localeCompare(a.date));

function useAllAreaPosts() {
  return useQuery({
    queryKey: ["area-posts", "work-detail"],
    queryFn: async () => {
      const response = await fetch("/api/area-posts?limit=50");
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    staleTime: 60_000,
    retry: 1,
  });
}

function getDefaultBuildingType(title: string) {
  if (/상가/.test(title)) return "상가 건물";
  if (/원룸/.test(title)) return "원룸";
  if (/빌라|연립/.test(title)) return "빌라";
  return "공용 건물";
}

function getDefaultWorkScope(title: string) {
  if (/유리|현관/.test(title)) return "공동현관, 유리, 출입구 주변";
  if (/엘리베이터/.test(title)) return "계단, 복도, 공동현관, 엘리베이터 내부";
  if (/상가/.test(title)) return "계단, 복도, 공용현관, 상가 공용부";
  return "계단, 난간, 공동현관";
}

function getDefaultWorkType(title: string) {
  if (/견적/.test(title)) return "현장 견적";
  if (/정기/.test(title)) return "정기청소";
  return "계단청소";
}

function getIntroText(post: AreaPost, areaLabel: string) {
  if (post.description) return post.description;

  if (/원룸|빌라/.test(post.title)) {
    return `${areaLabel} ${post.title} 작업입니다. 비 오는 날 이후 흙먼지와 발자국 오염이 남기 쉬운 계단과 공동현관을 중심으로 관리했습니다.`;
  }

  if (/상가/.test(post.title)) {
    return `${areaLabel} ${post.title} 작업입니다. 출입이 잦은 공용부의 먼지와 손이 닿는 구간을 중심으로 확인하고 정리했습니다.`;
  }

  return `${areaLabel} 현장에서 직접 확인한 상태를 기준으로 관리 범위를 정리한 작업 기록입니다.`;
}

function getBlogAreaLabel(post: AreaPost, areaLabel: string) {
  const match = post.title.match(/[가-힣]+(?:동|면|읍|리|권)/);
  return match?.[0] ?? areaLabel;
}

function WorkPhotoCollage({ images, title }: { images: string[]; title: string }) {
  const visibleImages = images.slice(0, 5);

  if (visibleImages.length === 1) {
    return (
      <div className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-blue-50 shadow-sm">
        <img
          src={visibleImages[0]}
          alt={`${title} 현장 사진`}
          loading="lazy"
          className="h-auto w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="grid h-[520px] gap-3 overflow-hidden rounded-[1.5rem] md:grid-cols-4 md:grid-rows-2">
      {visibleImages.map((image, index) => {
        const isMain = index === 0;
        const hiddenCount = images.length - visibleImages.length;

        return (
          <div
            key={`${image}-${index}`}
            className={`relative overflow-hidden border border-blue-100 bg-blue-50 shadow-sm ${
              isMain ? "md:col-span-2 md:row-span-2" : ""
            } ${index === 1 && visibleImages.length === 2 ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            <img
              src={image}
              alt={`${title} 현장 사진 ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {index === visibleImages.length - 1 && hiddenCount > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/70 text-xl font-extrabold text-white backdrop-blur-[1px]">
                +{hiddenCount}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useAllAreaPosts();

  const posts = useMemo(() => {
    const notionPosts = data ?? [];
    return notionPosts.length > 0 ? notionPosts : fallbackPosts;
  }, [data]);

  const post = posts.find((item) => getWorkSlug(item) === slug);
  const images = post?.images?.length ? post.images : post ? [post.image] : [];
  const areaLabel = post?.area ? areaLabels[post.area] ?? post.area : "이천";
  const backHref = post?.area ? `/records?area=${post.area}` : "/records";
  const blogAreaLabel = post ? getBlogAreaLabel(post, areaLabel) : areaLabel;
  const detailRows = post ? [
    ["지역", areaLabel],
    ["건물 유형", post.buildingType || getDefaultBuildingType(post.title)],
    ["작업 내용", post.workScope || getDefaultWorkScope(post.title)],
    ["작업 형태", post.workType || getDefaultWorkType(post.title)],
  ] : [];

  useEffect(() => {
    if (!post) return;

    const title = `${post.title} | ${areaLabel} 계단청소 작업일지 | 이천계단지기`;
    const description = post.description || `${areaLabel} ${post.title} 현장 기록입니다. 이천계단지기가 직접 관리한 계단청소 작업 사진과 날짜를 확인할 수 있습니다.`;

    document.title = title;

    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;

      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }

      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", `${areaLabel} 계단청소, ${post.title}, 이천계단청소, 빌라계단청소, 상가계단청소`);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", window.location.href, true);
    setMeta("og:image", post.image, true);

    return () => {
      document.title = "이천계단청소 전문 이천계단지기 | 빌라·상가 정기청소";
    };
  }, [areaLabel, post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
        <Navbar />
        <main className="container max-w-5xl pt-24 pb-16 md:pt-32">
          <Skeleton className="mb-6 h-6 w-40" />
          <Skeleton className="mb-6 h-16 w-3/4" />
          <Skeleton className="mb-8 aspect-[16/10] w-full rounded-[1.5rem]" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="aspect-[4/3] rounded-xl" />
            <Skeleton className="aspect-[4/3] rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
        <Navbar />
        <main className="container max-w-3xl pt-28 pb-16 text-center">
          <p className="mb-5 text-lg font-bold text-foreground">작업 기록을 찾을 수 없습니다.</p>
          <Link href="/records">
            <a className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
              작업 기록으로 돌아가기
            </a>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />
      <main className="container max-w-5xl pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.article
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href={backHref}>
            <a className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-80">
              <ArrowLeft className="h-4 w-4" />
              {areaLabel} 작업 기록으로 돌아가기
            </a>
          </Link>

          <section className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white shadow-sm">
            <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[330px] overflow-hidden bg-blue-50 md:min-h-[520px]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover brightness-[1.03] contrast-[1.03] saturate-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              <div className="flex flex-col justify-center p-7 md:p-9">
                <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
                  WORK RECORD
                </p>
                <h1 className="mb-5 text-3xl font-extrabold leading-[1.15] text-foreground md:text-5xl">
                  {post.title}
                </h1>
                <div className="mb-7 flex flex-wrap gap-3 text-sm font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-primary">
                    <CalendarDays className="h-4 w-4" />
                    {post.date} 작업
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-primary">
                    <Images className="h-4 w-4" />
                    사진 {images.length}장
                  </span>
                </div>
                <p className="mb-7 max-w-2xl text-base leading-7 text-muted-foreground">
                  {getIntroText(post, areaLabel)}
                </p>

                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white text-sm shadow-sm">
                  {detailRows.map(([label, value], index) => (
                    <div key={label} className={`grid grid-cols-[7.5rem_1fr] ${index > 0 ? "border-t border-blue-100" : ""}`}>
                      <div className="bg-blue-50/70 px-4 py-3 font-extrabold text-slate-600">{label}</div>
                      <div className="px-4 py-3 font-semibold leading-6 text-slate-800">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-extrabold text-foreground">현장 사진</h2>
            <WorkPhotoCollage images={images} title={post.title} />
          </section>

          <section className="mt-14 rounded-[1.5rem] bg-primary p-7 text-white md:p-9">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="mb-3 text-sm font-bold tracking-[0.25em] text-white/70">CONTACT</p>
                <h2 className="mb-4 text-2xl font-extrabold md:text-3xl">비슷한 건물 관리가 필요하신가요?</h2>
                <p className="text-sm leading-6 text-white/75 md:text-base">
                  건물 사진을 보내주시면 계단, 복도, 공동현관, 엘리베이터 포함 범위를 확인해 안내드립니다.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                {post.blogUrl ? (
                  <a href={post.blogUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary">
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#03c75a] text-[11px] font-black leading-none text-white">
                      N
                    </span>
                    {post.blogButtonLabel || `${blogAreaLabel} 블로그 후기 보러가기`}
                  </a>
                ) : null}
                <a href="https://pf.kakao.com/_IiNfn/chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  카톡 문의
                </a>
                <a href="tel:01084381887" className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white">
                  <Phone className="mr-2 h-4 w-4" />
                  전화 문의
                </a>
              </div>
            </div>
          </section>
        </motion.article>
      </main>
    </div>
  );
}
