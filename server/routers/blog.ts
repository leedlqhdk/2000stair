import { TRPCError } from "@trpc/server";
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
