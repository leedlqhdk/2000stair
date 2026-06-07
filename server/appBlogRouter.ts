import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { posts, postTags } from "../drizzle/schema.js";
import { getDb } from "./db.js";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.js";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "관리자만 접근 가능합니다." });
  }
  return next({ ctx });
});

function parsePost(post: typeof posts.$inferSelect) {
  return {
    ...post,
    images: post.images ? (JSON.parse(post.images) as unknown[]) : [],
    tags: post.tags ? (JSON.parse(post.tags) as number[]) : [],
  };
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function pickMeta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return stripHtml(match[1]);
  }
  return "";
}

function pickTitle(html: string) {
  const ogTitle = pickMeta(html, "og:title");
  if (ogTitle) return cleanNaverTitle(ogTitle);

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  return cleanNaverTitle(stripHtml(title));
}

function cleanNaverTitle(title: string) {
  return title
    .replace(/\s*:\s*네이버\s*블로그\s*$/i, "")
    .replace(/\s*-\s*Naver\s*Blog\s*$/i, "")
    .replace(/\s*\|\s*네이버\s*블로그\s*$/i, "")
    .trim();
}

function inferTitleFromUrl(url: string) {
  const known: Record<string, string> = {
    "224306730819": "여름철 빌라 계단 냄새, 물청소만으로 해결 안 되는 이유",
  };

  const id = url.match(/\/(\d{8,})/)?.[1];
  return id ? known[id] ?? `이천계단지기 관리정보 ${id}` : "이천계단지기 관리정보";
}

function buildNaverDraft(input: { url: string; title?: string; description?: string; image?: string }) {
  const title = cleanNaverTitle(input.title || inferTitleFromUrl(input.url));
  const description =
    input.description ||
    `${title}에 대해 이천계단지기가 실제 계단청소 현장 기준으로 정리한 관리정보입니다.`;
  const seoTitle = `${title} | 이천계단지기`;
  const seoDescription = `${description} 이천 빌라·원룸 계단청소와 공용공간 정기관리에 필요한 내용을 정리했습니다.`.slice(0, 150);
  const seoKeywords = "이천계단청소, 이천계단지기, 빌라계단청소, 원룸계단청소, 공용공간청소, 정기계단청소, 계단냄새, 계단관리정보";

  const content = [
    `# ${title}`,
    "",
    "네이버 블로그에 먼저 정리한 내용을 홈페이지 방문자가 보기 쉽도록 다시 구성한 관리정보 글입니다.",
    "",
    "## 핵심 요약",
    `- ${description}`,
    "- 계단·복도·공동현관처럼 함께 쓰는 공간은 오염이 눈에 잘 보이지 않아도 냄새나 미끄럼, 먼지 문제로 이어질 수 있습니다.",
    "- 한 번의 물청소보다 오염이 굳기 전에 주기적으로 관리하는 방식이 더 안정적입니다.",
    "",
    "## 확인하면 좋은 부분",
    "- 계단 논슬립 모서리와 줄눈 틈새",
    "- 공동현관 매트 아래와 유리 프레임 하단",
    "- 난간 손잡이와 브래킷 주변",
    "- 환기가 부족한 계단실의 습기와 냄새 잔여감",
    "",
    "## 이천계단지기 관리 방식",
    "이천계단지기는 부부가 직접 현장을 확인하고, 건물별 전용 걸레를 구분해 사용합니다. 친환경 세제와 탈취 작업을 함께 적용해 공용공간을 꾸준히 관리합니다.",
    "",
    "계단·복도·공동현관 현재 사진을 보내주시면 관리 범위와 견적을 빠르게 안내드립니다.",
    "",
    `[네이버 블로그 원문 보기](${input.url})`,
  ].join("\n");

  return {
    title,
    content,
    thumbnail: input.image || "",
    thumbnailAlt: `${title} 이천계단지기 관리정보`,
    seoTitle: seoTitle.slice(0, 90),
    seoDescription,
    seoKeywords,
  };
}

export const blogRouter = router({
  list: publicProcedure
    .input(
      z.object({
        tag: z.string().optional(),
        limit: z.number().min(1).max(50).default(12),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { posts: [], total: 0 };

      const rows = await db
        .select()
        .from(posts)
        .where(eq(posts.published, "published"))
        .orderBy(desc(posts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const parsed = rows.map(parsePost);
      if (!input.tag) return { posts: parsed, total: parsed.length };

      const tag = await db.select().from(postTags).where(eq(postTags.slug, input.tag)).limit(1);
      if (!tag.length) return { posts: [], total: 0 };

      const filtered = parsed.filter((post) => post.tags.includes(tag[0].id));
      return { posts: filtered, total: filtered.length };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "NOT_FOUND" });

      const result = await db.select().from(posts).where(eq(posts.id, input.id)).limit(1);
      if (!result.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." });
      }

      return parsePost(result[0]);
    }),

  tags: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(postTags).orderBy(postTags.name);
  }),

  adminList: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const rows = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return rows.map(parsePost);
  }),

  importNaverDraft: adminProcedure
    .input(z.object({ url: z.string().url("네이버 블로그 주소를 입력해주세요.") }))
    .mutation(async ({ input }) => {
      if (!input.url.includes("blog.naver.com")) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "네이버 블로그 주소만 변환할 수 있습니다." });
      }

      const match = input.url.match(/blog\.naver\.com\/([^/?#]+)\/(\d+)/);
      const [, blogId, logNo] = match ?? [];

      const candidates = [
        logNo && blogId ? `https://m.blog.naver.com/${blogId}/${logNo}` : null,
        logNo && blogId
          ? `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}&redirect=Dlog`
          : null,
        input.url,
      ].filter(Boolean) as string[];

      const browserHeaders = {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9",
        Referer: "https://m.blog.naver.com/",
      };

      for (const candidateUrl of candidates) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const response = await fetch(candidateUrl, {
            signal: controller.signal,
            headers: browserHeaders,
          });
          clearTimeout(timeout);

          if (!response.ok) continue;
          const html = await response.text();
          if (!html || html.length < 500) continue;

          const rawTitle = pickTitle(html);
          const isPostTitle =
            rawTitle &&
            !rawTitle.endsWith("블로그") &&
            rawTitle !== blogId &&
            rawTitle.length > 4;
          const title = isPostTitle ? rawTitle : inferTitleFromUrl(input.url);
          const description = pickMeta(html, "og:description") || pickMeta(html, "description");
          const validDescription = description && description.length > 20 ? description : undefined;
          const image = pickMeta(html, "og:image");

          return buildNaverDraft({ url: input.url, title, description: validDescription, image });
        } catch {
          continue;
        }
      }

      return buildNaverDraft({ url: input.url });
    }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        thumbnail: z.string().optional(),
        thumbnailAlt: z.string().optional(),
        images: z.array(z.string()).default([]),
        imageAlts: z.array(z.string()).default([]),
        tags: z.array(z.number()).default([]),
        published: z.enum(["draft", "published"]).default("draft"),
        seoTitle: z.string().max(100).optional(),
        seoDescription: z.string().max(160).optional(),
        seoKeywords: z.string().max(300).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const imageObjects = input.images.map((url, i) => ({ url, alt: input.imageAlts[i] || "" }));
      await db.insert(posts).values({
        title: input.title,
        content: input.content,
        thumbnail: input.thumbnail || null,
        thumbnailAlt: input.thumbnailAlt || null,
        images: JSON.stringify(imageObjects),
        tags: JSON.stringify(input.tags),
        published: input.published,
        authorId: ctx.user.id,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        seoKeywords: input.seoKeywords || null,
      });

      const [created] = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(1);
      return created;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        thumbnail: z.string().nullable().optional(),
        thumbnailAlt: z.string().nullable().optional(),
        images: z.array(z.string()).optional(),
        imageAlts: z.array(z.string()).optional(),
        tags: z.array(z.number()).optional(),
        published: z.enum(["draft", "published"]).optional(),
        seoTitle: z.string().max(100).nullable().optional(),
        seoDescription: z.string().max(160).nullable().optional(),
        seoKeywords: z.string().max(300).nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail;
      if (input.thumbnailAlt !== undefined) updateData.thumbnailAlt = input.thumbnailAlt;
      if (input.images !== undefined) {
        const imageObjects = input.images.map((url, i) => ({ url, alt: input.imageAlts?.[i] || "" }));
        updateData.images = JSON.stringify(imageObjects);
      }
      if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);
      if (input.published !== undefined) updateData.published = input.published;
      if (input.seoTitle !== undefined) updateData.seoTitle = input.seoTitle;
      if (input.seoDescription !== undefined) updateData.seoDescription = input.seoDescription;
      if (input.seoKeywords !== undefined) updateData.seoKeywords = input.seoKeywords;

      await db.update(posts).set(updateData).where(eq(posts.id, input.id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),

  createTag: adminProcedure
    .input(z.object({ name: z.string().min(1), slug: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(postTags).values({ name: input.name, slug: input.slug });
      return { success: true };
    }),

  generateSeo: adminProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(({ input }) => ({
      seoTitle: `${input.title} | 이천계단지기`.slice(0, 90),
      seoDescription: input.content.replace(/[#*\[\]()`]/g, " ").replace(/\s+/g, " ").slice(0, 150),
      seoKeywords: "이천계단청소, 이천계단지기, 빌라계단청소, 원룸계단청소, 공용공간청소, 정기계단청소",
    })),

  generateAlt: adminProcedure
    .input(z.object({ imageUrl: z.string(), title: z.string().optional() }))
    .mutation(({ input }) => ({
      alt: (input.title ? `이천계단지기 ${input.title}` : "이천계단지기 계단청소 현장").slice(0, 50),
    })),

  uploadImage: adminProcedure
    .input(z.object({ filename: z.string(), mimeType: z.string(), base64: z.string() }))
    .mutation(({ input }) => ({
      url: `data:${input.mimeType};base64,${input.base64}`,
    })),
});
