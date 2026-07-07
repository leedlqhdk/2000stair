type ApiRequest = {
  query: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  send: (body: string) => void;
};

import { getWorkSlug } from "../shared/workSlug.js";

// /sitemap.xml을 동적으로 생성한다.
// 빌드 시 만들어진 sitemap-base.xml(정적 페이지 + 빌드 시점 작업일지)에
// DB의 정보글(/blog/:id)과 노션의 새 작업일지(/work/:slug)를 실시간으로 합쳐,
// 새 글이 재배포 없이 바로 사이트맵에 반영된다.

const SITE_URL = "https://2000stair.kr";
const BASE_TTL = 60 * 60 * 1000;

let cachedBase: { xml: string; fetchedAt: number } | null = null;

async function fetchBaseSitemap(): Promise<string | null> {
  if (cachedBase && Date.now() - cachedBase.fetchedAt < BASE_TTL) {
    return cachedBase.xml;
  }

  try {
    const response = await fetch(`${SITE_URL}/sitemap-base.xml`);
    if (!response.ok) throw new Error(`status ${response.status}`);
    const xml = await response.text();
    cachedBase = { xml, fetchedAt: Date.now() };
    return xml;
  } catch {
    return cachedBase?.xml ?? null;
  }
}

async function fetchBlogEntries(): Promise<Array<{ id: number; lastmod: string }>> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(databaseUrl);

  const rows = (await sql`
    SELECT id, "createdAt", "updatedAt"
    FROM posts
    WHERE published = 'published'
    ORDER BY "createdAt" DESC
    LIMIT 200
  `) as Array<Record<string, unknown>>;

  return rows.map((row) => {
    const raw = (row.updatedAt ?? row.createdAt) as string | null;
    const date = raw ? new Date(raw) : new Date();
    const lastmod = Number.isNaN(date.getTime())
      ? new Date().toISOString().slice(0, 10)
      : date.toISOString().slice(0, 10);
    return { id: Number(row.id), lastmod };
  });
}

async function fetchWorkEntries(): Promise<Array<{ path: string; lastmod: string }>> {
  const response = await fetch(`${SITE_URL}/api/area-posts?limit=50`);
  if (!response.ok) return [];

  const posts = (await response.json()) as Array<{ title: string; area?: string; date: string }>;
  const seen = new Set<string>();
  const entries: Array<{ path: string; lastmod: string }> = [];

  for (const post of posts) {
    const slug = getWorkSlug(post);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const lastmod = /^\d{4}\.\d{2}\.\d{2}$/.test(post.date)
      ? post.date.replace(/\./g, "-")
      : new Date().toISOString().slice(0, 10);
    entries.push({ path: `/work/${slug}`, lastmod });
  }

  return entries;
}

function urlBlock(path: string, lastmod: string) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
}

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  const base = await fetchBaseSitemap();

  if (!base) {
    res.status(500).send("Internal Server Error");
    return;
  }

  let xml = base;

  try {
    const entries = await fetchBlogEntries();
    const blocks = entries
      // 베이스에 이미 있는 URL은 중복 추가하지 않음
      .filter(({ id }) => !xml.includes(`<loc>${SITE_URL}/blog/${id}</loc>`))
      .map(({ id, lastmod }) => urlBlock(`/blog/${id}`, lastmod))
      .join("\n");

    if (blocks) {
      xml = xml.replace("</urlset>", `${blocks}\n</urlset>`);
    }
  } catch {
    // DB 오류 시 베이스 사이트맵만이라도 응답
  }

  try {
    const workEntries = await fetchWorkEntries();
    const blocks = workEntries
      .filter(({ path }) => !xml.includes(`<loc>${SITE_URL}${path}</loc>`))
      .map(({ path, lastmod }) => urlBlock(path, lastmod))
      .join("\n");

    if (blocks) {
      xml = xml.replace("</urlset>", `${blocks}\n</urlset>`);
    }
  } catch {
    // 노션 조회 실패 시에도 나머지 사이트맵은 정상 응답
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
