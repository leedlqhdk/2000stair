import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Plus, Sparkles, Upload, Wand2, X } from "lucide-react";
import { optimizeImage, formatBytes } from "@/lib/imageOptimizer";

type ImageItem = { url: string; alt: string };

const isStorableImageUrl = (url: string | null | undefined) => {
  return !!url;
};

export default function AdminBlogEdit() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const postId = id ? Number(id) : undefined;
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();

  const [naverUrl, setNaverUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailAlt, setThumbnailAlt] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [published, setPublished] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagSlug, setNewTagSlug] = useState("");
  const [showTagForm, setShowTagForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [showSeo, setShowSeo] = useState(false);
  const [uploadNote, setUploadNote] = useState("");

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const { data: allTags, refetch: refetchTags } = trpc.blog.tags.useQuery();
  const { data: existingPost } = trpc.blog.getById.useQuery({ id: postId! }, { enabled: isEdit });

  useEffect(() => {
    if (!existingPost || !isEdit) return;

    setTitle(existingPost.title);
    setContent(existingPost.content);
    setThumbnail(existingPost.thumbnail ?? null);
    setThumbnailAlt(existingPost.thumbnailAlt ?? "");
    setImages(
      (existingPost.images as unknown[]).map((img) =>
        typeof img === "string" ? { url: img, alt: "" } : (img as ImageItem)
      )
    );
    setSelectedTags(existingPost.tags);
    setPublished(existingPost.published === "published");
    setSeoTitle(existingPost.seoTitle ?? "");
    setSeoDescription(existingPost.seoDescription ?? "");
    setSeoKeywords(existingPost.seoKeywords ?? "");
  }, [existingPost, isEdit]);

  const importNaverDraft = trpc.blog.importNaverDraft.useMutation({
    onSuccess: (data) => {
      setTitle(data.title);
      setContent(data.content);
      if (data.thumbnail) setThumbnail(data.thumbnail);
      setThumbnailAlt(data.thumbnailAlt);
      setSeoTitle(data.seoTitle);
      setSeoDescription(data.seoDescription);
      setSeoKeywords(data.seoKeywords);
      setShowSeo(true);
      toast.success("네이버 글을 홈페이지용 정보글 초안으로 바꿨어요.");
    },
    onError: (e) => toast.error(e.message),
  });

  const uploadImage = trpc.blog.uploadImage.useMutation();
  const generateSeo = trpc.blog.generateSeo.useMutation({
    onSuccess: (data) => {
      setSeoTitle(data.seoTitle);
      setSeoDescription(data.seoDescription);
      setSeoKeywords(data.seoKeywords);
      setShowSeo(true);
      toast.success("SEO 문구를 다시 만들었어요.");
    },
    onError: (e) => toast.error(e.message),
  });
  const generateAlt = trpc.blog.generateAlt.useMutation();

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("게시글이 저장됐어요.");
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
      navigate("/admin/blog");
    },
    onError: (e) => toast.error(e.message),
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("게시글이 수정됐어요.");
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
      navigate("/admin/blog");
    },
    onError: (e) => toast.error(e.message),
  });

  const createTag = trpc.blog.createTag.useMutation({
    onSuccess: () => {
      toast.success("태그가 추가됐어요.");
      refetchTags();
      setNewTagName("");
      setNewTagSlug("");
      setShowTagForm(false);
    },
    onError: (e) => toast.error(e.message),
  });

  if (loading) return null;
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-gray-400">
        <p>관리자만 접근할 수 있습니다.</p>
      </div>
    );
  }

  const handleImportNaver = () => {
    if (!naverUrl.trim()) return toast.error("네이버 블로그 주소를 붙여넣어주세요.");
    importNaverDraft.mutate({ url: naverUrl.trim() });
  };

  const handleGenerateSeo = () => {
    if (!title.trim()) return toast.error("제목을 먼저 입력해주세요.");
    if (!content.trim()) return toast.error("내용을 먼저 입력해주세요.");
    generateSeo.mutate({ title, content });
  };

  const handleGenerateAlt = async (imageUrl: string, target: "thumbnail" | "image") => {
    if (imageUrl.startsWith("data:")) {
      toast.error("사진 설명은 사진 저장 후 직접 입력해주세요.");
      return;
    }

    try {
      const result = await generateAlt.mutateAsync({ imageUrl, title: title || undefined });
      if (target === "thumbnail") {
        setThumbnailAlt(result.alt);
      } else {
        setImages((prev) => prev.map((img) => (img.url === imageUrl ? { ...img, alt: result.alt } : img)));
      }
    } catch {
      toast.error("사진 설명을 자동 생성하지 못했어요. 직접 입력해도 됩니다.");
    }
  };

  const handleFileUpload = async (file: File, target: "thumbnail" | "image") => {
    if (file.size > 16 * 1024 * 1024) {
      toast.error("사진은 16MB 이하만 올릴 수 있어요.");
      return;
    }

    setUploading(true);
    try {
      const optimized = await optimizeImage(file, {
        isThumbnail: target === "thumbnail",
        quality: 0.55,
        maxWidth: 900,
        maxHeight: 700,
        thumbnailMaxSize: 480,
      });
      const ext = optimized.mimeType === "image/webp" ? "webp" : "jpg";
      const filename = file.name.replace(/\.[^.]+$/, `.${ext}`);
      const result = await uploadImage.mutateAsync({
        filename,
        mimeType: optimized.mimeType,
        base64: optimized.base64,
      });

      setUploadNote(`${formatBytes(optimized.originalSize)} → ${formatBytes(optimized.optimizedSize)}로 줄였어요.`);

      if (target === "thumbnail") {
        setThumbnail(result.url);
        setThumbnailAlt(thumbnailAlt || `${title || "이천계단지기"} 대표 사진`);
      } else {
        setImages((prev) => [...prev, { url: result.url, alt: `${title || "이천계단지기"} 현장 사진` }]);
      }
    } catch {
      toast.error("사진 업로드에 실패했어요. 우선 사진 없이 글만 저장해주세요.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return toast.error("제목을 입력해주세요.");
    if (!content.trim()) return toast.error("내용을 입력해주세요.");

    const storableImages = images.filter((img) => isStorableImageUrl(img.url));
    const skippedImageCount = images.length - storableImages.length + (thumbnail && !isStorableImageUrl(thumbnail) ? 1 : 0);

    if (skippedImageCount > 0) {
      toast.warning("사진 저장 설정 전이라 글 먼저 저장해요. 사진은 저장 후 다시 올려주세요.");
    }

    const payload = {
      title,
      content,
      thumbnail: isStorableImageUrl(thumbnail) ? thumbnail ?? undefined : undefined,
      thumbnailAlt: thumbnailAlt || undefined,
      images: storableImages.map((img) => img.url),
      imageAlts: storableImages.map((img) => img.alt),
      tags: selectedTags,
      published: published ? ("published" as const) : ("draft" as const),
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords || undefined,
    };

    if (isEdit && postId) updatePost.mutate({ id: postId, ...payload });
    else createPost.mutate(payload);
  };

  const toggleTag = (id: number) => {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/admin/blog">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-gray-500">
          <ArrowLeft className="w-4 h-4 mr-1" />
          목록으로
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? "정보글 수정" : "새 정보글 작성"}</h1>

      {!isEdit && (
        <section className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-blue-600 p-2 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">네이버 블로그 글 자동 변환</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                네이버 글 주소를 넣으면 홈페이지용 정보글 초안, SEO 제목, 설명, 키워드를 자동으로 채웁니다. 사진이 자동으로 안 잡히면 아래에서 직접 올리면 돼요.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={naverUrl}
              onChange={(event) => setNaverUrl(event.target.value)}
              placeholder="https://blog.naver.com/icheonstair/224306730819"
              className="h-11 bg-white"
            />
            <Button
              type="button"
              onClick={handleImportNaver}
              disabled={importNaverDraft.isPending}
              className="h-11 shrink-0 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {importNaverDraft.isPending ? "변환 중" : "정보글로 변환"}
            </Button>
          </div>
        </section>
      )}
      <div className="space-y-6">
        <div>
          <Label className="mb-1 block">제목 *</Label>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 여름철 빌라 계단 냄새, 물청소만으로 해결 안 되는 이유" />
        </div>

        <div>
          <Label className="mb-1 block">대표 사진</Label>
          {thumbnail ? (
            <div className="space-y-3">
              <div className="relative inline-block overflow-hidden rounded-xl border bg-white">
                <img src={thumbnail} alt={thumbnailAlt || "대표 사진"} className="h-44 max-w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailAlt("");
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/55 p-1 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <Input value={thumbnailAlt} onChange={(event) => setThumbnailAlt(event.target.value)} placeholder="대표 사진 설명" />
                <Button type="button" variant="outline" onClick={() => thumbnail && handleGenerateAlt(thumbnail, "thumbnail")}>사진설명</Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => thumbInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-5 text-gray-500 transition hover:border-blue-400 hover:text-blue-600"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "사진 올리는 중" : "대표사진 선택"}
            </button>
          )}
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFileUpload(file, "thumbnail");
              event.target.value = "";
            }}
          />
          {uploadNote && <p className="mt-2 text-xs text-green-600">{uploadNote}</p>}
        </div>

        <div>
          <Label className="mb-1 block">내용 *</Label>
          <Textarea value={content} onChange={(event) => setContent(event.target.value)} rows={16} placeholder="정보글 본문을 작성하거나 네이버 링크로 자동 변환해보세요." />
        </div>

        <div>
          <Label className="mb-1 block">추가 사진</Label>
          {images.length > 0 && (
            <div className="mb-3 space-y-3">
              {images.map((img, index) => (
                <div key={`${img.url}-${index}`} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="relative shrink-0">
                    <img src={img.url} alt={img.alt} className="h-20 w-20 rounded-lg object-cover" />
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))} className="absolute right-1 top-1 rounded-full bg-black/55 p-0.5 text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <Input
                    value={img.alt}
                    onChange={(event) => setImages((prev) => prev.map((item, i) => (i === index ? { ...item, alt: event.target.value } : item)))}
                    placeholder="사진 설명"
                  />
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => imgInputRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-4 text-gray-500 transition hover:border-blue-400 hover:text-blue-600"
          >
            <Upload className="h-4 w-4" />
            추가사진 선택
          </button>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              Array.from(event.target.files ?? []).forEach((file) => handleFileUpload(file, "image"));
              event.target.value = "";
            }}
          />
        </div>

        <div>
          <Label className="mb-2 block">태그</Label>
          <div className="mb-3 flex flex-wrap gap-2">
            {(allTags ?? []).map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full border px-3 py-1 text-sm transition ${selectedTags.includes(tag.id) ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-600 hover:border-blue-400"}`}
              >
                {tag.name}
              </button>
            ))}
            <button type="button" onClick={() => setShowTagForm(!showTagForm)} className="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600">
              <Plus className="h-3 w-3" />
              태그 추가
            </button>
          </div>
          {showTagForm && (
            <div className="flex flex-wrap items-end gap-2 rounded-xl bg-gray-50 p-3">
              <div>
                <Label className="mb-1 block text-xs">태그명</Label>
                <Input
                  value={newTagName}
                  onChange={(event) => {
                    const value = event.target.value;
                    setNewTagName(value);
                    setNewTagSlug(value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-가-힣]/g, ""));
                  }}
                  placeholder="관리정보"
                  className="w-32"
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs">주소용 이름</Label>
                <Input value={newTagSlug} onChange={(event) => setNewTagSlug(event.target.value)} placeholder="guide" className="w-32" />
              </div>
              <Button type="button" size="sm" onClick={() => createTag.mutate({ name: newTagName, slug: newTagSlug })} disabled={!newTagName || !newTagSlug}>추가</Button>
            </div>
          )}
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Sparkles className="h-4 w-4 text-blue-500" />
              SEO 설정
              {seoTitle && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">작성됨</span>}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" size="sm" variant="outline" onClick={handleGenerateSeo} disabled={generateSeo.isPending} className="h-8 text-xs text-blue-600">
                <Sparkles className="mr-1 h-3 w-3" />
                다시 생성
              </Button>
              <button type="button" onClick={() => setShowSeo(!showSeo)} className="text-gray-400 hover:text-gray-600">
                {showSeo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {showSeo && (
            <div className="space-y-4 bg-white p-4">
              <div>
                <Label className="mb-1 block text-xs">SEO 제목</Label>
                <Input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block text-xs">SEO 설명</Label>
                <Textarea value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} rows={2} />
              </div>
              <div>
                <Label className="mb-1 block text-xs">키워드</Label>
                <Input value={seoKeywords} onChange={(event) => setSeoKeywords(event.target.value)} />
              </div>
            </div>
          )}
        </section>

        {naverUrl && (
          <a href={naverUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
            네이버 원문 확인
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        <div className="flex items-center gap-3">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">{published ? "공개" : "임시저장"}</Label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSubmit} disabled={createPost.isPending || updatePost.isPending || uploading} className="bg-blue-600 text-white hover:bg-blue-700">
            {isEdit ? "수정 완료" : "저장하기"}
          </Button>
          <Link href="/admin/blog">
            <Button variant="outline">취소</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
