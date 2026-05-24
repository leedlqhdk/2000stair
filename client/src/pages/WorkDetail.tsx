import { useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Images, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
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

function getFieldNote(post: AreaPost, areaLabel: string) {
  const title = post.title;

  if (/견적/.test(title)) {
    return "현장 사진과 동선을 기준으로 계단 오염, 공용현관 범위, 정기관리 가능 여부를 함께 확인한 기록입니다.";
  }

  if (/상가|관고/.test(title)) {
    return "출입과 이동이 잦은 상가 공용부라 바닥 먼지와 손이 많이 닿는 구간을 중심으로 확인했습니다.";
  }

  if (/원룸|빌라/.test(title)) {
    return "입주민 이동이 많은 계단 동선과 공동현관 주변을 중심으로 실제 사용 흔적을 확인했습니다.";
  }

  if (/유리|현관/.test(title)) {
    return "빛이 잘 들어오는 공용현관과 유리 주변은 얼룩이 눈에 띄기 쉬워 마감 상태를 함께 확인했습니다.";
  }

  return `${areaLabel} 현장에서 직접 확인한 오염 상태와 이동 동선을 기준으로 관리 범위를 정리한 기록입니다.`;
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useAllAreaPosts();

  const posts = useMemo(() => {
    const notionPosts = data ?? [];
    const notionKeys = new Set(notionPosts.map((post) => `${post.title}-${post.date}`));
    return [
      ...notionPosts,
      ...fallbackPosts.filter((post) => !notionKeys.has(`${post.title}-${post.date}`)),
    ];
  }, [data]);

  const post = posts.find((item) => getWorkSlug(item) === slug);
  const images = post?.images?.length ? post.images : post ? [post.image] : [];
  const areaLabel = post?.area ? areaLabels[post.area] ?? post.area : "이천";
  const backHref = post?.area ? `/records?area=${post.area}` : "/records";
  const fieldNote = post ? getFieldNote(post, areaLabel) : "";

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
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              <div className="flex flex-col justify-center p-7 md:p-9">
                <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
                  WORK RECORD
                </p>
                <h1 className="mb-6 text-3xl font-extrabold leading-[1.15] text-foreground md:text-5xl">
                  {post.title}
                </h1>
                <div className="mb-7 flex flex-wrap gap-3 text-sm font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-primary">
                    <MapPin className="h-4 w-4" />
                    {areaLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-primary">
                    <CalendarDays className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-primary">
                    <Images className="h-4 w-4" />
                    사진 {images.length}장
                  </span>
                </div>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  {post.description || `${areaLabel} 현장에서 직접 관리한 계단청소 작업 기록입니다. 현장 상태와 작업 사진을 기준으로 건물에 맞는 관리 범위를 안내드립니다.`}
                </p>

                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-700">
                  <div className="mb-2 flex items-center gap-2 font-extrabold text-primary">
                    <Sparkles className="h-4 w-4" />
                    현장 메모
                  </div>
                  {fieldNote}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="mb-5 text-2xl font-extrabold text-foreground">현장 사진</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {images.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${post.title} 현장 사진 ${index + 1}`}
                  loading="lazy"
                  className="w-full rounded-[1.25rem] border border-blue-100 bg-blue-50 object-contain shadow-sm"
                />
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-[1.5rem] bg-primary p-7 text-white md:p-9">
            <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="mb-3 text-sm font-bold tracking-[0.25em] text-white/70">CONTACT</p>
                <h2 className="mb-4 text-2xl font-extrabold md:text-3xl">비슷한 건물 관리가 필요하신가요?</h2>
                <p className="text-sm leading-6 text-white/75 md:text-base">
                  건물 사진을 보내주시면 계단, 복도, 공동현관, 엘리베이터 포함 범위를 확인해 안내드립니다.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
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
