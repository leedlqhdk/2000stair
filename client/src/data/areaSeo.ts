import type { SeoProps } from "@/components/Seo";

const SITE_URL = "https://2000stair.kr";
const SERVICE_TYPES = ["계단청소", "빌라청소", "상가청소", "공용공간 정기관리", "유리청소", "화장실청소"];
const BASE_KEYWORDS = "이천계단청소, 계단청소, 빌라계단청소, 상가계단청소, 이천청소업체, 정기청소";

type AreaConfig = {
  slug: string;
  areaName: string;
  title: string;
  description: string;
  localities?: string[];
};

function areaJsonLd({ slug, areaName, title, description, localities = [areaName] }: AreaConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/area/${slug}#service`,
    name: title,
    description,
    url: `${SITE_URL}/area/${slug}`,
    provider: { "@id": `${SITE_URL}/#business` },
    serviceType: SERVICE_TYPES,
    areaServed: localities.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
  };
}

function areaSeo(config: AreaConfig): SeoProps {
  return {
    title: config.title,
    description: config.description,
    canonical: `${SITE_URL}/area/${config.slug}`,
    keywords: `${config.areaName} 계단청소, ${config.areaName} 빌라청소, ${config.areaName} 상가청소, ${BASE_KEYWORDS}`,
    jsonLd: areaJsonLd(config),
  };
}

export const seoByAreaSlug = {
  majang: areaSeo({
    slug: "majang",
    areaName: "마장면",
    title: "마장면 계단청소·빌라청소 | 이천계단지기",
    description:
      "마장면 빌라·원룸·상가 공용공간 계단청소, 공동현관, 복도, 유리청소 정기관리. 부부가 하청 없이 직접 관리합니다.",
    localities: ["마장면", "오천리", "양촌리", "장암리"],
  }),
  daewol: areaSeo({
    slug: "daewol",
    areaName: "대월면",
    title: "대월면 계단청소·상가 정기청소 | 이천계단지기",
    description:
      "대월면 빌라·상가·공용공간 계단청소와 유리·화장실 정기청소를 현장 상태에 맞춰 직접 관리합니다.",
    localities: ["대월면", "사동리", "초지리", "군량리"],
  }),
  sindun: areaSeo({
    slug: "sindun",
    areaName: "신둔면",
    title: "신둔면 계단청소·빌라 공용공간 관리 | 이천계단지기",
    description:
      "신둔면 빌라, 다세대, 상가의 계단·복도·공동현관 청소를 하청 없이 직접 정기관리합니다.",
    localities: ["신둔면", "수광리", "도암리", "남정리"],
  }),
  downtown: areaSeo({
    slug: "downtown",
    areaName: "이천 시내권",
    title: "이천 시내권 계단청소·상가청소 | 이천계단지기",
    description:
      "창전동·관고동·증포동·중리동 등 이천 시내권 빌라·상가 계단청소와 공용공간 정기관리를 직접 진행합니다.",
    localities: ["창전동", "관고동", "증포동", "중리동", "송정동"],
  }),
  bubal: areaSeo({
    slug: "bubal",
    areaName: "부발읍",
    title: "부발읍 계단청소·빌라청소 | 이천계단지기",
    description:
      "부발읍 빌라·상가·원룸 건물의 계단, 복도, 공동현관, 유리청소를 정기 방문으로 깔끔하게 관리합니다.",
    localities: ["부발읍", "아미리", "무촌리", "신하리"],
  }),
  baeksa: areaSeo({
    slug: "baeksa",
    areaName: "백사면",
    title: "백사면 계단청소·공용공간 정기관리 | 이천계단지기",
    description:
      "백사면 빌라·상가 공용공간의 계단, 복도, 현관, 유리청소를 건물 규모와 오염도에 맞춰 직접 관리합니다.",
    localities: ["백사면", "모전리", "조읍리", "현방리"],
  }),
} satisfies Record<string, SeoProps>;

const generalSeoByPath = {
  "/areas": {
    title: "이천 지역별 계단청소 가능 지역 | 이천계단지기",
    description:
      "마장면, 대월면, 신둔면, 부발읍, 백사면, 이천 시내권 계단청소·빌라청소 가능 지역을 확인하세요.",
    canonical: `${SITE_URL}/areas`,
    keywords: `이천 지역별 계단청소, 마장면 계단청소, 대월면 계단청소, 신둔면 계단청소, 부발읍 계단청소, 백사면 계단청소, ${BASE_KEYWORDS}`,
  },
  "/records": {
    title: "이천계단지기 청소 기록 | 계단청소 현장 사례",
    description:
      "이천계단지기의 빌라·상가 계단청소, 유리청소, 화장실청소 현장 기록과 관리 사례를 확인하세요.",
    canonical: `${SITE_URL}/records`,
    keywords: `이천계단청소 후기, 계단청소 기록, 청소 현장 사례, ${BASE_KEYWORDS}`,
  },
  "/blog": {
    title: "이천계단지기 청소 기록 | 계단청소 현장 사례",
    description:
      "이천계단지기의 빌라·상가 계단청소, 유리청소, 화장실청소 현장 기록과 관리 사례를 확인하세요.",
    canonical: `${SITE_URL}/blog`,
    keywords: `이천계단청소 후기, 계단청소 기록, 청소 현장 사례, ${BASE_KEYWORDS}`,
  },
  "/ops": {
    title: "운영 · 배포 상태 | 이천계단지기",
    description:
      "현재 배포 SHA, 브랜치, 최근 반영한 변경 로그를 외부에서 확인할 수 있는 운영 상태 페이지입니다.",
    canonical: `${SITE_URL}/ops`,
    keywords: "이천계단지기 운영 상태, 배포 sha, 변경 로그, 사이트 업데이트",
  },
} satisfies Record<string, SeoProps>;

export function getSeoForPath(path: string) {
  const normalizedPath = path.toLowerCase();
  const areaMatch = normalizedPath.match(/^\/area\/([^/?#]+)/);

  if (areaMatch) {
    return seoByAreaSlug[areaMatch[1] as keyof typeof seoByAreaSlug] ?? null;
  }

  return generalSeoByPath[normalizedPath as keyof typeof generalSeoByPath] ?? null;
}
