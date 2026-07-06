import { Link, useParams } from "wouter";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ExternalLink,
  MessageCircle,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const SITE_URL = "https://2000stair.kr";

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");
}

function NaverBlogButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#03c75a] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(3,199,90,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(3,199,90,0.42)] active:scale-95 md:gap-2.5 md:px-7 md:text-[15px]"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[13px] font-black text-[#03c75a]">
        N
      </span>
      네이버 블로그에서 자세히 보기
      <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

// 본문 인라인: URL 링크 + **굵게** 처리
function renderInline(text: string) {
  const nodes: ReactNode[] = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  text.split(urlRegex).forEach((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const cleanUrl = part.replace(/[.,!?;:)"']+$/, "");
      nodes.push(
        <a
          key={`url-${i}`}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline decoration-blue-200 underline-offset-4 transition hover:decoration-primary"
        >
          {cleanUrl.includes("blog.naver.com")
            ? "네이버 블로그 글 보기"
            : cleanUrl.length > 50
            ? cleanUrl.slice(0, 50) + "..."
            : cleanUrl}
        </a>
      );
      return;
    }

    part.split(/(\*\*[^*]+\*\*)/g).forEach((seg, j) => {
      if (!seg) return;
      if (/^\*\*[^*]+\*\*$/.test(seg)) {
        nodes.push(
          <strong key={`b-${i}-${j}`} className="font-bold text-foreground">
            {seg.slice(2, -2)}
          </strong>
        );
      } else {
        nodes.push(<span key={`t-${i}-${j}`}>{seg}</span>);
      }
    });
  });

  return nodes;
}

// 관리자 페이지에서 올린 마크다운 느낌의 본문을 보기 좋게 렌더링
function renderContent(raw: string) {
  // 괄호로 감싼 URL은 괄호를 벗겨 별도 줄로 분리 → 버튼으로 렌더링
  const content = decodeEntities(raw).replace(
    /\(\s*(https?:\/\/[^\s)]+)\s*\)/g,
    "\n$1\n"
  );

  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let paraLines: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul
        key={`ul-${blocks.length}`}
        className="my-5 space-y-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-5"
      >
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-7 text-gray-700 md:text-base">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-3 w-3 text-primary" strokeWidth={3} />
            </span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  const flushPara = () => {
    if (paraLines.length === 0) return;
    blocks.push(
      <p
        key={`p-${blocks.length}`}
        className="my-4 whitespace-pre-wrap text-[15px] leading-8 text-gray-700 md:text-base"
      >
        {renderInline(paraLines.join("\n"))}
      </p>
    );
    paraLines = [];
  };

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    // 소제목 (## / ###)
    const headingMatch = trimmed.match(/^(#{2,})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      flushPara();
      blocks.push(
        <h2
          key={`h-${blocks.length}`}
          className="mb-4 mt-9 flex items-center gap-2.5 text-lg font-extrabold text-foreground first:mt-0 md:text-xl"
        >
          <span className="h-5 w-1 shrink-0 rounded-full bg-primary" />
          {headingMatch[2]}
        </h2>
      );
      continue;
    }

    // 목록 (- / – / •)
    const listMatch = trimmed.match(/^[-–•]\s+(.*)$/);
    if (listMatch) {
      flushPara();
      listItems.push(listMatch[1]);
      continue;
    }

    // 단독 줄 URL → 네이버는 큰 버튼, 그 외는 링크
    if (/^https?:\/\/\S+$/.test(trimmed)) {
      flushList();
      flushPara();
      const cleanUrl = trimmed.replace(/[.,!?;:)"']+$/, "");
      blocks.push(
        <div key={`link-${blocks.length}`} className="my-8 flex justify-center">
          {cleanUrl.includes("blog.naver.com") ? (
            <NaverBlogButton url={cleanUrl} />
          ) : (
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
            >
              <ExternalLink className="h-4 w-4" />
              링크 열기
            </a>
          )}
        </div>
      );
      continue;
    }

    if (trimmed === "") {
      flushList();
      flushPara();
      continue;
    }

    flushList();
    paraLines.push(line);
  }

  flushList();
  flushPara();

  return blocks;
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
            {renderContent(post.content)}
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
