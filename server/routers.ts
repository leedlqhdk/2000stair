import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { PLANS } from "./products";
import { getDb } from "./db";
import { quoteRequests } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { blogRouter } from "./routers/blog";
import { areaPostsRouter } from "./routers/areaPosts";
import { contentPostsRouter } from "./routers/contentPosts";

export const appRouter = router({
  system: systemRouter,
  blog: blogRouter,
  areaPosts: areaPostsRouter,
  contentPosts: contentPostsRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  quote: router({
    // Get available plans (public)
    plans: publicProcedure.query(() => {
      return PLANS.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        popular: p.popular,
      }));
    }),

    // Submit a quote request (public - no login required)
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "이름을 입력해주세요"),
          phone: z.string().min(1, "연락처를 입력해주세요"),
          email: z.string().email("올바른 이메일을 입력해주세요").optional().or(z.literal("")),
          address: z.string().min(1, "주소를 입력해주세요"),
          serviceType: z.enum(["in_person", "non_contact"]),
          planId: z.string().min(1, "플랜을 선택해주세요"),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const userId = ctx.user?.id || null;

        await db.insert(quoteRequests).values({
          userId,
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          address: input.address,
          serviceType: input.serviceType,
          planId: input.planId,
          message: input.message || null,
        });

        // Notify owner about new quote request
        const plan = PLANS.find((p) => p.id === input.planId);
        try {
          const notified = await notifyOwner({
            title: "새 견적 신청이 접수되었습니다",
            content: `이름: ${input.name}\n연락처: ${input.phone}\n주소: ${input.address}\n서비스: ${input.serviceType === "in_person" ? "대면" : "비대면"}\n플랜: ${plan?.name || input.planId}`,
          });
          if (!notified) {
            console.warn("[Quote] Owner notification failed - service may be temporarily unavailable");
          }
        } catch (err) {
          console.error("[Quote] Failed to notify owner:", err);
        }

        return { success: true };
      }),

    // Get my quote requests (protected)
    myRequests: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const result = await db
        .select()
        .from(quoteRequests)
        .where(eq(quoteRequests.userId, ctx.user.id))
        .orderBy(desc(quoteRequests.createdAt));

      return result;
    }),
  }),
});

export type AppRouter = typeof appRouter;
