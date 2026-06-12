import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generalSeoByPath, getSeoForPath, seoByAreaSlug } from "../client/src/data/areaSeo";
import { daewolPosts } from "../client/src/data/areas/daewol";
import { downtownPosts } from "../client/src/data/areas/downtown";
import { majangPosts } from "../client/src/data/areas/majang";
import type { AreaPost } from "../client/src/hooks/useAreaPosts";
import type { SeoProps } from "../client/src/components/Seo";
import { getWorkSeo } from "../client/src/lib/workSeo";
import { getWorkSlug } from "../client/src/lib/workSlug";

const SITE_URL = "https://2000stair.kr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.resolve(__dirname, "../dist/public");
const indexHtmlPath = path.join(distPublic, "index.html");
const sitemapPath = path.join(distPublic, "sitemap.xml");

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

// --- DB blog posts fetch (via the public tRPC endpoint on the live site) ---

type BlogPost = {
  id: number;
  title: string;
  content: string;
  thumbnail?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) return [];

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = (await sql`
      SELECT id, title, content, thumbnail,
             seo_title AS "seoTitle",
             seo_description AS "seoDescription",
             seo_keywords AS "seoKeywords",
             "createdAt", "updatedAt"
      FROM posts
      WHERE published = 'published'
      ORDER BY "createdAt" DESC
      LIMIT 50
    `) as Array<Record<string, unknown>>;

    return rows.map((row) => ({
      id: Number(row.id),
      title: String(row.title ?? ""),
      content: String(row.content ?? ""),
      thumbnail: (row.thumbnail as string | null) ?? null,
      seoTitle: (row.seoTitle as string | null) ?? null,
      seoDescription: (row.seoDescription as string | null) ?? null,
      seoKeywords: (row.seoKeywords as string | null) ?? null,
      createdAt: row.createdAt ? new Date(row.createdAt as string).toISOString() : null,
      updatedAt: row.updatedAt ? new Date(row.updatedAt as string).toISOString() : null,
    }));
  } catch (error) {
    console.warn("prerender-seo: DB blog fetch failed, skipping blog pages", error);
    return [];
  }
}

function blogExcerpt(content: string) {
  const text = content
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
}

function toIsoDate(value: string | null | undefined) {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function getBlogSeo(post: BlogPost): SeoProps {
  const canonical = `${SITE_URL}/blog/${post.id}`;
  const title = post.seoTitle || `${post.title} | 이천계단지기`;
  const description =
    post.seoDescription || `이천계단청소 전문 이천계단지기. ${blogExcerpt(post.content)}`;
  const image = post.thumbnail
    ? post.thumbnail.startsWith("http")
      ? post.thumbnail
      : `${SITE_URL}${post.thumbnail}`
    : undefined;
  const datePublished = toIsoDate(post.createdAt);
  const dateModified = toIsoDate(post.updatedAt ?? post.createdAt);

  return {
    title,
    description,
    canonical,
    keywords: post.seoKeywords || undefined,
    image,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${canonical}#post`,
      headline: post.title,
      description,
      url: canonical,
      mainEntityOfPage: canonical,
      ...(image ? { image } : {}),
      ...(datePublished ? { datePublished } : {}),
      ...(dateModified ? { dateModified } : {}),
      author: { "@type": "Organization", name: "이천계단지기", url: `${SITE_URL}/` },
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  };
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

function applySeoToHtml(html: string, seo: NonNullable<ReturnType<typeof getSeoForPath>>) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(seo.canonical);

  let result = html;
  result = replaceOrThrow(result, /<title>.*?<\/title>/s, `<title>${title}</title>`, "title");
  result = replaceOrThrow(result, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`, "description");

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
  let count = 0;

  for (const route of routes) {
    const seo = getSeoForPath(route);

    if (!seo) continue;

    const html = applySeoToHtml(baseHtml, seo);
    const outDir = path.join(distPublic, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
    count += 1;
  }

  const workPosts = await fetchWorkPosts();
  const seenSlugs = new Set<string>();
  const sitemapEntries: Array<{ path: string; lastmod: string }> = [];

  for (const post of workPosts) {
    const slug = getWorkSlug(post);

    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const seo = getWorkSeo(post);
    const html = applySeoToHtml(baseHtml, seo);
    const outDir = path.join(distPublic, "work", slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
    count += 1;

    sitemapEntries.push({ path: `/work/${slug}`, lastmod: post.date.replace(/\./g, "-") });
  }

  const blogPosts = await fetchBlogPosts();
  let blogCount = 0;

  for (const post of blogPosts) {
    const seo = getBlogSeo(post);
    const html = applySeoToHtml(baseHtml, seo);
    const outDir = path.join(distPublic, "blog", String(post.id));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
    count += 1;
    blogCount += 1;

    sitemapEntries.push({
      path: `/blog/${post.id}`,
      lastmod: toIsoDate(post.updatedAt ?? post.createdAt) ?? new Date().toISOString().slice(0, 10),
    });
  }

  appendWorkUrlsToSitemap(sitemapEntries);

  console.log(
    `prerender-seo: wrote ${count} static SEO pages (${seenSlugs.size} work records, ${blogCount} blog posts)`
  );
}

main();
