/**
 * 이미지 최적화 유틸리티
 * - Canvas API로 리사이즈
 * - WebP 지원 브라우저는 WebP로 변환, 미지원 시 JPEG 사용
 * - 최대 너비/높이 제한 및 품질 조절
 */

export interface OptimizeOptions {
  /** 최대 너비 (px). 기본값: 1920 */
  maxWidth?: number;
  /** 최대 높이 (px). 기본값: 1080 */
  maxHeight?: number;
  /** 썸네일용 최대 크기 (px). 기본값: 800 */
  thumbnailMaxSize?: number;
  /** 압축 품질 0~1. 기본값: 0.82 */
  quality?: number;
  /** 썸네일 여부 */
  isThumbnail?: boolean;
}

export interface OptimizeResult {
  /** 최적화된 이미지 base64 (data: prefix 없음) */
  base64: string;
  /** 최종 MIME 타입 */
  mimeType: string;
  /** 원본 크기 (bytes) */
  originalSize: number;
  /** 최적화 후 크기 (bytes) */
  optimizedSize: number;
  /** 압축률 (%) */
  compressionRate: number;
  /** 최종 너비 */
  width: number;
  /** 최종 높이 */
  height: number;
}

/** 브라우저가 WebP 인코딩을 지원하는지 확인 */
function supportsWebP(): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

/** File → HTMLImageElement 로드 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지 로드 실패"));
    };
    img.src = url;
  });
}

/** 비율을 유지하면서 최대 크기 안으로 축소 */
function calcDimensions(
  srcW: number,
  srcH: number,
  maxW: number,
  maxH: number
): { w: number; h: number } {
  if (srcW <= maxW && srcH <= maxH) return { w: srcW, h: srcH };
  const ratio = Math.min(maxW / srcW, maxH / srcH);
  return { w: Math.round(srcW * ratio), h: Math.round(srcH * ratio) };
}

/**
 * 이미지 파일을 최적화하여 base64 문자열로 반환
 */
export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizeResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    thumbnailMaxSize = 800,
    quality = 0.82,
    isThumbnail = false,
  } = options;

  const originalSize = file.size;

  // GIF는 압축 건너뜀 (애니메이션 보존)
  if (file.type === "image/gif") {
    const base64 = await fileToBase64Raw(file);
    return {
      base64,
      mimeType: "image/gif",
      originalSize,
      optimizedSize: originalSize,
      compressionRate: 0,
      width: 0,
      height: 0,
    };
  }

  const img = await loadImage(file);
  const mW = isThumbnail ? thumbnailMaxSize : maxWidth;
  const mH = isThumbnail ? thumbnailMaxSize : maxHeight;
  const { w, h } = calcDimensions(img.naturalWidth, img.naturalHeight, mW, mH);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // 고품질 렌더링
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);

  const outputMime = supportsWebP() ? "image/webp" : "image/jpeg";
  const dataUrl = canvas.toDataURL(outputMime, quality);
  const base64 = dataUrl.split(",")[1];
  const optimizedSize = Math.round((base64.length * 3) / 4);
  const compressionRate = Math.round((1 - optimizedSize / originalSize) * 100);

  return {
    base64,
    mimeType: outputMime,
    originalSize,
    optimizedSize,
    compressionRate: Math.max(0, compressionRate),
    width: w,
    height: h,
  };
}

/** File → base64 (data: prefix 없음) */
function fileToBase64Raw(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** 바이트를 사람이 읽기 좋은 문자열로 변환 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
