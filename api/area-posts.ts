import type { VercelRequest, VercelResponse } from "@vercel/node";

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

type AreaPost = {
  id: string;
  title: string;
  description: string;
  area: string;
  date: string;
  image: string;
  images: string[];
  buildingType: string;
  workScope: string;
  workType: string;
  blogUrl: string;
  blogButtonLabel: string;
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
};

let cache: { fetchedAt: number; posts: AreaPost[] } | null = null;
const CACHE_TTL_MS = 0;

function getProperty(
  properties: Record<string, NotionProperty | undefined>,
  names: readonly string[]
) {
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
  if (["downtown", "시내", "시내권", "관고", "창전", "증포", "중리", "갈산", "안흥", "송정", "사음"].some((keyword) => normalized.includes(keyword))) return "downtown";

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

async function fetchAreaPostsFromNotion() {
  const token = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_AREA_DATABASE_ID;

  if (!token || !databaseId) return [];
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.posts;

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
    console.warn("[AreaPosts] Notion request failed", response.status, await response.text());
    return cache?.posts ?? [];
  }

  const data = (await response.json()) as { results?: NotionPage[] };
  const posts = (data.results ?? [])
    .map(parsePage)
    .filter((post): post is AreaPost => Boolean(post))
    .sort((a, b) => b.date.localeCompare(a.date));

  cache = { fetchedAt: Date.now(), posts };
  return posts;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const areaParam = Array.isArray(req.query.area) ? req.query.area[0] : req.query.area;
    const limitParam = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const area = areaParam ? normalizeArea(areaParam) : undefined;
    const limit = Math.min(Math.max(Number(limitParam) || 24, 1), 50);
    const posts = await fetchAreaPostsFromNotion();
    const filtered = area ? posts.filter((post) => post.area === area) : posts;

    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(filtered.slice(0, limit));
  } catch (error) {
    console.error("[AreaPosts] Failed to load posts", error);
    res.status(200).json([]);
  }
}
