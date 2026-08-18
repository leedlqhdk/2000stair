import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CalendarDays, Images, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { Skeleton } from "@/components/ui/skeleton";
import { daewolPosts } from "@/data/areas/daewol";
import { downtownPosts } from "@/data/areas/downtown";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { getWorkSeo, workAreaLabels as areaLabels, workAreaRoutes as areaRoutes } from "@/lib/workSeo";
import { getWorkSlug } from "@/lib/workSlug";

const fallbackPosts: AreaPost[] = [
  ...majangPosts.map((post) => ({ ...post, area: "majang" })),
  ...daewolPosts.map((post) => ({ ...post, area: "daewol" })),
  ...downtownPosts,
].sort((a, b) => b.date.localeCompare(a.date));

function useAllAreaPosts() {
  return useQuery({
    queryKey: ["area-posts", "work-detail"],
    queryFn: async () => {
      const response = await fetch("/api/area-posts?limit=50", { cache: "no-store" });
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
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

function withAreaPrefix(areaLabel: string, title: string) {
  return title.includes(areaLabel) ? title : `${areaLabel} ${title}`;
}

function getIntroText(post: AreaPost, areaLabel: string) {
  if (post.description) return post.description;
  const titleWithArea = withAreaPrefix(areaLabel, post.title);

  if (/원룸|빌라/.test(post.title)) {
    return `${titleWithArea} 작업입니다. 비 오는 날 이후 흙먼지와 발자국 오염이 남기 쉬운 계단과 공동현관을 중심으로 관리했습니다.`;
  }

  if (/상가/.test(post.title)) {
    return `${titleWithArea} 작업입니다. 출입이 잦은 공용부의 먼지와 손이 닿는 구간을 중심으로 확인하고 정리했습니다.`;
  }

  return `${areaLabel} 현장에서 직접 확인한 상태를 기준으로 관리 범위를 정리한 작업 기록입니다.`;
}

function getRecommendedTargets(post: AreaPost) {
  const title = `${post.title} ${post.buildingType ?? ""} ${post.workScope ?? ""}`;

  if (/상가|상업|공용부/.test(title)) {
    return ["출입이 잦은 상가 공용계단", "손님 방문 전 인상이 중요한 건물", "먼지와 발자국이 자주 쌓이는 공용부"];
  }

  if (/원룸|빌라|연립/.test(title)) {
    return ["입주민 이동이 많은 빌라·원룸", "계단 바닥과 난간 오염이 신경 쓰이는 건물", "정기적으로 같은 사람이 관리하길 원하는 현장"];
  }

  if (/유리|현관|코팅/.test(title)) {
    return ["공동현관 유리 얼룩이 잘 보이는 건물", "출입구 첫인상을 깔끔하게 관리하고 싶은 현장", "손자국과 먼지가 반복되는 공용현관"];
  }

  if (/화장실|수전|욕실/.test(title)) {
    return ["물때와 얼룩이 눈에 띄는 화장실", "수전·타일 틈 오염을 정리하고 싶은 공간", "사진 기준으로 빠른 안내가 필요한 현장"];
  }

  return ["공용공간 상태를 꾸준히 관리하고 싶은 건물", "초도청소 후 청소 전후 사진으로 관리 상태를 확인하고 싶은 현장", "계단·복도·공동현관을 함께 맡기고 싶은 곳"];
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
    const seenSlugs = new Set(notionPosts.map(getWorkSlug));
    const missingFallbackPosts = fallbackPosts.filter((fallbackPost) => !seenSlugs.has(getWorkSlug(fallbackPost)));

    return [...notionPosts, ...missingFallbackPosts];
  }, [data]);

  const post = posts.find((item) => getWorkSlug(item) === slug);
  // 노션 설명은 빈 줄 기준으로 문단을 나눠, 첫 문단은 상단 소개로 쓰고 나머지는 본문 섹션에 표시
  const descriptionParagraphs = (post?.description ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const images = post?.images?.length ? post.images : post ? [post.image] : [];
  const areaLabel = post?.area ? areaLabels[post.area] ?? post.area : "이천";
  const backHref = post?.area ? areaRoutes[post.area] ?? "/records" : "/records";
  const blogAreaLabel = post ? getBlogAreaLabel(post, areaLabel) : areaLabel;
  const relatedLinks = post ? [
    { href: backHref, label: `${areaLabel} 계단청소 안내` },
    { href: "/services/stair", label: "계단 정기관리 안내" },
    { href: "/records", label: "전체 작업기록 보기" },
  ] : [];
  const recommendedTargets = post ? getRecommendedTargets(post) : [];
  const detailRows = post ? [
    ["지역", areaLabel],
    ["건물 유형", post.buildingType || getDefaultBuildingType(post.title)],
    ["작업 내용", post.workScope || getDefaultWorkScope(post.title)],
    ["작업 형태", post.workType || getDefaultWorkType(post.title)],
  ] : [];

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
      <Seo {...getWorkSeo(post)} />
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
                <p className="mb-4 text-xs font-bold tracking-[0.25em] text-primary md:text-sm">
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
                <p className="mb-7 max-w-2xl whitespace-pre-line text-base leading-7 text-muted-foreground">
                  {descriptionParagraphs[0] ?? getIntroText(post, areaLabel)}
                </p>

                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white text-sm shadow-sm">
                  {detailRows.map(([label, value], index) => (
                    <div key={label} className={`grid grid-cols-[7.5rem_1fr] ${index > 0 ? "border-t border-blue-100" : ""}`}>
                      <div className="bg-blue-50/70 px-4 py-3 font-extrabold text-slate-600">{label}</div>
                      <div className="px-4 py-3 font-semibold leading-6 text-slate-800">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="mb-3 text-sm font-extrabold text-primary">이런 건물에 추천해요</p>
                  <ul className="space-y-2 text-sm font-semibold leading-6 text-slate-700">
                    {recommendedTargets.map((target) => (
                      <li key={target} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{target}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {descriptionParagraphs.length > 1 ? (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-extrabold text-foreground">작업 이야기</h2>
              <div className="rounded-[1.5rem] border border-blue-100 bg-white p-7 shadow-sm md:p-10">
                {descriptionParagraphs.slice(1).map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-5 whitespace-pre-line text-base leading-8 text-slate-700 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-extrabold text-foreground">현장 사진</h2>
            <WorkPhotoCollage images={images} title={post.title} />
          </section>

          <section className="mt-12 border-y border-blue-100 py-6 md:py-8">
            <p className="mb-2 text-xs font-bold tracking-[0.25em] text-primary">RELATED LINKS</p>
            <h2 className="mb-4 text-xl font-extrabold text-foreground md:text-2xl">
              이 작업과 연결되는 안내
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-4 py-2.5 text-sm font-extrabold text-primary transition hover:bg-blue-50">
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Link>
              ))}
            </div>
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
