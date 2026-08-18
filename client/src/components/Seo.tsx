import { useEffect } from "react";

const DEFAULT_TITLE = "이천계단지기 | 이천 계단청소·유리창청소·사무실청소 전문";
const DEFAULT_DESCRIPTION =
  "이천계단지기. 이천 빌라·상가 계단청소, 유리·화장실 청소를 부부가 직접 관리합니다.";
const DEFAULT_KEYWORDS =
  "이천계단청소, 이천계단청소업체, 이천계단청소비용, 계단청소, 이천빌라청소, 사무실청소, 이천사무실청소, 유리창청소, 이천유리창청소, 이천청소, 계단청소업체, 계단청소비용, 이천청소업체, 정기청소, 계단청소구독, 빌라계단청소, 유리청소, 이천유리청소";
const DEFAULT_URL = "https://2000stair.kr/";
const DEFAULT_IMAGE = "https://2000stair.kr/images/og-image.webp";

export type SeoProps = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  image?: string;
  robots?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function getOrCreateMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
    document.head.appendChild(element);
  }

  return element;
}

function setMeta(selector: string, attributes: Record<string, string>, content: string) {
  getOrCreateMeta(selector, attributes).setAttribute("content", content);
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}

function setJsonLd(jsonLd?: Record<string, unknown> | Record<string, unknown>[]) {
  document.querySelectorAll('script[id^="route-seo-jsonld"]').forEach((el) => el.remove());

  if (!jsonLd) return;

  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  items.forEach((item, index) => {
    const script = document.createElement("script");
    script.id = index === 0 ? "route-seo-jsonld" : `route-seo-jsonld-${index}`;
    script.type = "application/ld+json";
    script.text = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

function applySeo({ title, description, canonical, keywords, image, robots, jsonLd }: SeoProps) {
  document.title = title;
  setMeta('meta[name="description"]', { name: "description" }, description);
  setMeta('meta[name="keywords"]', { name: "keywords" }, keywords ?? DEFAULT_KEYWORDS);
  setMeta('meta[name="robots"]', { name: "robots" }, robots ?? "index, follow");
  setMeta('meta[property="og:title"]', { property: "og:title" }, title);
  setMeta('meta[property="og:description"]', { property: "og:description" }, description);
  setMeta('meta[property="og:url"]', { property: "og:url" }, canonical);
  setMeta('meta[property="og:image"]', { property: "og:image" }, image ?? DEFAULT_IMAGE);
  setMeta('meta[property="og:image:type"]', { property: "og:image:type" }, "image/webp");
  setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
  setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
  setMeta('meta[name="twitter:image"]', { name: "twitter:image" }, image ?? DEFAULT_IMAGE);
  setCanonical(canonical);
  setJsonLd(jsonLd);
}

export default function Seo({ title, description, canonical, keywords, image, robots, jsonLd }: SeoProps) {
  useEffect(() => {
    applySeo({ title, description, canonical, keywords, image, robots, jsonLd });

    return () => {
      applySeo({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        canonical: DEFAULT_URL,
        keywords: DEFAULT_KEYWORDS,
        robots: "index, follow",
      });
      document.querySelectorAll('script[id^="route-seo-jsonld"]').forEach((el) => el.remove());
    };
  }, [title, description, canonical, keywords, image, robots, jsonLd]);

  return null;
}
