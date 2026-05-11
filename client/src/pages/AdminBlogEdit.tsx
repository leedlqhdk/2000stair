import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { Link } from "wouter";

export default function AdminBlogEdit() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const postId = id ? parseInt(id) : undefined;
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [published, setPublished] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagSlug, setNewTagSlug] = useState("");
  const [showTagForm, setShowTagForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: allTags, refetch: refetchTags } = trpc.blog.tags.useQuery();
  const { data: existingPost } = trpc.blog.getById.useQuery(
    { id: postId! },
    { enabled: isEdit }
  );

  useEffect(() => {
    if (existingPost && isEdit) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setThumbnail(existingPost.thumbnail ?? null);
      setImages(existingPost.images);
      setSelectedTags(existingPost.tags);
      setPublished(existingPost.published === "published");
    }
  }, [existingPost, isEdit]);

  const uploadImage = trpc.blog.uploadImage.useMutation();
  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("게시글이 작성되었습니다.");
      utils.blog.adminList.invalidate();
      navigate("/admin/blog");
    },
    onError: (e) => toast.error(e.message),
  });
  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("게시글이 수정되었습니다.");
      utils.blog.adminList.invalidate();
      navigate("/admin/blog");
    },
    onError: (e) => toast.error(e.message),
  });
  const createTag = trpc.blog.createTag.useMutation({
    onSuccess: () => {
      toast.success("태그가 추가되었습니다.");
      refetchTags();
      setNewTagName("");
      setNewTagSlug("");
      setShowTagForm(false);
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

  const handleFileUpload = async (
    file: File,
    target: "thumbnail" | "image"
  ) => {
    if (file.size > 16 * 1024 * 1024) {
      toast.error("파일 크기는 16MB 이하여야 합니다.");
      return;
    }
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await uploadImage.mutateAsync({
        filename: file.name,
        mimeType: file.type,
        base64,
      });
      if (target === "thumbnail") {
        setThumbnail(result.url);
      } else {
        setImages((prev) => [...prev, result.url]);
      }
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return toast.error("제목을 입력해주세요.");
    if (!content.trim()) return toast.error("내용을 입력해주세요.");

    const payload = {
      title,
      content,
      thumbnail: thumbnail ?? undefined,
      images,
      tags: selectedTags,
      published: published ? ("published" as const) : ("draft" as const),
    };

    if (isEdit && postId) {
      updatePost.mutate({ id: postId, ...payload });
    } else {
      createPost.mutate(payload);
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/admin/blog">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-gray-500">
          <ArrowLeft className="w-4 h-4 mr-1" />
          목록으로
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-8">
        {isEdit ? "작업일지 수정" : "새 작업일지 작성"}
      </h1>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label className="mb-1 block">제목 *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 이천 ○○빌라 계단청소 완료"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <Label className="mb-1 block">대표 사진 (썸네일)</Label>
          {thumbnail ? (
            <div className="relative inline-block">
              <img src={thumbnail} alt="썸네일" className="h-40 rounded-lg object-cover" />
              <button
                onClick={() => setThumbnail(null)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => thumbInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "업로드 중..." : "사진 선택"}
            </button>
          )}
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f, "thumbnail");
              e.target.value = "";
            }}
          />
        </div>

        {/* Content */}
        <div>
          <Label className="mb-1 block">내용 *</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="작업 내용, 현장 상황, 사용한 세제 등을 자유롭게 작성해주세요."
            rows={10}
          />
        </div>

        {/* Extra images */}
        <div>
          <Label className="mb-1 block">추가 사진</Label>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="h-24 w-24 rounded-lg object-cover" />
                <button
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5 text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => imgInputRef.current?.click()}
              disabled={uploading}
              className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-xs gap-1"
            >
              <Upload className="w-4 h-4" />
              추가
            </button>
          </div>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              files.forEach((f) => handleFileUpload(f, "image"));
              e.target.value = "";
            }}
          />
        </div>

        {/* Tags */}
        <div>
          <Label className="mb-2 block">태그</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(allTags ?? []).map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {tag.name}
              </button>
            ))}
            <button
              onClick={() => setShowTagForm(!showTagForm)}
              className="px-3 py-1 rounded-full text-sm border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              태그 추가
            </button>
          </div>
          {showTagForm && (
            <div className="flex gap-2 items-end mt-2">
              <div>
                <Label className="text-xs mb-1 block">태그명</Label>
                <Input
                  value={newTagName}
                  onChange={(e) => {
                    setNewTagName(e.target.value);
                    setNewTagSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-가-힣]/g, ""));
                  }}
                  placeholder="계단청소"
                  className="w-32"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">슬러그</Label>
                <Input
                  value={newTagSlug}
                  onChange={(e) => setNewTagSlug(e.target.value)}
                  placeholder="stair"
                  className="w-28"
                />
              </div>
              <Button
                size="sm"
                onClick={() => createTag.mutate({ name: newTagName, slug: newTagSlug })}
                disabled={!newTagName || !newTagSlug}
              >
                추가
              </Button>
            </div>
          )}
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">
            {published ? "공개 (바로 게시)" : "임시저장 (비공개)"}
          </Label>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={createPost.isPending || updatePost.isPending || uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEdit ? "수정 완료" : "게시하기"}
          </Button>
          <Link href="/admin/blog">
            <Button variant="outline">취소</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
