import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight } from "lucide-react";

export default function LatestPosts() {
  const { data } = trpc.blog.list.useQuery({ limit: 3, offset: 0 });
  const { data: allTags } = trpc.blog.tags.useQuery();

  const posts = data?.posts ?? [];

  if (!posts.length) return null;

  return (
    <section className="py-16 bg-gray-50" id="latest-posts">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
              이천계단청소 작업일지
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              최근 작업 현장
            </h2>
          </div>
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="text-blue-600 gap-1 hidden sm:flex">
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const matchedTags = (allTags ?? []).filter((t) =>
              post.tags.includes(t.id)
            );
            return (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-blue-50 flex items-center justify-center text-4xl">
                      🧹
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug flex-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <CalendarDays className="w-3 h-3" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    {matchedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {matchedTags.slice(0, 2).map((t) => (
                          <Badge key={t.id} variant="secondary" className="text-xs">
                            {t.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/blog">
            <Button variant="outline" className="gap-1">
              전체 작업일지 보기 <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
