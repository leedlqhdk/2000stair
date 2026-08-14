type ApiRequest = {
  query: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  send: (body: string) => void;
};

// 정보글 RSS 2.0 피드 (/rss.xml)
// 네이버 서치어드바이저 등에 제출하면 새 글이 더 빨리 색인된다.
// DB에서 실시간으로 생성되므로 새 글이 재배포 없이 바로 반영된다.

const SITE_URL = "https://2000stair.kr";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function excerpt(content: string) {
  const text = content
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#>*`_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 200 ? `${text.slice(0, 200)}…` : text;
}

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  const databaseUrl = process.env.DATABASE_URL;

  let items = "";

  if (databaseUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(databaseUrl);

      const rows = (await sql`
        SELECT id, title, content,
               seo_description AS "seoDescription",
               "createdAt"
        FROM posts
        WHERE published = 'published'
        ORDER BY "createdAt" DESC
        LIMIT 50
      `) as Array<Record<string, unknown>>;

      items = rows
        .map((row) => {
          const id = Number(row.id);
          const title = String(row.title ?? "");
          const description =
            (row.seoDescription as string | null) || excerpt(String(row.content ?? ""));
          const created = row.createdAt ? new Date(row.createdAt as string) : new Date();
          const pubDate = Number.isNaN(created.getTime())
            ? new Date().toUTCString()
            : created.toUTCString();

          return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${SITE_URL}/blog/${id}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${id}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
        })
        .join("\n");
    } catch {
      // DB 오류 시 빈 피드로 응답 (500 대신 채널 정보만이라도 유지)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>이천계단지기 관리정보</title>
    <link>${SITE_URL}/guide</link>
    <description>이천 빌라·상가 계단청소 전문 이천계단지기의 계단 관리 정보글</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
