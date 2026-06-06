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
      seoTitle: input.title.slice(0, 60),
      seoDescription: input.content.replace(/\s+/g, " ").slice(0, 80),
      seoKeywords: "이천계단청소, 이천계단지기, 빌라계단청소, 정기계단청소",
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
