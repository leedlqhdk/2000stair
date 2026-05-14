import { Link, useParams } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarDays, ExternalLink } from "lucide-react";

// URL을 감지하여 클릭 가능한 링크 버튼으로 변환
function renderContentWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      // URL 끝의 불필요한 문장부호 제거
      const cleanUrl = part.replace(/[.,!?;:)"']+$/, "");
      const isNaver = cleanUrl.includes("blog.naver.com");
      return (
        <a
          key={i}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
         className="inline-flex items-center gap-1.5 my-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline"
          >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          {isNaver ? "네이버 블로그 후기 보러가기" : cleanUrl.length > 50 ? cleanUrl.slice(0, 50) + "..." : cleanUrl}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id ?? "0");

  const { data: post, isLoading, error } = trpc.blog.getById.useQuery({ id: postId });
  const { data: allTags } = trpc.blog.tags.useQuery();

  // 동적 SEO 메타 태그 적용 - Hook은 항상 최상단에 위치해야 함 (조건부 return 이전)
  useEffect(() => {
    if (!post) return;
    const seoTitle = post.seoTitle || `${post.title} | 이천계단지기`;
    const seoDesc = post.seoDescription || `이천계단청소 전문 이천계단지기. ${post.content.slice(0, 70)}...`;
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
    setMeta("og:url", window.location.href, true);
    setMeta("twitter:title", seoTitle, true);
    setMeta("twitter:description", seoDesc, true);

    return () => {
      // 페이지 이탈 시 기본 title 복원
      document.title = "이천계단청소 전문 이천계단지기 | 빌라·상가 정기청소";
    };
  }, [post]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-4">게시글을 찾을 수 없습니다.</p>
        <Link href="/blog">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const matchedTags = (allTags ?? []).filter((t) => post.tags.includes(t.id));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back button */}
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-gray-500">
            <ArrowLeft className="w-4 h-4 mr-1" />
            작업일지 목록
          </Button>
        </Link>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            {new Date(post.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>

        {/* Tags */}
        {matchedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {matchedTags.map((t) => (
              <Badge key={t.id} variant="secondary">
                {t.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Thumbnail */}
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={(post as { thumbnailAlt?: string }).thumbnailAlt || post.title}
            className="w-full rounded-xl mb-8 object-cover max-h-96"
          />
        )}

        {/* Content */}
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
          style={{ fontSize: "1rem", lineHeight: "1.8", whiteSpace: "pre-wrap" }}
        >
          {renderContentWithLinks(post.content)}
        </div>

        {/* Extra images */}
        {post.images.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.images.map((item, i) => {
              // {url, alt} 객체 또는 string 모두 처리
              const imgUrl = typeof item === "string" ? item : (item as { url: string }).url;
              const imgAlt = typeof item === "string" ? `이천계단지기 작업 사진 ${i + 1}` : ((item as { alt?: string }).alt || `이천계단지기 작업 사진 ${i + 1}`);
              return (
                <img
                  key={i}
                  src={imgUrl}
                  alt={imgAlt}
                  className="w-full rounded-lg object-cover"
                />
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl text-center">
          <p className="font-semibold text-blue-900 mb-2">이천계단지기에 문의하세요</p>
          <p className="text-sm text-blue-700 mb-4">무료 방문 견적 · 010-8438-1887</p>
          <Link href="/#quote">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">무료 견적 신청하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
