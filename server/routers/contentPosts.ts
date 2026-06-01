import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

type NotionFile = {
  type?: "external" | "file";
  name?: string;
  external?: { url?: string };
  file?: { url?: string };
};

type NotionProperty = {
  type?: string;
  title?: Array<{ plain_text?: string }>;
  rich_text?: Array<{ plain_text?: string }>;
  select?: { name?: string } | null;
  status?: { name?: string } | null;
  multi_select?: Array<{ name?: string }>;
  date?: { start?: string | null } | null;
  files?: NotionFile[];
  url?: string | null;
  checkbox?: boolean;
  formula?: {
    type?: string;
    string?: string | null;
    boolean?: boolean | null;
    date?: { start?: string | null } | null;
  };
};

type NotionPage = {
  id: string;
  properties: Record<string, NotionProperty | undefined>;
};

export type ContentPost = {
  id: string;
  title: string;
  summary: string;
  image: string;
  url: string;
  contentType: string;
  date: string;
};

const PROPERTY_NAMES = {
  title: ["제목", "글 제목", "작업명", "이름", "Name", "Title"],
  summary: ["카드설명", "요약", "설명", "Description", "Summary"],
  contentType: ["콘텐츠유형", "유형", "Type", "Category"],
  published: ["공개", "게시", "공개여부", "Published", "Public"],
  homepage: ["홈페이지노출", "메인노출", "홈노출", "Featured", "Homepage"],
  sourceUrl: ["원문링크", "블로그링크", "링크", "URL", "Source URL"],
  image: ["대표사진", "대표 이미지", "썸네일", "Thumbnail", "Image", "Images", "Photo"],
  date: ["작성일", "게시 예정일", "날짜", "Date", "Created"],
} as const;

const DEFAULT_CONTENT_DATABASE_ID = "ebe89083-37af-41fb-b28a-ba2c4722b0dd";

let cache: { fetchedAt: number; posts: ContentPost[] } | null = null;
const CACHE_TTL_MS = 60_000;

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
  if (property.formula?.string) return property.formula.string;
  if (property.formula?.boolean !== undefined) return property.formula.boolean ? "true" : "false";
  if (property.formula?.date?.start) return property.formula.date.start;

  return "";
}

function propertyToImage(property: NotionProperty | undefined) {
  if (!property) return "";

  const fileUrl = property.files
    ?.map((file) => file.external?.url || file.file?.url)
    .find(Boolean);

  return fileUrl || property.url || "";
}

function normalizeDate(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replace(/-/g, ".");

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function isTruthy(value: string) {
  const normalized = value.trim().toLowerCase();
  return !["false", "비공개", "draft", "hidden", "no", "0", "아니오"].includes(normalized);
}

function isPublished(properties: Record<string, NotionProperty | undefined>) {
  const property = getProperty(properties, PROPERTY_NAMES.published);
  if (!property) return true;
  if (property.checkbox !== undefined) return property.checkbox;
  return isTruthy(propertyToText(property));
}

function isHomepageVisible(properties: Record<string, NotionProperty | undefined>) {
  const property = getProperty(properties, PROPERTY_NAMES.homepage);
  if (!property) return false;
  if (property.checkbox !== undefined) return property.checkbox;
  return isTruthy(propertyToText(property));
}

function parsePage(page: NotionPage): ContentPost | null {
  if (!isPublished(page.properties) || !isHomepageVisible(page.properties)) return null;

  const title = propertyToText(getProperty(page.properties, PROPERTY_NAMES.title));
  const summary = propertyToText(getProperty(page.properties, PROPERTY_NAMES.summary));
  const image = propertyToImage(getProperty(page.properties, PROPERTY_NAMES.image));
  const url = propertyToText(getProperty(page.properties, PROPERTY_NAMES.sourceUrl));
  const contentType = propertyToText(getProperty(page.properties, PROPERTY_NAMES.contentType));
  const date = normalizeDate(propertyToText(getProperty(page.properties, PROPERTY_NAMES.date)));

  if (!title || !image || !url || !contentType) return null;

  return {
    id: page.id,
    title,
    summary,
    image,
    url,
    contentType,
    date,
  };
}

export async function fetchContentPostsFromNotion() {
  const token = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
  const databaseId =
    process.env.NOTION_CONTENT_DATABASE_ID ||
    process.env.NOTION_BLOG_DATABASE_ID ||
    DEFAULT_CONTENT_DATABASE_ID;

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
    console.warn("[ContentPosts] Notion request failed", response.status, await response.text());
    return cache?.posts ?? [];
  }

  const data = (await response.json()) as { results?: NotionPage[] };
  const posts = (data.results ?? [])
    .map(parsePage)
    .filter((post): post is ContentPost => Boolean(post))
    .sort((a, b) => b.date.localeCompare(a.date));

  cache = { fetchedAt: Date.now(), posts };
  return posts;
}

export const contentPostsRouter = router({
  featured: publicProcedure
    .input(
      z.object({
        contentType: z.string().default("정보성"),
        limit: z.number().min(1).max(12).default(3),
      })
    )
    .query(async ({ input }) => {
      const posts = await fetchContentPostsFromNotion();
      return posts
        .filter((post) => post.contentType.includes(input.contentType))
        .slice(0, input.limit);
    }),
});
