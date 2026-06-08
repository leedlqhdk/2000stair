import { Link, useParams } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BlogReviews from "@/components/BlogReviews";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  MessageCircle,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const SITE_URL = "https://2000stair.kr";

function renderContentWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      const cleanUrl = part.replace(/[.,!?;:)"']+$/, "");
      const isNaver = cleanUrl.includes("blog.naver.com");

      return (
        <a
          key={i}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 my-1 px-3 py-1.5 rounded-xl text-sm font-semibold bg-blue-50 text-primary border border-blue-100 hover:bg-primary hover:text-white hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline"
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          {isNaver
            ? "네이버 블로그에서 보기"
            : cleanUrl.length > 50
              ? cleanUrl.slice(0, 50) + "..."
              : cleanUrl}
        </a>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

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
        <div className="container max-w-4xl py-16">
          <Skeleton className="h-5 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-5 w-1/3 mb-8" />
          <Skeleton className="h-96 w-full rounded-[2rem] mb-10" />
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
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <Navbar />
      <article className="container max-w-4xl py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <Link href={isCareGuide ? "/#care-guide" : "/blog"}>
            <Button
              variant="ghost"
              size="sm"
              className="mb-8 -ml-2 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {isCareGuide ? "관리정보 목록" : "작업일지 목록"}
            </Button>
          </Link>

          <p className="text-sm font-bold tracking-[0.35em] text-primary mb-5">
            {isCareGuide ? "STAIR CARE GUIDE" : "FIELD ARCHIVE"}
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("ko-KR")}
            </span>

            {matchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {matchedTags.map((t) => (
                  <Badge key={t.id} variant="secondary" className="rounded-full">
                    {t.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {post.thumbnail && (
            <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl mb-12">
              <img
                src={post.thumbnail}
                alt={(post as { thumbnailAlt?: string }).thumbnailAlt || post.title}
                className="w-full max-h-[520px] object-cover"
              />
            </div>
          )}

          {isCareGuide && (
            <div className="mb-8 rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-sm md:p-6">
              <p className="text-sm font-extrabold text-primary mb-2">이 글에서 확인할 내용</p>
              <p className="text-sm leading-7 text-muted-foreground">
                현장에서 자주 확인하는 계단 관리 문제를 기준으로 원인과 관리 포인트를 쉽게 정리했습니다.
              </p>
            </div>
          )}

          <div className="rounded-[2rem] border border-blue-100 bg-white shadow-sm p-6 md:p-10">
            <div
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
              style={{
                fontSize: "1.05rem",
                lineHeight: "1.95",
                whiteSpace: "pre-wrap",
              }}
            >
              {renderContentWithLinks(post.content)}
            </div>
          </div>

          {post.images.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full rounded-[1.5rem] border border-blue-100 object-cover shadow-sm"
                  />
                );
              })}
            </div>
          )}

          <div className="mt-12 rounded-[2rem] bg-primary text-white p-7 md:p-9">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-sm font-bold tracking-[0.25em] text-white/70 mb-3">
                  CONTACT
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                  건물 사진을 보내주시면 상담이 빨라집니다.
                </h2>
                <p className="text-white/75 text-sm md:text-base leading-relaxed">
                  이천 빌라·원룸·상가 공용공간 정기관리 상담은 카카오톡으로 가능합니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-xl font-bold"
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
                  className="rounded-xl bg-transparent border-white/30 text-white hover:bg-white hover:text-primary"
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

      {isCareGuide && <BlogReviews />}
    </main>
  );
}
