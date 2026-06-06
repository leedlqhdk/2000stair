import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PenLine, Trash2, Eye, EyeOff, Plus, LogIn } from "lucide-react";

export default function AdminBlog() {
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();

  const { data: posts, isLoading } = trpc.blog.adminList.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: allTags } = trpc.blog.tags.useQuery();

  const passwordLogin = trpc.auth.passwordLogin.useMutation({
    onSuccess: async () => {
      toast.success("관리자 로그인 완료");
      setPassword("");
      await utils.auth.me.invalidate();
      await utils.blog.adminList.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

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

  const handlePasswordLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }
    passwordLogin.mutate({ password: trimmedPassword });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-blue-50/30 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-[1.5rem] border border-blue-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold tracking-[0.25em] text-primary mb-3">ADMIN</p>
          <h1 className="text-2xl font-extrabold text-foreground mb-3">관리자 비밀번호가 필요합니다</h1>
          <p className="text-sm leading-7 text-muted-foreground mb-6">
            정보성글과 작업일지는 관리자 비밀번호를 입력한 뒤 작성, 수정, 삭제할 수 있습니다.
          </p>
          <form onSubmit={handlePasswordLogin} className="mx-auto max-w-sm space-y-3 text-left">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="admin-password">
              관리자 비밀번호
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="비밀번호 입력"
              className="h-12 w-full rounded-xl border border-blue-100 bg-white px-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <Button
              type="submit"
              disabled={passwordLogin.isPending}
              className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <LogIn className="h-4 w-4" />
              {passwordLogin.isPending ? "확인 중" : "관리자 로그인"}
            </Button>
          </form>
          <p className="mt-5 text-xs leading-6 text-muted-foreground">
            비밀번호는 홈페이지 설정값으로만 확인합니다. 채팅이나 메모장에 남기지 않는 편이 좋습니다.
          </p>
        </div>
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
          <h1 className="text-2xl font-bold">작업일지·관리정보 관리</h1>
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
            <Button variant="outline">첫 번째 글 작성하기</Button>
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
