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
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wand2,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import {
  optimizeImage,
  formatBytes,
  type OptimizeResult,
} from "@/lib/imageOptimizer";

// 이미지 객체 타입 - url + alt 포함
type ImageItem = { url: string; alt: string };

export default function AdminBlogEdit() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const postId = id ? parseInt(id) : undefined;
  const [, navigate] = useLocation();
  const { user } = useAuth();

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
  const [generatingAlt, setGeneratingAlt] = useState<string | null>(null); // url of image being processed
  const [compressResults, setCompressResults] = useState<OptimizeResult[]>([]); // 압축 결과 목록

  // SEO 상태
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [showSeo, setShowSeo] = useState(false);

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
      // 기존 images가 string[] 또는 {url,alt}[] 모두 처리
      const parsedImages = (existingPost.images as unknown[]).map(img => {
        if (typeof img === "string") return { url: img, alt: "" };
        return img as ImageItem;
      });
      setImages(parsedImages);
      setSelectedTags(existingPost.tags);
      setPublished(existingPost.published === "published");
      setSeoTitle(existingPost.seoTitle ?? "");
      setSeoDescription(existingPost.seoDescription ?? "");
      setSeoKeywords(existingPost.seoKeywords ?? "");
    }
  }, [existingPost, isEdit]);

  const uploadImage = trpc.blog.uploadImage.useMutation();
  const generateSeo = trpc.blog.generateSeo.useMutation({
    onSuccess: data => {
      setSeoTitle(data.seoTitle);
      setSeoDescription(data.seoDescription);
      setSeoKeywords(data.seoKeywords);
      setShowSeo(true);
      toast.success("SEO 메타 태그가 자동 생성되었습니다!");
    },
    onError: e => toast.error("SEO 생성 실패: " + e.message),
  });
  const generateAlt = trpc.blog.generateAlt.useMutation();
  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("게시글이 작성되었습니다.");
      utils.blog.adminList.invalidate();
      navigate("/admin/blog");
    },
    onError: e => toast.error(e.message),
  });
  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("게시글이 수정되었습니다.");
      utils.blog.adminList.invalidate();
      navigate("/admin/blog");
    },
    onError: e => toast.error(e.message),
  });
  const createTag = trpc.blog.createTag.useMutation({
    onSuccess: () => {
      toast.success("태그가 추가되었습니다.");
      refetchTags();
      setNewTagName("");
      setNewTagSlug("");
      setShowTagForm(false);
    },
    onError: e => toast.error(e.message),
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
      // 이미지 압축 최적화
      const optimized = await optimizeImage(file, {
        isThumbnail: target === "thumbnail",
        quality: 0.82,
      });
      setCompressResults(prev => [...prev, optimized]);

      // 압축 안내 토스트
      if (optimized.compressionRate > 5) {
        toast.success(
          `이미지 압축 완료: ${formatBytes(optimized.originalSize)} → ${formatBytes(optimized.optimizedSize)} (-${optimized.compressionRate}%)`
        );
      }

      const ext = optimized.mimeType === "image/webp" ? "webp" : "jpg";
      const filename = file.name.replace(/\.[^.]+$/, "." + ext);

      const result = await uploadImage.mutateAsync({
        filename,
        mimeType: optimized.mimeType,
        base64: optimized.base64,
      });

      if (target === "thumbnail") {
        setThumbnail(result.url);
        // 썸네일 alt 자동 생성
        handleGenerateAlt(result.url, "thumbnail");
      } else {
        const newItem: ImageItem = { url: result.url, alt: "" };
        setImages(prev => [...prev, newItem]);
        // 추가 이미지 alt 자동 생성
        handleGenerateAlt(result.url, "image");
      }
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateAlt = async (
    imageUrl: string,
    target: "thumbnail" | "image"
  ) => {
    setGeneratingAlt(imageUrl);
    try {
      const result = await generateAlt.mutateAsync({
        imageUrl,
        title: title || undefined,
      });
      if (target === "thumbnail") {
        setThumbnailAlt(result.alt);
      } else {
        setImages(prev =>
          prev.map(img =>
            img.url === imageUrl ? { ...img, alt: result.alt } : img
          )
        );
      }
      toast.success("alt 태그가 자동 생성되었습니다!");
    } catch {
      toast.error("alt 태그 생성에 실패했습니다. 직접 입력해주세요.");
    } finally {
      setGeneratingAlt(null);
    }
  };

  const handleGenerateSeo = () => {
    if (!title.trim()) return toast.error("제목을 먼저 입력해주세요.");
    if (!content.trim()) return toast.error("내용을 먼저 입력해주세요.");
    generateSeo.mutate({ title, content });
  };

  const handleSubmit = () => {
    if (!title.trim()) return toast.error("제목을 입력해주세요.");
    if (!content.trim()) return toast.error("내용을 입력해주세요.");

    const payload = {
      title,
      content,
      thumbnail: thumbnail ?? undefined,
      thumbnailAlt: thumbnailAlt || undefined,
      images: images.map(img => img.url), // 서버는 string[] 유지, alt는 별도 저장
      imageAlts: images.map(img => img.alt),
      tags: selectedTags,
      published: published ? ("published" as const) : ("draft" as const),
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords || undefined,
    };

    if (isEdit && postId) {
      updatePost.mutate({ id: postId, ...payload });
    } else {
      createPost.mutate(payload);
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
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
            onChange={e => setTitle(e.target.value)}
            placeholder="예: 이천 ○○빌라 계단청소 완료"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <Label className="mb-1 block">대표 사진 (썸네일)</Label>
          {thumbnail ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                <img
                  src={thumbnail}
                  alt={thumbnailAlt || "썸네일"}
                  className="h-40 rounded-lg object-cover"
                />
                <button
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailAlt("");
                  }}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* 썸네일 alt 편집 */}
              <div className="flex gap-2 items-center max-w-md">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Label className="text-xs text-gray-500">alt 태그</Label>
                    {generatingAlt === thumbnail && (
                      <span className="text-xs text-blue-500 animate-pulse">
                        AI 생성 중...
                      </span>
                    )}
                  </div>
                  <Input
                    value={thumbnailAlt}
                    onChange={e => setThumbnailAlt(e.target.value)}
                    placeholder="이미지 설명 (SEO용)"
                    className="text-sm h-8"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerateAlt(thumbnail, "thumbnail")}
                  disabled={generatingAlt === thumbnail}
                  className="mt-5 h-8 text-blue-600 border-blue-300 hover:bg-blue-50 text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  AI 재생성
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => thumbInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {uploading
                ? "업로드 중..."
                : "사진 선택 (업로드 시 alt 자동 생성)"}
            </button>
          )}
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
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
            onChange={e => setContent(e.target.value)}
            placeholder="작업 내용, 현장 상황, 사용한 세제 등을 자유롭게 작성해주세요."
            rows={10}
          />
        </div>

        {/* Extra images */}
        <div>
          <Label className="mb-1 block">추가 사진</Label>
          <div className="space-y-3 mb-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-gray-50 rounded-lg p-3"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    onClick={() =>
                      setImages(prev => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <Label className="text-xs text-gray-500">alt 태그</Label>
                    {generatingAlt === img.url && (
                      <span className="text-xs text-blue-500 animate-pulse">
                        AI 생성 중...
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={img.alt}
                      onChange={e =>
                        setImages(prev =>
                          prev.map((item, idx) =>
                            idx === i ? { ...item, alt: e.target.value } : item
                          )
                        )
                      }
                      placeholder="이미지 설명 (SEO용)"
                      className="text-sm h-8 flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateAlt(img.url, "image")}
                      disabled={generatingAlt === img.url}
                      className="h-8 text-blue-600 border-blue-300 hover:bg-blue-50 text-xs flex-shrink-0"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      AI 재생성
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => imgInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors w-full"
            >
              <Upload className="w-4 h-4" />
              {uploading
                ? "업로드 중..."
                : "사진 추가 (업로드 시 alt 자동 생성)"}
            </button>
          </div>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => {
              const files = Array.from(e.target.files ?? []);
              files.forEach(f => handleFileUpload(f, "image"));
              e.target.value = "";
            }}
          />
        </div>

        {/* Tags */}
        <div>
          <Label className="mb-2 block">태그</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(allTags ?? []).map(tag => (
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
                  onChange={e => {
                    setNewTagName(e.target.value);
                    setNewTagSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-가-힣]/g, "")
                    );
                  }}
                  placeholder="계단청소"
                  className="w-32"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">슬러그</Label>
                <Input
                  value={newTagSlug}
                  onChange={e => setNewTagSlug(e.target.value)}
                  placeholder="stair"
                  className="w-28"
                />
              </div>
              <Button
                size="sm"
                onClick={() =>
                  createTag.mutate({ name: newTagName, slug: newTagSlug })
                }
                disabled={!newTagName || !newTagSlug}
              >
                추가
              </Button>
            </div>
          )}
        </div>

        {/* SEO 자동 생성 패널 */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-sm text-gray-700">
                SEO 메타 태그
              </span>
              {seoTitle && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  설정됨
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleGenerateSeo}
                disabled={generateSeo.isPending}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs h-7"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {generateSeo.isPending ? "AI 생성 중..." : "AI 자동 생성"}
              </Button>
              <button
                type="button"
                onClick={() => setShowSeo(!showSeo)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showSeo ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {showSeo && (
            <div className="px-4 py-4 space-y-4 bg-white">
              <p className="text-xs text-gray-400">
                제목과 내용을 입력한 후 "AI 자동 생성" 버튼을 누르면 검색
                최적화된 메타 태그가 자동으로 작성됩니다.
              </p>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-gray-600">
                    SEO 제목 (검색 결과 제목)
                  </Label>
                  <span
                    className={`text-xs ${seoTitle.length > 60 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {seoTitle.length}/60자
                  </span>
                </div>
                <Input
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  placeholder="이천계단청소 전문 이천계단지기 | 빌라 계단청소 완료"
                  className="text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-gray-600">
                    SEO 설명 (검색 결과 스니펫)
                  </Label>
                  <span
                    className={`text-xs ${seoDescription.length > 80 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {seoDescription.length}/80자
                  </span>
                </div>
                <Textarea
                  value={seoDescription}
                  onChange={e => setSeoDescription(e.target.value)}
                  placeholder="이천 빌라 계단청소 전문 이천계단지기. 무료 방문 견적 가능합니다."
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  키워드 (쉼표로 구분)
                </Label>
                <Input
                  value={seoKeywords}
                  onChange={e => setSeoKeywords(e.target.value)}
                  placeholder="이천계단청소, 이천빌라청소, 이천계단지기, 계단청소업체"
                  className="text-sm"
                />
              </div>

              {(seoTitle || seoDescription) && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">
                    검색 결과 미리보기
                  </p>
                  <p className="text-blue-600 text-sm font-medium truncate">
                    {seoTitle || title}
                  </p>
                  <p className="text-green-700 text-xs">2000stair.click</p>
                  <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">
                    {seoDescription}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 이미지 압축 결과 요약 */}
        {compressResults.length > 0 && (
          <div className="border border-green-200 bg-green-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                이미지 최적화 결과
              </span>
            </div>
            <div className="space-y-1">
              {compressResults.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs text-green-700"
                >
                  <span>
                    {i + 1}번 이미지 (
                    {r.mimeType === "image/webp" ? "WebP" : "JPEG"} {r.width}×
                    {r.height}px)
                  </span>
                  <span className="font-medium">
                    {formatBytes(r.originalSize)} →{" "}
                    {formatBytes(r.optimizedSize)}
                    {r.compressionRate > 0 && (
                      <span className="ml-1 text-green-600 font-bold">
                        (-{r.compressionRate}%)
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-green-600 mt-2">
              총 절감:{" "}
              {formatBytes(
                compressResults.reduce(
                  (a, r) => a + r.originalSize - r.optimizedSize,
                  0
                )
              )}
            </p>
          </div>
        )}

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
