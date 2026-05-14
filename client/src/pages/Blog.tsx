import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  const { data: tagsData } = trpc.blog.tags.useQuery();
  const { data, isLoading } = trpc.blog.list.useQuery({
    tag: selectedTag,
    limit: 20,
    offset: 0,
  });

  const posts = data?.posts ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">작업일지</h1>
          <p className="text-gray-500">이천계단지기의 실제 청소 작업 현장을 확인하세요.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tag filter */}
        {tagsData && tagsData.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedTag === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(undefined)}
              className="rounded-full"
            >
              전체
            </Button>
            {tagsData.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTag === tag.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag.slug)}
                className="rounded-full"
              >
                {tag.name}
              </Button>
            ))}
          </div>
        )}

        {/* Post grid */}
        {isLoading ? (
          <motion.div
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
>
  </motion.div>

            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">아직 작업일지가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
       key={post.id}
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    }}
  >
    <Link href={`/blog/${post.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-200 text-4xl">🧹</span>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                      <CalendarDays className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <TagBadges tagIds={post.tags} allTags={tagsData ?? []} />
                  </CardContent>
                </Card>
              </Link>
        </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
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
    <div className="flex flex-wrap gap-1">
      {matched.map((t) => (
        <Badge key={t.id} variant="secondary" className="text-xs">
          {t.name}
        </Badge>
      ))}
    </div>
  );
}
