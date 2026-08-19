import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generalSeoByPath, getSeoForPath, seoByAreaSlug } from "../client/src/data/areaSeo";
import { daewolPosts } from "../client/src/data/areas/daewol";
import { downtownPosts } from "../client/src/data/areas/downtown";
import { majangPosts } from "../client/src/data/areas/majang";
import type { AreaPost } from "../client/src/hooks/useAreaPosts";
import { getWorkSeo } from "../client/src/lib/workSeo";
import { getWorkSlug } from "../client/src/lib/workSlug";

const SITE_URL = "https://2000stair.kr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.resolve(__dirname, "../dist/public");
const indexHtmlPath = path.join(distPublic, "index.html");
// 최종 /sitemap.xml은 api/sitemap.ts가 이 베이스에 DB 정보글을 합쳐 동적으로 응답한다
const sitemapPath = path.join(distPublic, "sitemap-base.xml");

const routes = [
  ...Object.keys(generalSeoByPath),
  ...Object.keys(seoByAreaSlug).map((slug) => `/area/${slug}`),
];

const fallbackWorkPosts: AreaPost[] = [
  ...majangPosts.map((post) => ({ ...post, area: "majang" })),
  ...daewolPosts.map((post) => ({ ...post, area: "daewol" })),
  ...downtownPosts,
];

// --- Notion area-posts fetch (mirrors api/area-posts.ts, kept self-contained) ---

type NotionFile = {
  external?: { url?: string };
  file?: { url?: string };
};

type NotionProperty = {
  title?: Array<{ plain_text?: string }>;
  rich_text?: Array<{ plain_text?: string }>;
  select?: { name?: string } | null;
  status?: { name?: string } | null;
  multi_select?: Array<{ name?: string }>;
  date?: { start?: string | null } | null;
  files?: NotionFile[];
  url?: string | null;
  checkbox?: boolean;
};

type NotionPage = {
  id: string;
  properties: Record<string, NotionProperty | undefined>;
};

const PROPERTY_NAMES = {
  title: ["제목", "작업명", "이름", "Name", "Title"],
  description: ["설명", "특이사항", "내용", "메모", "한줄설명", "Description", "Content", "Memo"],
  area: ["지역", "관리지역", "Area", "Region"],
  date: ["작업일", "날짜", "Date", "Work Date"],
  image: ["사진링크", "사진URL", "사진", "대표사진", "작업사진", "Image", "Images", "Photo"],
  buildingType: ["건물 유형", "건물유형", "건물", "현장유형", "Building Type", "Building"],
  workScope: ["작업 내용", "작업내용", "관리범위", "작업범위", "범위", "Work Scope", "Scope"],
  workType: ["작업 형태", "작업형태", "관리형태", "청소형태", "Work Type", "Type"],
  blogUrl: ["블로그링크", "블로그 링크", "블로그URL", "블로그 URL", "Blog URL", "Blog"],
  blogButtonLabel: ["블로그버튼문구", "블로그 버튼 문구", "버튼문구", "Blog Button Label"],
  published: ["공개", "게시", "공개여부", "Published", "Public"],
} as const;

const AREA_LABELS: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  downtown: "시내권",
  gwango: "관고동",
  changjeon: "창전동",
  jungni: "중리동",
  jeungpo: "증포동",
  bubal: "부발읍",
  baeksa: "백사면",
  gonjiam: "곤지암읍 인근",
};

const AREA_STATIC_DETAILS: Record<string, { intro: string; scopes: string[]; checks: string[] }> = {
  majang: {
    intro: "마장면 빌라·원룸·상가 공용공간을 부부가 직접 관리합니다. 오천리, 양촌리, 장암리, 덕평리 등은 주소와 사진을 먼저 확인한 뒤 방문 가능 여부와 관리 주기를 안내합니다.",
    scopes: ["계단 바닥과 모서리 먼지", "원룸·빌라 복도 오염", "공동현관 유리와 손자국", "난간·손잡이", "출입구 주변 거미줄"],
    checks: ["마장면 주소 확인", "건물 층수와 공용부 범위 확인", "초도청소 후 청소 전후 사진 제공", "정기관리 주기 상담"],
  },
  daewol: {
    intro: "대월면 빌라·상가·원룸 공용공간을 현장 상태에 맞춰 관리합니다. 사동리, 초지리, 군량리, 장평리 주변은 계단과 창틀, 공동현관 상태를 함께 확인합니다.",
    scopes: ["계단 바닥", "난간과 손잡이", "창틀 먼지", "공동현관 유리", "복도 모서리와 거미줄"],
    checks: ["대월면 방문 가능 여부 확인", "4층 이상 빌라 공용부 범위 확인", "계단·창틀·공동현관 초도청소", "정기관리 계약 전 상담"],
  },
  sindun: {
    intro: "신둔면 빌라·다세대·상가 공용공간을 정기관리합니다. 수광리, 도암리, 남정리, 지석리 등은 이동 동선과 현장 사진을 기준으로 상담합니다.",
    scopes: ["빌라 계단 바닥", "공동현관 출입부", "복도 먼지", "난간·창틀", "외부 먼지 유입 구간"],
    checks: ["신둔면 주소 확인", "방문 동선과 일정 확인", "정기청소 가능 주기 안내", "작업 후 사진 공유"],
  },
  gwango: {
    intro: "관고동 상가·빌라·소형 건물 공용공간을 관리합니다. 관고시장, 설봉공원 인근처럼 방문객이 오가는 구역은 출입구와 공동현관 첫인상을 우선 확인합니다.",
    scopes: ["상가 출입구", "공동현관 유리", "계단 난간", "복도 바닥", "화장실 포함 여부"],
    checks: ["관고동 현장 사진 확인", "상가·빌라 공용부 범위 구분", "초도청소 후 청소 전후 사진 제공", "사업자 증빙 상담"],
  },
  changjeon: {
    intro: "창전동 빌라·원룸·상가주택 공용공간을 정기 방문 기준으로 상담합니다. 입주민 이동이 잦은 계단과 복도, 공동현관 관리 주기를 먼저 정리합니다.",
    scopes: ["빌라 계단", "원룸 복도", "공동현관 바닥", "출입문 유리", "상가주택 공용부"],
    checks: ["창전동 건물 위치 확인", "입주민 이동 동선 확인", "월 2회·4회 관리 주기 상담", "작업 범위와 계약 조건 안내"],
  },
  jungni: {
    intro: "중리동 빌라·상가 공용부를 사진 기준으로 확인하며 관리합니다. 건물주가 현장에 자주 오기 어려운 경우에도 초도청소 후 청소 전후 사진 제공으로 관리 상태를 공유합니다.",
    scopes: ["공용계단", "복도와 현관", "출입부 바닥", "공동현관 유리", "난간·손잡이"],
    checks: ["중리동과 인접 생활권 확인", "비대면 사진 상담", "정기관리 범위 정리", "작업 후 상태 공유"],
  },
  jeungpo: {
    intro: "증포동·안흥동·갈산동·송정동 일대 빌라·원룸·상가주택 공용공간을 상담합니다. 주거 밀집 구역은 입주민이 매일 보는 계단, 복도, 공동현관 중심으로 관리합니다.",
    scopes: ["빌라·원룸 계단", "공동현관 바닥", "복도 먼지", "출입문 유리", "난간과 모서리"],
    checks: ["증포동 권역 주소 확인", "안흥동·갈산동 인근 상담", "정기관리 주기 안내", "초도청소 후 청소 전후 사진 제공"],
  },
  bubal: {
    intro: "부발읍 빌라·상가·원룸 건물의 계단과 공동현관을 정기관리합니다. 아미리, 무촌리, 신하리 생활권은 상가 공용부와 주거지 공용부를 나눠 확인합니다.",
    scopes: ["상가 출입부", "빌라 공용계단", "공동현관 유리", "복도 바닥", "화장실 포함 여부"],
    checks: ["부발읍 주소 확인", "상가·주거 공용부 구분", "유리·화장실 포함 상담", "정기 방문 주기 안내"],
  },
  baeksa: {
    intro: "백사면 빌라·상가 공용공간은 건물 위치와 외부 먼지 유입 정도를 함께 확인합니다. 모전리, 조읍리, 현방리 주변은 계단과 현관 상태를 기준으로 상담합니다.",
    scopes: ["외부 먼지 유입 구간", "계단 바닥", "공동현관", "난간·손잡이", "복도 모서리"],
    checks: ["백사면 방문 가능 여부 확인", "건물 주변 오염 요인 확인", "필요한 관리 범위 정리", "작업 기록 순차 안내"],
  },
  gonjiam: {
    intro: "곤지암읍 인근은 전 지역이 아니라 신둔면과 가까운 구역 중심으로 방문 가능 여부를 확인합니다. 주소와 사진을 먼저 보고 이동 동선과 작업 범위를 안내합니다.",
    scopes: ["계단·복도 상태", "공동현관 출입부", "유리 포함 여부", "방문 가능 동선", "정기관리 적합 여부"],
    checks: ["곤지암읍 인접 지역 주소 확인", "신둔면 방향 동선 확인", "현장 사진 기준 상담", "가능 범위 우선 안내"],
  },
};

function getProperty(properties: Record<string, NotionProperty | undefined>, names: readonly string[]) {
  return names.map((name) => properties[name]).find(Boolean);
}

function propertyToText(property: NotionProperty | undefined) {
  if (!property) return "";

  if (property.title) return property.title.map((text) => text.plain_text ?? "").join("").trim();
  if (property.rich_text) return property.rich_text.map((text) => text.plain_text ?? "").join("").trim();
  if (property.select?.name) return property.select.name;
  if (property.status?.name) return property.status.name;
  if (property.multi_select) return property.multi_select.map((item) => item.name ?? "").filter(Boolean).join(", ");
  if (property.date?.start) return property.date.start;
  if (property.url) return property.url;
  if (property.checkbox !== undefined) return property.checkbox ? "true" : "false";

  return "";
}

function propertyToImages(property: NotionProperty | undefined) {
  if (!property) return [];

  const fileUrls = property.files
    ?.map((file) => file.external?.url || file.file?.url)
    .filter((url): url is string => Boolean(url)) ?? [];

  if (fileUrls.length > 0) return fileUrls;
  if (property.url) return [property.url];

  return [];
}

function getImages(properties: Record<string, NotionProperty | undefined>) {
  for (const name of PROPERTY_NAMES.image) {
    const images = propertyToImages(properties[name]);
    if (images.length > 0) return images;
  }

  return [];
}

function normalizeArea(value: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, "");

  if (["majang", "마장", "마장면"].some((keyword) => normalized.includes(keyword))) return "majang";
  if (["daewol", "대월", "대월면"].some((keyword) => normalized.includes(keyword))) return "daewol";
  if (["sindun", "신둔", "신둔면"].some((keyword) => normalized.includes(keyword))) return "sindun";
  if (["bubal", "부발", "부발읍"].some((keyword) => normalized.includes(keyword))) return "bubal";
  if (["baeksa", "백사", "백사면"].some((keyword) => normalized.includes(keyword))) return "baeksa";
  if (["gonjiam", "곤지암", "곤지암읍"].some((keyword) => normalized.includes(keyword))) return "gonjiam";
  if (["gwango", "관고", "관고동", "사음", "사음동"].some((keyword) => normalized.includes(keyword))) return "gwango";
  if (["changjeon", "창전", "창전동"].some((keyword) => normalized.includes(keyword))) return "changjeon";
  if (["jungni", "중리", "중리동", "songjeong", "송정", "송정동"].some((keyword) => normalized.includes(keyword))) return "jungni";
  if (["jeungpo", "증포", "증포동", "갈산", "갈산동", "안흥", "안흥동"].some((keyword) => normalized.includes(keyword))) return "jeungpo";
  if (["downtown", "시내", "시내권"].some((keyword) => normalized.includes(keyword))) return "downtown";

  return normalized;
}

function formatDate(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replace(/-/g, ".");

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function isPublished(properties: Record<string, NotionProperty | undefined>) {
  const property = getProperty(properties, PROPERTY_NAMES.published);
  if (!property) return true;

  if (property.checkbox !== undefined) return property.checkbox;

  const value = propertyToText(property).toLowerCase();
  return !["false", "비공개", "draft", "hidden", "no", "0"].includes(value);
}

function parsePage(page: NotionPage): AreaPost | null {
  const title = propertyToText(getProperty(page.properties, PROPERTY_NAMES.title));
  const description = propertyToText(getProperty(page.properties, PROPERTY_NAMES.description));
  const areaText = propertyToText(getProperty(page.properties, PROPERTY_NAMES.area));
  const date = propertyToText(getProperty(page.properties, PROPERTY_NAMES.date));
  const images = getImages(page.properties);
  const area = normalizeArea(areaText);
  const buildingType = propertyToText(getProperty(page.properties, PROPERTY_NAMES.buildingType));
  const workScope = propertyToText(getProperty(page.properties, PROPERTY_NAMES.workScope));
  const workType = propertyToText(getProperty(page.properties, PROPERTY_NAMES.workType));
  const blogUrl = propertyToText(getProperty(page.properties, PROPERTY_NAMES.blogUrl));
  const blogButtonLabel = propertyToText(getProperty(page.properties, PROPERTY_NAMES.blogButtonLabel));

  if (!area || images.length === 0 || !isPublished(page.properties)) return null;

  return {
    id: page.id,
    title: title || `${AREA_LABELS[area] ?? areaText} 작업 기록`,
    description,
    area,
    date: formatDate(date),
    image: images[0],
    images,
    buildingType,
    workScope,
    workType,
    blogUrl,
    blogButtonLabel,
  };
}

async function fetchWorkPosts(): Promise<AreaPost[]> {
  const token = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_AREA_DATABASE_ID;

  if (!token || !databaseId) return fallbackWorkPosts;

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({ page_size: 100 }),
    });

    if (!response.ok) {
      console.warn("prerender-seo: Notion request failed", response.status, await response.text());
      return fallbackWorkPosts;
    }

    const data = (await response.json()) as { results?: NotionPage[] };
    const posts = (data.results ?? [])
      .map(parsePage)
      .filter((post): post is AreaPost => Boolean(post));

    return posts.length > 0 ? posts : fallbackWorkPosts;
  } catch (error) {
    console.warn("prerender-seo: Notion fetch failed, using fallback posts", error);
    return fallbackWorkPosts;
  }
}

// --- HTML helpers ---

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXml(value: string) {
  return escapeHtml(value);
}

function escapeJsonForScriptTag(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function replaceOrThrow(html: string, pattern: RegExp, replacement: string, label: string) {
  if (!pattern.test(html)) {
    throw new Error(`prerender-seo: pattern not found for ${label}`);
  }

  return html.replace(pattern, () => replacement);
}

type StaticSeo = NonNullable<ReturnType<typeof getSeoForPath>>;

type StaticBodyContext = {
  route: string;
  workPost?: AreaPost;
  workPosts: AreaPost[];
};

function paragraph(value: string) {
  return `<p>${escapeHtml(value)}</p>`;
}

function list(items: string[]) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function linkList(items: Array<{ href: string; label: string }>) {
  return `<ul>${items
    .map(({ href, label }) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`)
    .join("")}</ul>`;
}

function section(title: string, body: string) {
  return `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function getAreaPosts(area: string, posts: AreaPost[]) {
  return posts.filter((post) => post.area === area).slice(0, 6);
}

function getPostListLabel(post: AreaPost) {
  const extras = [post.buildingType, post.workType, post.workScope]
    .filter((value): value is string => Boolean(value?.trim()))
    .filter((value) => !post.title.includes(value));
  const detail = [post.title, ...extras.slice(0, 2)].join(" - ");
  return `${post.date ? `${post.date} ` : ""}${detail}`;
}

function getAreaPrefixedWorkLabel(post: AreaPost) {
  const areaName = AREA_LABELS[post.area] ?? post.area;
  return post.title.startsWith(areaName) ? post.title : `${areaName} ${post.title}`;
}

function getAreaStaticSections(area: string, posts: AreaPost[]) {
  const areaName = AREA_LABELS[area] ?? area;
  const detail = AREA_STATIC_DETAILS[area] ?? {
    intro: `${areaName} 빌라·원룸·상가 공용공간을 주소와 사진 기준으로 확인하고 관리 범위를 안내합니다.`,
    scopes: ["계단 바닥", "난간·손잡이", "공동현관", "복도", "유리 포함 여부"],
    checks: ["주소 확인", "현장 사진 확인", "정기관리 주기 상담", "작업 후 상태 공유"],
  };
  const areaPosts = getAreaPosts(area, posts);
  const workItems = areaPosts.map((post) => ({
    href: `/work/${getWorkSlug(post)}`,
    label: getPostListLabel(post),
  }));
  const primaryWorkLink = workItems[0]
    ? [{ href: workItems[0].href, label: `${areaName} 실제 작업사례 보기` }]
    : [];

  return [
    section(
      `${areaName} 계단청소`,
      paragraph(detail.intro)
    ),
    section(
      `최근 ${areaName} 작업`,
      workItems.length > 0
        ? linkList(workItems)
        : paragraph(`${areaName} 작업 기록은 현장 사진 정리 후 순서대로 추가합니다.`)
    ),
    section(
      "주요 관리범위",
      list(detail.scopes)
    ),
    section(
      `${areaName} 상담 기준`,
      list(detail.checks)
    ),
    section(
      `${areaName} 내부 연결`,
      linkList([
        ...primaryWorkLink,
        { href: "/services/stair", label: "계단청소 범위·주기·비용 안내" },
        { href: "/records", label: "이천계단지기 작업 기록 보기" },
        { href: "/areas", label: "다른 이천 관리 가능 지역 보기" },
      ])
    ),
  ].join("");
}

function getGeneralStaticSections(route: string, posts: AreaPost[]) {
  const recentWorkItems = posts.slice(0, 6).map((post) => ({
    href: `/work/${getWorkSlug(post)}`,
    label: getAreaPrefixedWorkLabel(post),
  }));

  if (route === "/") {
    return [
      section(
        "이천 계단청소 상담 기준",
        paragraph(
          "이천 계단청소를 중심으로 빌라·상가·원룸의 계단, 복도, 공동현관을 하청 없이 직접 관리합니다. 주소와 사진을 기준으로 방문 가능 여부와 정기관리 주기를 안내합니다."
        )
      ),
      section(
        "주요 서비스",
        list(["계단·복도·공동현관 정기관리", "상가 유리와 공용화장실 관리", "초도청소 후 청소 전후 사진 제공", "세금계산서와 계약 기준 상담"])
      ),
      section(
        "서비스 안내",
        linkList([
          { href: "/services/stair", label: "계단청소 범위·주기·비용" },
          { href: "/services/glass", label: "유리청소 안내" },
          { href: "/services/bathroom", label: "화장실청소 안내" },
          { href: "/services/office", label: "사무실·상가 정기청소 안내" },
        ])
      ),
      section(
        "지역별 안내",
        linkList([
          { href: "/areas", label: "이천 지역별 관리 가능 지역" },
          { href: "/area/sindun", label: "신둔면 계단청소" },
          { href: "/area/majang", label: "마장면 계단청소" },
          { href: "/area/jeungpo", label: "증포동 계단청소" },
        ])
      ),
      section(
        "실제 작업일지",
        recentWorkItems.length > 0 ? linkList(recentWorkItems.slice(0, 4)) : paragraph("지역별 작업 사례를 순서대로 정리하고 있습니다.")
      ),
    ].join("");
  }

  if (route === "/about") {
    return [
      section(
        "부부 직영 관리 방식",
        paragraph(
          "이천계단지기는 상담, 현장 확인, 작업, 피드백까지 같은 담당자가 이어서 관리합니다. 현장 상태를 직접 보고 필요한 범위만 안내하는 것을 원칙으로 합니다."
        )
      ),
      section(
        "신뢰 기준",
        list(["하청 없는 직접 관리", "초도청소 후 청소 전후 사진 제공", "사업자 증빙과 계약 기준 상담", "주소와 현장 상태 기준 견적 안내"])
      ),
      section(
        "함께 확인할 페이지",
        linkList([
          { href: "/services/stair", label: "계단청소 관리방법 보기" },
          { href: "/records", label: "실제 작업 기록 보기" },
          { href: "/qna", label: "자주 묻는 질문 보기" },
        ])
      ),
    ].join("");
  }

  if (route === "/services/stair") {
    return [
      section(
        "계단청소 관리 범위",
        list(["계단 바닥과 모서리 먼지 관리", "난간·손잡이·창틀 관리", "공동현관 유리와 출입부 관리", "거미줄과 복도 오염 확인"])
      ),
      section(
        "정기관리 주기와 비용 기준",
        paragraph(
          "월 2회 또는 월 4회 방문을 기본으로 상담하며, 층수·오염도·공용부 범위에 따라 현장 확인 후 비용을 안내합니다."
        )
      ),
      section(
        "관련 작업 사례",
        recentWorkItems.length > 0 ? linkList(recentWorkItems) : paragraph("작업 사례는 지역과 현장 상태별로 정리해 안내합니다.")
      ),
      section(
        "지역별 계단청소 안내",
        linkList([
          { href: "/areas", label: "이천 관리 가능 지역 보기" },
          { href: "/area/sindun", label: "신둔면 계단청소 안내" },
          { href: "/area/majang", label: "마장면 계단청소 안내" },
          { href: "/area/daewol", label: "대월면 계단청소 안내" },
        ])
      ),
    ].join("");
  }

  if (route === "/services") {
    return [
      section(
        "서비스 구성",
        list(["계단청소 정기관리", "상가·공동현관 유리청소", "공용화장실 위생관리", "소형 사무실·상가 정기청소"])
      ),
      section(
        "서비스별 상세 안내",
        linkList([
          { href: "/services/stair", label: "계단청소 범위·주기·비용" },
          { href: "/services/glass", label: "유리청소 안내" },
          { href: "/services/bathroom", label: "화장실청소 안내" },
          { href: "/services/office", label: "사무실·상가 정기청소 안내" },
          { href: "/records", label: "실제 작업일지 보기" },
        ])
      ),
    ].join("");
  }

  if (route === "/services/glass") {
    return section(
      "유리청소 상담 범위",
      list(["상가 출입문과 전면 유리", "공동현관 유리", "손자국·먼지·부분 얼룩 관리", "계단청소와 함께 정기관리 상담 가능"])
    );
  }

  if (route === "/services/bathroom") {
    return section(
      "화장실청소 상담 범위",
      list(["상가·사무실 공용화장실", "세면대·변기·바닥 위생관리", "악취와 물때 상태 확인", "정기 방문 주기 상담"])
    );
  }

  if (route === "/services/office") {
    return section(
      "사무실·상가 정기청소 상담 범위",
      list(["소형 사무실 바닥과 책상 주변", "상가 공용부와 출입부", "화장실·유리 포함 여부 상담", "업무 시간 전후 방문 일정 조율"])
    );
  }

  if (route === "/areas") {
    return [
      section(
        "이천 관리 가능 지역",
        linkList(Object.entries(AREA_LABELS)
          .filter(([slug]) => slug !== "downtown")
          .map(([slug, label]) => ({ href: `/area/${slug}`, label: `${label} 계단청소 안내` })))
      ),
      section(
        "지역 확인 방식",
        paragraph("정확한 방문 가능 여부는 주소와 건물 사진을 기준으로 확인하며, 인접 지역은 이동 동선과 작업 범위를 함께 보고 안내합니다.")
      ),
    ].join("");
  }

  if (route === "/records") {
    return [
      section(
        "작업 기록 확인",
        paragraph("이천계단지기가 직접 관리한 빌라·상가 공용공간 작업 사례를 지역과 날짜 기준으로 확인할 수 있습니다.")
      ),
      section(
        "최근 작업 사례",
        recentWorkItems.length > 0 ? linkList(recentWorkItems) : paragraph("작업 사례를 순차적으로 정리하고 있습니다.")
      ),
    ].join("");
  }

  if (route === "/qna") {
    return section(
      "자주 묻는 상담 내용",
      list(["세금계산서 발행 가능 여부", "계약 기준과 해지 상담", "월 2회·4회 정기관리 차이", "초도청소 후 청소 전후 사진 제공 방식"])
    );
  }

  if (route === "/reviews") {
    return section(
      "후기 확인 포인트",
      paragraph("실제 고객 후기는 상담 편의, 작업 결과, 정기관리 만족도 중심으로 정리해 안내합니다.")
    );
  }

  if (route === "/guide") {
    return section(
      "공용공간 관리 가이드",
      paragraph("빌라 계단 냄새, 먼지, 미끄럼, 공동현관 유리 오염처럼 자주 생기는 관리 문제를 정보성 글로 정리합니다.")
    );
  }

  if (route === "/ops") {
    return section(
      "운영 상태",
      paragraph("배포 상태 확인용 페이지이며 검색 결과 노출 대상이 아닙니다.")
    );
  }

  return section(
    "이천계단지기 안내",
    paragraph("이천 지역 빌라·상가 공용공간 청소관리 내용을 페이지 목적에 맞춰 안내합니다.")
  );
}

function getWorkStaticSections(post: AreaPost) {
  const areaName = AREA_LABELS[post.area] ?? post.area;
  const areaHref = post.area === "downtown" ? "/areas" : `/area/${post.area}`;
  const details = [
    post.date ? `작업일: ${post.date}` : "",
    post.buildingType ? `건물 유형: ${post.buildingType}` : "",
    post.workType ? `작업 형태: ${post.workType}` : "",
    post.workScope ? `작업 범위: ${post.workScope}` : "",
  ].filter(Boolean);

  return [
    section(
      `${areaName} 작업 개요`,
      paragraph(post.description || `${areaName} 공용공간 상태를 확인하고 필요한 청소 범위를 정리한 작업 기록입니다.`)
    ),
    details.length > 0 ? section("작업 정보", list(details)) : "",
    section(
      "관련 안내",
      linkList([
        { href: areaHref, label: `${areaName} 계단청소 안내` },
        { href: "/services/stair", label: "계단청소 범위·주기·비용 안내" },
        { href: "/records", label: "다른 작업 기록 보기" },
      ])
    ),
  ].join("");
}

function buildStaticBody(seo: StaticSeo, context: StaticBodyContext) {
  const h1 = escapeHtml(seo.title.split("|")[0].trim());
  const description = escapeHtml(seo.description);
  const body = context.workPost
    ? getWorkStaticSections(context.workPost)
    : context.route.startsWith("/area/")
      ? getAreaStaticSections(context.route.split("/").pop() ?? "", context.workPosts)
      : getGeneralStaticSections(context.route, context.workPosts);

  return `<div id="root"><main data-prerender="seo" style="max-width:720px;margin:0 auto;padding:48px 20px;font-family:system-ui,sans-serif;line-height:1.7;color:#1a2b4a">
  <h1 style="font-size:1.45rem">${h1}</h1>
  <p>${description}</p>${body}
</main></div>`;
}

function applySeoToHtml(html: string, seo: StaticSeo, context: StaticBodyContext) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(seo.canonical);
  const robots = escapeHtml(seo.robots ?? "index, follow");

  let result = html;
  result = replaceOrThrow(result, /<div id="root"><\/div>/, buildStaticBody(seo, context), "root static body");
  result = replaceOrThrow(result, /<title>.*?<\/title>/s, `<title>${title}</title>`, "title");
  result = replaceOrThrow(result, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`, "description");
  result = replaceOrThrow(result, /<meta name="robots" content="[^"]*"/, `<meta name="robots" content="${robots}"`, "robots");

  if (seo.keywords) {
    result = replaceOrThrow(result, /<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${escapeHtml(seo.keywords)}"`, "keywords");
  }

  result = replaceOrThrow(result, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`, "og:title");
  result = replaceOrThrow(result, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`, "og:description");
  result = replaceOrThrow(result, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`, "og:url");
  result = replaceOrThrow(result, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`, "twitter:title");
  result = replaceOrThrow(result, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${description}"`, "twitter:description");
  result = replaceOrThrow(result, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`, "canonical");

  if (seo.image) {
    const image = escapeHtml(seo.image);
    result = replaceOrThrow(result, /<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${image}"`, "og:image");
    result = replaceOrThrow(result, /<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${image}"`, "twitter:image");
  }

  if (seo.jsonLd) {
    result = result.replace(/<script id="route-seo-jsonld[^"]*"[^>]*>.*?<\/script>\s*/gs, "");
    const items = Array.isArray(seo.jsonLd) ? seo.jsonLd : [seo.jsonLd];
    const scripts = items
      .map((item, index) => {
        const id = index === 0 ? "route-seo-jsonld" : `route-seo-jsonld-${index}`;
        return `<script id="${id}" type="application/ld+json">${escapeJsonForScriptTag(item)}</script>`;
      })
      .join("\n  ");
    result = replaceOrThrow(result, /<\/head>/, `${scripts}\n  </head>`, "jsonld");
  }

  return result;
}

function appendWorkUrlsToSitemap(entries: Array<{ path: string; lastmod: string }>) {
  if (entries.length === 0 || !existsSync(sitemapPath)) return;

  let sitemap = readFileSync(sitemapPath, "utf-8");

  const urlBlocks = entries
    .map(
      ({ path: routePath, lastmod }) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${routePath}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("\n");

  sitemap = sitemap.replace("</urlset>", `${urlBlocks}\n</urlset>`);
  writeFileSync(sitemapPath, sitemap, "utf-8");
}

async function main() {
  const baseHtml = readFileSync(indexHtmlPath, "utf-8");
  const workPosts = await fetchWorkPosts();
  let count = 0;

  for (const route of routes) {
    const seo = getSeoForPath(route);

    if (!seo) continue;

    const html = applySeoToHtml(baseHtml, seo, { route, workPosts });
    const outDir = path.join(distPublic, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
    count += 1;
  }

  const seenSlugs = new Set<string>();
  const sitemapEntries: Array<{ path: string; lastmod: string }> = [];

  for (const post of workPosts) {
    const slug = getWorkSlug(post);

    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const seo = getWorkSeo(post);
    const html = applySeoToHtml(baseHtml, seo, { route: `/work/${slug}`, workPost: post, workPosts });
    const outDir = path.join(distPublic, "work", slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
    count += 1;

    sitemapEntries.push({ path: `/work/${slug}`, lastmod: post.date.replace(/\./g, "-") });
  }

  // 정보글(/blog/:id)은 api/blog-og.ts가 요청 시점에 메타를 주입하므로
  // 빌드 시점 프리렌더에서 제외한다 (새 글·수정이 재배포 없이 반영되도록).
  appendWorkUrlsToSitemap(sitemapEntries);

  console.log(
    `prerender-seo: wrote ${count} static SEO pages (${seenSlugs.size} work records)`
  );
}

main();
