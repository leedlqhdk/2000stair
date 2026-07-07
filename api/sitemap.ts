type ApiRequest = {
  query: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  send: (body: string) => void;
};

// /sitemap.xml을 동적으로 생성한다.
// 빌드 시 만들어진 sitemap-base.xml(정적 페이지 + 작업일지)에
// DB의 정보글(/blog/:id)을 실시간으로 합쳐, 관리자에서 새 글을 올리면
// 재배포 없이 바로 사이트맵에 반영된다.

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
      .map(
        ({ id, lastmod }) => `  <url>
    <loc>${SITE_URL}/blog/${id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
      )
      .join("\n");

    if (blocks) {
      xml = xml.replace("</urlset>", `${blocks}\n</urlset>`);
    }
  } catch {
    // DB 오류 시 베이스 사이트맵만이라도 응답
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
