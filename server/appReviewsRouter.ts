import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { reviews } from "../drizzle/schema.js";
import { getDb } from "./db.js";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.js";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "관리자만 접근 가능합니다." });
  }
  return next({ ctx });
});

const reviewInput = z.object({
  platform: z.string().min(1, "플랫폼 이름을 입력해주세요").max(50),
  dotColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "색상은 #rrggbb 형식이어야 합니다"),
  score: z.string().min(1).max(10),
  quote: z.string().min(1, "후기 내용을 입력해주세요"),
  detail: z.string().max(100).default(""),
  url: z.string().url("올바른 링크를 입력해주세요"),
});

export const reviewsRouter = router({
  // 공개: 메인·서비스 페이지 후기 카드 (DB에 없으면 클라이언트가 기본 후기 사용)
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(reviews).orderBy(asc(reviews.sortOrder), asc(reviews.id));
  }),

  create: adminProcedure.input(reviewInput).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const existing = await db.select({ sortOrder: reviews.sortOrder }).from(reviews);
    const nextOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1;

    await db.insert(reviews).values({ ...input, sortOrder: nextOrder });
    return { success: true };
  }),

  update: adminProcedure
    .input(reviewInput.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { id, ...data } = input;
      await db.update(reviews).set({ ...data, updatedAt: new Date() }).where(eq(reviews.id, id));
      return { success: true };
    }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    await db.delete(reviews).where(eq(reviews.id, input.id));
    return { success: true };
  }),

  // 정렬 순서 교환 (위/아래 이동)
  swapOrder: adminProcedure
    .input(z.object({ idA: z.number(), idB: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db.select().from(reviews);
      const a = rows.find((row) => row.id === input.idA);
      const b = rows.find((row) => row.id === input.idB);
      if (!a || !b) throw new TRPCError({ code: "NOT_FOUND" });

      await db.update(reviews).set({ sortOrder: b.sortOrder }).where(eq(reviews.id, a.id));
      await db.update(reviews).set({ sortOrder: a.sortOrder }).where(eq(reviews.id, b.id));
      return { success: true };
    }),
});
