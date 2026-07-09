type ApiRequest = {
  query: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

type BlogPost = {
  title: string;
  link: string;
  date: string;
  summary: string;
};

const FEED_URL = "https://rss.blog.naver.com/icheonstair.xml";
const CACHE_TTL_MS = 30 * 60 * 1000;

let cache: { fetchedAt: number; posts: BlogPost[] } | null = null;

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function parseFeed(xml: string): BlogPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return items
    .map((item) => {
      const title = stripTags(extractTag(item, "title"));
      const link = extractTag(item, "link");
      const date = formatDate(extractTag(item, "pubDate"));
      const summary = stripTags(extractTag(item, "description")).slice(0, 140);

      return { title, link, date, summary };
    })
    .filter((post) => post.title && post.link);
}

async function fetchBlogPosts() {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.posts;

  const response = await fetch(FEED_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; 2000stair-site/1.0)" },
  });

  if (!response.ok) {
    console.warn("[BlogRss] feed request failed", response.status);
    return cache?.posts ?? [];
  }

  const posts = parseFeed(await response.text());

  if (posts.length > 0) {
    cache = { fetchedAt: Date.now(), posts };
  }

  return posts.length > 0 ? posts : cache?.posts ?? [];
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const limitParam = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limit = Math.min(Math.max(Number(limitParam) || 3, 1), 10);
    const posts = await fetchBlogPosts();

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
    res.status(200).json({ posts: posts.slice(0, limit) });
  } catch (error) {
    console.error("[BlogRss] Failed to load feed", error);
    res.status(200).json({ posts: cache?.posts ?? [] });
  }
}
