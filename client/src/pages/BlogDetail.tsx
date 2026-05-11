import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarDays } from "lucide-react";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id ?? "0");

  const { data: post, isLoading, error } = trpc.blog.getById.useQuery({ id: postId });
  const { data: allTags } = trpc.blog.tags.useQuery();

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
            alt={post.title}
            className="w-full rounded-xl mb-8 object-cover max-h-96"
          />
        )}

        {/* Content */}
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
          style={{ fontSize: "1rem", lineHeight: "1.8" }}
        >
          {post.content}
        </div>

        {/* Extra images */}
        {post.images.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`작업 사진 ${i + 1}`}
                className="w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl text-center">
          <p className="font-semibold text-blue-900 mb-2">이천계단지기에 문의하세요</p>
          <p className="text-sm text-blue-700 mb-4">무료 방문 견적 · 010-8180-6895</p>
          <Link href="/#quote">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">무료 견적 신청하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
