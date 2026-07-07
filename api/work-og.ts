import { getWorkSlug } from "../shared/workSlug.js";

type ApiRequest = {
  query: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  send: (body: string) => void;
};

// 작업일지(/work/:slug) 요청 시 index.html에 해당 글의 SEO 메타를 실시간 주입한다.
// 빌드 시점에 프리렌더된 슬러그는 정적 파일이 우선 응답하고,
// 그 이후 노션에 올라온 새 작업일지가 이 함수로 처리된다 (재배포 불필요).

const SITE_URL = "https://2000stair.kr";
const BASE_HTML_TTL = 10 * 60 * 1000;
const POSTS_TTL = 5 * 60 * 1000;

let cachedBaseHtml: { html: string; fetchedAt: number } | null = null;
let cachedPosts: { posts: WorkPost[]; fetchedAt: number } | null = null;

type WorkPost = {
  id: string;
  title: string;
  description: string;
  area: string;
  date: string;
  image: string;
};

const workAreaLabels: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  downtown: "이천 시내권",
  gwango: "관고동",
  changjeon: "창전동",
  jungni: "중리동",
  jeungpo: "증포동",
  bubal: "부발읍",
  baeksa: "백사면",
};

const workAreaRoutes: Record<string, string> = {
  majang: "/area/majang",
  daewol: "/area/daewol",
  sindun: "/area/sindun",
  downtown: "/areas",
  gwango: "/area/gwango",
  changjeon: "/area/changjeon",
  jungni: "/area/jungni",
  jeungpo: "/area/jeungpo",
  bubal: "/area/bubal",
  baeksa: "/area/baeksa",
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

// 노션 파싱 로직은 배포돼 있는 area-posts 함수를 재사용한다
async function fetchWorkPosts(): Promise<WorkPost[]> {
  if (cachedPosts && Date.now() - cachedPosts.fetchedAt < POSTS_TTL) {
    return cachedPosts.posts;
  }

  try {
    const response = await fetch(`${SITE_URL}/api/area-posts?limit=50`);
    if (!response.ok) throw new Error(`status ${response.status}`);
    const posts = (await response.json()) as WorkPost[];
    cachedPosts = { posts, fetchedAt: Date.now() };
    return posts;
  } catch {
    return cachedPosts?.posts ?? [];
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceIfFound(html: string, pattern: RegExp, replacement: string) {
  return pattern.test(html) ? html.replace(pattern, () => replacement) : html;
}

function applySeo(html: string, post: WorkPost) {
  const slug = getWorkSlug(post);
  const areaLabel = post.area ? workAreaLabels[post.area] ?? post.area : "이천";
  const canonical = `${SITE_URL}/work/${slug}`;
  const title = escapeHtml(`${post.title} | ${areaLabel} 계단청소 작업일지 | 이천계단지기`);
  const description = escapeHtml(
    post.description ||
      `${areaLabel} ${post.title} 현장 기록입니다. 이천계단지기가 직접 관리한 계단청소 작업 사진과 날짜를 확인할 수 있습니다.`
  );
  const image = post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`;
  const keywords = `${areaLabel} 계단청소, ${post.title}, 이천계단청소, 빌라계단청소, 상가계단청소`;

  let result = html;
  result = replaceIfFound(result, /<title>.*?<\/title>/s, `<title>${title}</title>`);
  result = replaceIfFound(result, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`);
  result = replaceIfFound(result, /<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${escapeHtml(keywords)}"`);
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

  const areaPath = post.area ? workAreaRoutes[post.area] : undefined;
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "홈", item: `${SITE_URL}/` },
    ...(areaPath
      ? [{ "@type": "ListItem", position: 2, name: areaLabel, item: `${SITE_URL}${areaPath}` }]
      : []),
    { "@type": "ListItem", position: areaPath ? 3 : 2, name: post.title, item: canonical },
  ];
  const jsonLdItems = [
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "@id": `${canonical}#image`,
      contentUrl: image,
      url: canonical,
      name: post.title,
      description: post.description || undefined,
      datePublished: post.date.replace(/\./g, "-"),
      creator: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
  ];
  const scripts = jsonLdItems
    .map(
      (item, index) =>
        `<script id="route-seo-jsonld${index === 0 ? "" : `-${index}`}" type="application/ld+json">${JSON.stringify(item).replace(/</g, "\\u003c")}</script>`
    )
    .join("\n  ");
  result = replaceIfFound(result, /<\/head>/, `${scripts}\n  </head>`);

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

  const slugParam = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug;

  if (!slugParam) {
    res.status(404).send(baseHtml);
    return;
  }

  try {
    const posts = await fetchWorkPosts();
    const post = posts.find((item) => getWorkSlug(item) === slugParam);

    if (!post) {
      // 슬러그가 안 맞아도 SPA가 클라이언트에서 처리하므로 200으로 기본 HTML 응답
      res.status(200).send(baseHtml);
      return;
    }

    res.status(200).send(applySeo(baseHtml, post));
  } catch {
    res.status(200).send(baseHtml);
  }
}
