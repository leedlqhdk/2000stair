import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { posts, postTags } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "관리자만 접근 가능합니다." });
  }
  return next({ ctx });
});

export const blogRouter = router({
  // ── Public ──────────────────────────────────────────────
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

      const parsed = rows.map((p) => ({
        ...p,
        images: p.images ? (JSON.parse(p.images) as string[]) : [],
        tags: p.tags ? (JSON.parse(p.tags) as number[]) : [],
      }));

      // Filter by tag if provided
      if (input.tag) {
        const tag = await db
          .select()
          .from(postTags)
          .where(eq(postTags.slug, input.tag))
          .limit(1);
        if (tag.length > 0) {
          const tagId = tag[0].id;
          return {
            posts: parsed.filter((p) => p.tags.includes(tagId)),
            total: parsed.filter((p) => p.tags.includes(tagId)).length,
          };
        }
        return { posts: [], total: 0 };
      }

      return { posts: parsed, total: parsed.length };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "NOT_FOUND" });

      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!result.length) throw new TRPCError({ code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." });

      const post = result[0];
      return {
        ...post,
        images: post.images ? (JSON.parse(post.images) as string[]) : [],
        tags: post.tags ? (JSON.parse(post.tags) as number[]) : [],
      };
    }),

  // ── Tags ────────────────────────────────────────────────
  tags: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(postTags).orderBy(postTags.name);
  }),

  // ── Admin ───────────────────────────────────────────────
  adminList: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const rows = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));

    return rows.map((p) => ({
      ...p,
      images: p.images ? (JSON.parse(p.images) as string[]) : [],
      tags: p.tags ? (JSON.parse(p.tags) as number[]) : [],
    }));
  }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        thumbnail: z.string().optional(),
        images: z.array(z.string()).default([]),
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

      await db.insert(posts).values({
        title: input.title,
        content: input.content,
        thumbnail: input.thumbnail || null,
        images: JSON.stringify(input.images),
        tags: JSON.stringify(input.tags),
        published: input.published,
        authorId: ctx.user.id,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        seoKeywords: input.seoKeywords || null,
      });

      const [created] = await db
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(1);

      return created;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        thumbnail: z.string().nullable().optional(),
        images: z.array(z.string()).optional(),
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
      if (input.images !== undefined) updateData.images = JSON.stringify(input.images);
      if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);
      if (input.published !== undefined) updateData.published = input.published;
      if (input.seoTitle !== undefined) updateData.seo_title = input.seoTitle;
      if (input.seoDescription !== undefined) updateData.seo_description = input.seoDescription;
      if (input.seoKeywords !== undefined) updateData.seo_keywords = input.seoKeywords;

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

  // Tag management
  createTag: adminProcedure
    .input(z.object({ name: z.string().min(1), slug: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(postTags).values({ name: input.name, slug: input.slug });
      return { success: true };
    }),

  // AI SEO 자동 생성
  generateSeo: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const prompt = `당신은 한국 청소 전문업체 "이천계단지기"의 SEO 전문가입니다.
아래 작업일지 글을 읽고 검색 노출에 최적화된 SEO 메타 태그를 생성해주세요.

글 제목: ${input.title}
글 내용 (앞부분): ${input.content.slice(0, 500)}

요구사항:
- seoTitle: 검색 결과에 표시될 제목 (60자 이내, "이천계단청소" 또는 "이천계단지기" 키워드 포함)
- seoDescription: 검색 결과 스니펫 (80자 이내, 핵심 내용 요약, 행동 유도 포함)
- seoKeywords: 쉼표로 구분된 키워드 5~8개 (지역명+서비스명 조합, 예: 이천계단청소, 이천빌라청소)

JSON 형식으로만 응답하세요.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are an SEO expert. Respond only with valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "seo_meta",
            strict: true,
            schema: {
              type: "object",
              properties: {
                seoTitle: { type: "string", description: "SEO title under 60 chars" },
                seoDescription: { type: "string", description: "SEO description under 80 chars" },
                seoKeywords: { type: "string", description: "Comma-separated keywords" },
              },
              required: ["seoTitle", "seoDescription", "seoKeywords"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(typeof content === "string" ? content : JSON.stringify(content));
      return parsed as { seoTitle: string; seoDescription: string; seoKeywords: string };
    }),

  // Image upload
  uploadImage: adminProcedure
    .input(
      z.object({
        filename: z.string(),
        mimeType: z.string(),
        base64: z.string(), // base64 encoded file content
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      const key = `blog/${Date.now()}-${input.filename}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      return { url };
    }),
});
