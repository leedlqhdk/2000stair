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

type ServiceConfig = {
  slug: string;
  name: string;
  description: string;
  serviceType: string | string[];
};

function serviceJsonLd({ slug, name, description, serviceType }: ServiceConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${slug}#service`,
    name,
    description,
    url: `${SITE_URL}/services/${slug}`,
    provider: { "@id": `${SITE_URL}/#business` },
    serviceType,
    areaServed: { "@type": "City", name: "이천시" },
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
  gonjiam: areaSeo({
    slug: "gonjiam",
    areaName: "곤지암",
    title: "곤지암 계단청소·공용공간 정기관리 | 이천계단지기",
    description:
      "곤지암 빌라·상가 공용공간의 계단, 복도, 공동현관, 유리청소 상담을 현장 사진과 주소 확인 후 안내드립니다.",
    localities: ["곤지암", "곤지암읍"],
  }),
} satisfies Record<string, SeoProps>;

export const generalSeoByPath = {
  "/about": {
    title: "부부가 직접 관리하는 이천 계단청소 업체 | 이천계단지기",
    description:
      "이천계단지기는 하청 없이 부부가 직접 빌라·상가 계단, 유리, 화장실 공용공간을 정기관리하는 이천 지역 청소 업체입니다. 같은 담당자가 꾸준히 관리하고 작업 전후 사진으로 결과를 확인하실 수 있습니다.",
    canonical: `${SITE_URL}/about`,
    keywords: `이천계단청소 업체, 부부 직영 청소업체, 이천계단지기 소개, ${BASE_KEYWORDS}`,
  },
  "/qna": {
    title: "이천 계단청소 비용·견적·정기관리 자주 묻는 질문 | 이천계단지기",
    description:
      "계단청소 비용, 견적 받는 방법, 월 2회·4회 정기관리 주기, 세금계산서 발행, 유리청소·화장실청소 포함 여부 등 이천계단지기에 자주 문의하시는 질문과 답변을 안내합니다.",
    canonical: `${SITE_URL}/qna`,
    keywords: `이천계단청소 비용, 계단청소 견적, 계단청소 자주묻는질문, ${BASE_KEYWORDS}`,
  },
  "/services": {
    title: "이천 계단청소·유리청소·화장실청소 서비스 안내 | 이천계단지기",
    description:
      "이천계단지기의 계단정기청소, 유리청소, 화장실청소 서비스를 한눈에 확인하세요. 빌라·상가·원룸 공용공간을 부부가 직접 방문해 정기관리합니다.",
    canonical: `${SITE_URL}/services`,
    keywords: `이천 청소 서비스, 계단청소 서비스, 유리청소 서비스, 화장실청소 서비스, ${BASE_KEYWORDS}`,
  },
  "/services/stair": {
    title: "이천 계단청소 전문업체 | 빌라·상가 정기관리 – 이천계단지기",
    description:
      "빌라·원룸·상가 계단 바닥, 난간·손잡이, 공동현관 유리, 거미줄 제거까지 월 2회·4회 정기관리합니다. 월 44,000원부터 현장 확인 후 견적을 안내드립니다.",
    canonical: `${SITE_URL}/services/stair`,
    keywords: `이천 계단청소, 계단정기청소, 빌라계단청소, 상가계단청소, 계단청소 비용, ${BASE_KEYWORDS}`,
    jsonLd: serviceJsonLd({
      slug: "stair",
      name: "계단청소 정기관리",
      description:
        "빌라·원룸·상가 계단 바닥, 난간·손잡이, 공동현관 유리, 거미줄 제거까지 월 2회·4회 정기관리합니다.",
      serviceType: ["계단청소", "계단정기청소", "빌라계단청소", "상가계단청소"],
    }),
  },
  "/services/glass": {
    title: "이천 유리청소 전문업체 | 상가·건물 유리관리 – 이천계단지기",
    description:
      "상가 출입문·전면 유리, 공동현관 유리, 얼룩·석회자국까지 이천계단지기가 직접 관리합니다. 계단청소와 함께 정기관리하면 더욱 효율적입니다.",
    canonical: `${SITE_URL}/services/glass`,
    keywords: `이천 유리청소, 상가 유리청소, 공동현관 유리청소, 건물 유리관리, ${BASE_KEYWORDS}`,
    jsonLd: serviceJsonLd({
      slug: "glass",
      name: "유리청소",
      description:
        "상가 출입문·전면 유리, 공동현관 유리, 얼룩·석회자국 제거를 정기 또는 일회성으로 관리합니다.",
      serviceType: ["유리청소", "상가 유리청소", "공동현관 유리청소"],
    }),
  },
  "/services/bathroom": {
    title: "이천 화장실청소 전문업체 | 공용화장실 정기관리 – 이천계단지기",
    description:
      "상가·사무실 공용화장실을 전문 약품과 장비로 위생 관리합니다. 정기 방문으로 세균과 악취 걱정 없이 항상 청결한 상태를 유지합니다.",
    canonical: `${SITE_URL}/services/bathroom`,
    keywords: `이천 화장실청소, 공용화장실 청소, 상가 화장실청소, 사무실 화장실청소, ${BASE_KEYWORDS}`,
    jsonLd: serviceJsonLd({
      slug: "bathroom",
      name: "화장실청소 정기관리",
      description:
        "상가·사무실 공용화장실을 전문 약품과 장비로 월 2회·4회 정기 방문해 위생 관리합니다.",
      serviceType: ["화장실청소", "공용화장실 청소", "상가 화장실청소"],
    }),
  },
  "/services/office": {
    title: "이천 사무실·상가 정기청소 | 이천계단지기",
    description:
      "이천 소규모 사무실과 상가의 바닥, 책상 주변, 화장실, 유리창까지 정기적으로 청소합니다. 업무 시간 전후로 방문 일정을 조정해드립니다.",
    canonical: `${SITE_URL}/services/office`,
    keywords: `이천 사무실청소, 상가청소, 사무실 정기청소, ${BASE_KEYWORDS}`,
    jsonLd: serviceJsonLd({
      slug: "office",
      name: "사무실·상가 정기청소",
      description:
        "이천 소규모 사무실과 상가의 바닥, 책상 주변, 화장실, 유리창까지 정기적으로 청소합니다.",
      serviceType: ["사무실청소", "상가청소", "사무실 정기청소"],
    }),
  },
  "/reviews": {
    title: "이천계단지기 고객 후기 | 실제 청소 후기 모음",
    description:
      "네이버, 당근, 숨고에서 받은 이천계단지기의 실제 계단청소·유리청소·화장실청소 고객 후기를 확인하세요.",
    canonical: `${SITE_URL}/reviews`,
    keywords: `이천계단청소 후기, 이천청소업체 후기, ${BASE_KEYWORDS}`,
  },
  "/guide": {
    title: "빌라 계단 관리정보 | 이천계단지기 청소 가이드",
    description:
      "계단 냄새, 미끄럼, 먼지 등 빌라·상가 공용공간에서 자주 발생하는 문제와 관리 방법을 이천계단지기가 정리해드립니다.",
    canonical: `${SITE_URL}/guide`,
    keywords: `빌라 계단관리, 계단 냄새 제거, 계단 먼지 관리, ${BASE_KEYWORDS}`,
  },
  "/areas": {
    title: "이천 지역별 계단청소 가능 지역 | 이천계단지기",
    description:
      "마장면, 대월면, 신둔면, 부발읍, 백사면, 곤지암, 이천 시내권 계단청소·빌라청소 가능 지역을 확인하세요.",
    canonical: `${SITE_URL}/areas`,
    keywords: `이천 지역별 계단청소, 마장면 계단청소, 대월면 계단청소, 신둔면 계단청소, 부발읍 계단청소, 백사면 계단청소, 곤지암 계단청소, ${BASE_KEYWORDS}`,
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
