import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PenLine, Trash2, Eye, EyeOff, Plus } from "lucide-react";

export default function AdminBlog() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: posts, isLoading } = trpc.blog.adminList.useQuery();
  const { data: allTags } = trpc.blog.tags.useQuery();

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("게시글이 삭제되었습니다.");
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-gray-400">
        <p>관리자만 접근할 수 있습니다.</p>
      </div>
    );
  }

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) return;
    deletePost.mutate({ id });
  };

  const togglePublish = (id: number, current: string) => {
    updatePost.mutate({
      id,
      published: current === "published" ? "draft" : "published",
    });
  };

  const getTagNames = (tagIds: number[]) => {
    return (allTags ?? [])
      .filter((t) => tagIds.includes(t.id))
      .map((t) => t.name);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">작업일지 관리</h1>
          <p className="text-sm text-gray-400 mt-1">총 {posts?.length ?? 0}개의 게시글</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-4 h-4" />
            새 글 작성
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : !posts?.length ? (
        <div className="text-center py-20 text-gray-400">
          <p className="mb-4">아직 작성된 게시글이 없습니다.</p>
          <Link href="/admin/blog/new">
            <Button variant="outline">첫 번째 작업일지 작성하기</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:shadow-sm transition-shadow"
            >
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-2xl">
                  🧹
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 truncate">{post.title}</span>
                  <Badge
                    variant={post.published === "published" ? "default" : "secondary"}
                    className="text-xs flex-shrink-0"
                  >
                    {post.published === "published" ? "공개" : "임시저장"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {getTagNames(post.tags).map((name) => (
                    <span key={name} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {name}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublish(post.id, post.published)}
                  title={post.published === "published" ? "비공개로 변경" : "공개로 변경"}
                  className="text-gray-400 hover:text-blue-600"
                >
                  {post.published === "published" ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                    <PenLine className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(post.id, post.title)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
