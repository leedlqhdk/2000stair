import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MessageCircle,
  Phone,
} from "lucide-react";
import PostContent from "@/components/PostContent";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const SITE_URL = "https://2000stair.kr";


function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id ?? "0");

  const { data: post, isLoading, error } = trpc.blog.getById.useQuery({ id: postId });
  const { data: allTags } = trpc.blog.tags.useQuery();
  const { data: listData } = trpc.blog.listLite.useQuery(
    { limit: 12, offset: 0 },
    { staleTime: 5 * 60_000 }
  );

  const otherPosts = (listData?.posts ?? [])
    .filter((p) => p.id !== postId)
    .slice(0, 8);
  const [relatedPaused, setRelatedPaused] = useState(false);

  useEffect(() => {
    if (!post) return;

    const canonicalUrl = `${SITE_URL}/blog/${postId}`;
    const seoTitle = post.seoTitle || `${post.title} | 이천계단지기`;
    const seoDesc =
      post.seoDescription ||
      `이천계단청소 전문 이천계단지기. ${post.content.slice(0, 70)}...`;
    const seoKw = post.seoKeywords || "이천계단청소,이천계단지기,이천빌라청소";

    document.title = seoTitle;

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

    setMeta("description", seoDesc);
    setMeta("keywords", seoKw);
    setMeta("og:title", seoTitle, true);
    setMeta("og:description", seoDesc, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("twitter:title", seoTitle);
    setMeta("twitter:description", seoDesc);
    setCanonical(canonicalUrl);

    return () => {
      document.title = "이천계단청소 전문 이천계단지기 | 빌라·상가 정기청소";
      setCanonical(`${SITE_URL}/`);
    };
  }, [post, postId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
        <Navbar />
        <div className="container max-w-3xl py-16">
          <Skeleton className="h-5 w-32 mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-5 w-1/3 mb-8" />
          <Skeleton className="aspect-square max-w-xs mx-auto w-full rounded-2xl mb-8" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-5/6 mb-3" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
        <Navbar />
        <div className="container max-w-3xl py-24 text-center">
          <p className="text-muted-foreground text-lg mb-5">
            게시글을 찾을 수 없습니다.
          </p>
          <Link href="/blog">
            <Button variant="outline">작업일지 목록으로</Button>
          </Link>
        </div>
      </div>
    );
  }

  const matchedTags = (allTags ?? []).filter((t) => post.tags.includes(t.id));
  const isCareGuide = matchedTags.some(
    (tag) => tag.name.includes("관리정보") || tag.slug.includes("guide") || tag.slug.includes("info")
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <article className="container max-w-3xl px-4 pt-10 pb-16 md:pt-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          {/* 헤더 내비 */}
          <div className="mb-7 flex items-center justify-between gap-4">
            <Link href={isCareGuide ? "/guide" : "/blog"}>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {isCareGuide ? "관리정보 목록" : "작업일지 목록"}
              </Button>
            </Link>

            <span className="text-xs font-bold tracking-[0.25em] text-primary">
              {isCareGuide ? "STAIR CARE GUIDE" : "FIELD ARCHIVE"}
            </span>
          </div>

          {/* 제목 & 메타 */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-snug mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date(post.createdAt).toLocaleDateString("ko-KR")}
              </span>

              {matchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {matchedTags.map((t) => (
                    <Badge key={t.id} variant="secondary" className="rounded-full text-xs">
                      {t.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 썸네일 */}
          {post.thumbnail && (
            <div className="overflow-hidden rounded-2xl border border-blue-50 bg-blue-50 mb-8 aspect-square max-w-xs mx-auto">
              <img
                src={post.thumbnail}
                alt={(post as { thumbnailAlt?: string }).thumbnailAlt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 관리정보 요약 박스 */}
          {isCareGuide && (
            <div className="mb-7 rounded-xl border border-blue-100 bg-blue-50/60 px-5 py-4">
              <p className="text-xs font-extrabold text-primary mb-1.5">이 글에서 확인할 내용</p>
              <p className="text-sm leading-7 text-muted-foreground">
                현장에서 자주 확인하는 계단 관리 문제를 기준으로 원인과 관리 포인트를 쉽게 정리했습니다.
              </p>
            </div>
          )}

          {/* 본문 */}
          <div className="mb-8 rounded-2xl border border-blue-50 bg-white p-5 shadow-sm md:p-8">
            <PostContent content={post.content} />
          </div>

          {/* 추가 이미지 */}
          {post.images.length > 0 && (
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.images.map((item, i) => {
                const imgUrl =
                  typeof item === "string" ? item : (item as { url: string }).url;
                const imgAlt =
                  typeof item === "string"
                    ? `이천계단지기 작업 사진 ${i + 1}`
                    : (item as { alt?: string }).alt ||
                      `이천계단지기 작업 사진 ${i + 1}`;

                return (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={imgAlt}
                    loading="lazy"
                    className="w-full rounded-2xl border border-blue-50 object-cover shadow-sm"
                  />
                );
              })}
            </div>
          )}

          {/* 다른 정보글 — 썸네일 카드 (CTA 위) */}
          {otherPosts.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-extrabold text-foreground md:text-lg">
                  다른 정보글도 확인해보세요
                </h2>
                <Link
                  href="/guide"
                  className="text-[13px] font-bold text-muted-foreground transition hover:text-primary"
                >
                  전체보기 →
                </Link>
              </div>

              {/* 1:1 썸네일 한 줄 가로 자동 스크롤 (무한 루프, 터치/호버 시 일시정지) */}
              <div
                className="relative overflow-hidden"
                onMouseEnter={() => setRelatedPaused(true)}
                onMouseLeave={() => setRelatedPaused(false)}
                onTouchStart={() => setRelatedPaused(true)}
                onTouchEnd={() => setRelatedPaused(false)}
              >
                <div
                  className="flex w-max"
                  style={{
                    animation: `slideLeft ${Math.max(otherPosts.length * 4, 16)}s linear infinite`,
                    animationPlayState: relatedPaused ? "paused" : "running",
                  }}
                >
                  {[0, 1].map((half) => (
                    <div key={half} className="flex gap-3 pr-3">
                      {otherPosts.map((p) => (
                        <Link
                          key={`${half}-${p.id}`}
                          href={`/blog/${p.id}`}
                          aria-label={p.title}
                          className="group block h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-blue-50 bg-blue-50 shadow-sm md:h-40 md:w-40"
                        >
                          {p.thumbnail ? (
                            <img
                              src={p.thumbnail}
                              alt={p.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <FileText className="h-7 w-7 text-blue-300" />
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                {/* 좌우 페이드 */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl bg-primary text-white p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-white/70 mb-2">
                  CONTACT
                </p>
                <h2 className="text-xl md:text-2xl font-extrabold mb-2">
                  건물 사진을 보내주시면 상담이 빨라집니다.
                </h2>
                <p className="text-white/75 text-sm leading-relaxed">
                  이천 빌라·원룸·상가 공용공간 정기관리 상담은 카카오톡으로 가능합니다.
                </p>
              </div>

              <div className="flex flex-row md:flex-col gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-xl font-bold flex-1 md:flex-none"
                  onClick={() =>
                    window.open("https://pf.kakao.com/_IiNfn/chat", "_blank")
                  }
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  카톡 상담
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl bg-transparent border-white/30 text-white hover:bg-white hover:text-primary flex-1 md:flex-none"
                  onClick={() => (window.location.href = "tel:010-8438-1887")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  전화 문의
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  );
}
