import { RESPONSIVE_IMAGES } from "@/data/responsiveImages";

/**
 * 원본 사진 경로를 넣으면 줄인 WebP 변형(480·1200px)과 원본을 후보로 담은 src/srcSet을 돌려준다.
 * 함께 넘기는 sizes(화면에 보이는 크기)에 맞춰 브라우저가 가장 가벼운 사진을 고른다.
 * 변형이 없는 사진(외부 주소, 작은 사진)은 원본 그대로 쓴다.
 */
export function responsiveImage(src: string | undefined): { src: string | undefined; srcSet?: string } {
  if (!src) return { src };
  const entry = RESPONSIVE_IMAGES[src];
  if (!entry) return { src };

  const [originalWidth, widths] = entry;
  const base = `/images/opt/${src.replace(/^\/images\//, "").replace(/\.[a-z0-9]+$/i, "")}`;
  const candidates = widths.map((width) => `${base}-${width}.webp ${width}w`);
  candidates.push(`${src} ${originalWidth}w`);
  return { src: `${base}-${widths[widths.length - 1]}.webp`, srcSet: candidates.join(", ") };
}
