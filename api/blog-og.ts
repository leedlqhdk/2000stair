type ApiRequest = {
  query: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  send: (body: string) => void;
};

// 정보글(/blog/:id) 요청 시 index.html에 해당 글의 SEO 메타를 실시간 주입해 응답한다.
// 빌드 시점 프리렌더와 달리, 관리자에서 새 글을 올리면 재배포 없이 바로
// 카톡/네이버 공유 미리보기와 검색 메타에 반영된다.

const SITE_URL = "https://2000stair.kr";
const BASE_HTML_TTL = 10 * 60 * 1000;

let cachedBaseHtml: { html: string; fetchedAt: number } | null = null;

type BlogPost = {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

async function fetchBaseHtml(): Promise<string | null> {
  if (cachedBaseHtml && Date.now() - cachedBaseHtml.fetchedAt < BASE_HTML_TTL) {
    return cachedBaseHtml.html;
  }

  try {
    const response = await fetch(`${SITE_URL}/index.html`);
    if (!response.ok) throw new Error(`status ${response.status}`);
    const html = await response.text();
    cachedBaseHtml = { html, fetchedAt: Date.now() };
    return html;
  } catch {
    return cachedBaseHtml?.html ?? null;
  }
}

async function fetchPost(id: number): Promise<BlogPost | null> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(databaseUrl);

  const rows = (await sql`
    SELECT id, title, content, thumbnail,
           seo_title AS "seoTitle",
           seo_description AS "seoDescription",
           seo_keywords AS "seoKeywords",
           "createdAt", "updatedAt"
    FROM posts
    WHERE published = 'published' AND id = ${id}
    LIMIT 1
  `) as Array<Record<string, unknown>>;

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: Number(row.id),
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    thumbnail: (row.thumbnail as string | null) ?? null,
    seoTitle: (row.seoTitle as string | null) ?? null,
    seoDescription: (row.seoDescription as string | null) ?? null,
    seoKeywords: (row.seoKeywords as string | null) ?? null,
    createdAt: row.createdAt ? new Date(row.createdAt as string).toISOString() : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt as string).toISOString() : null,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blogExcerpt(content: string) {
  const text = content
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
}

function toIsoDate(value: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function replaceIfFound(html: string, pattern: RegExp, replacement: string) {
  return pattern.test(html) ? html.replace(pattern, () => replacement) : html;
}

function applySeo(html: string, post: BlogPost) {
  const canonical = `${SITE_URL}/blog/${post.id}`;
  const title = escapeHtml(post.seoTitle || `${post.title} | 이천계단지기`);
  const description = escapeHtml(
    post.seoDescription || `이천계단청소 전문 이천계단지기. ${blogExcerpt(post.content)}`
  );

  // data: URI 썸네일은 og:image로 쓸 수 없으므로 http(s)/경로만 사용
  const thumb = post.thumbnail ?? "";
  const image = thumb.startsWith("http")
    ? thumb
    : thumb.startsWith("/")
      ? `${SITE_URL}${thumb}`
      : undefined;

  let result = html;
  result = replaceIfFound(result, /<title>.*?<\/title>/s, `<title>${title}</title>`);
  result = replaceIfFound(result, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`);

  if (post.seoKeywords) {
    result = replaceIfFound(result, /<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${escapeHtml(post.seoKeywords)}"`);
  }

  result = replaceIfFound(result, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`);
  result = replaceIfFound(result, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`);
  result = replaceIfFound(result, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${escapeHtml(canonical)}"`);
  result = replaceIfFound(result, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`);
  result = replaceIfFound(result, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${description}"`);
  result = replaceIfFound(result, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${escapeHtml(canonical)}"`);

  if (image) {
    const escapedImage = escapeHtml(image);
    result = replaceIfFound(result, /<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${escapedImage}"`);
    result = replaceIfFound(result, /<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${escapedImage}"`);
  }

  const datePublished = toIsoDate(post.createdAt);
  const dateModified = toIsoDate(post.updatedAt ?? post.createdAt);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#post`,
    headline: post.title,
    description: post.seoDescription || blogExcerpt(post.content),
    url: canonical,
    mainEntityOfPage: canonical,
    ...(image ? { image } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: { "@type": "Organization", name: "이천계단지기", url: `${SITE_URL}/` },
    publisher: { "@id": `${SITE_URL}/#business` },
  };
  const script = `<script id="route-seo-jsonld" type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`;
  result = replaceIfFound(result, /<\/head>/, `${script}\n  </head>`);

  return result;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const baseHtml = await fetchBaseHtml();

  if (!baseHtml) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=86400");

  const idParam = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(404).send(baseHtml);
    return;
  }

  try {
    const post = await fetchPost(id);

    if (!post) {
      res.status(404).send(baseHtml);
      return;
    }

    res.status(200).send(applySeo(baseHtml, post));
  } catch {
    // DB 오류 시에도 페이지 자체는 SPA로 정상 동작해야 한다
    res.status(200).send(baseHtml);
  }
}
