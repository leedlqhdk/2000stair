import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter.js";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.js";
import { z } from "zod";
import { PLANS } from "./products.js";
import { getDb, upsertUser } from "./db.js";
import { quoteRequests } from "../drizzle/schema.js";
import { eq, desc } from "drizzle-orm";
import { notifyOwner } from "./_core/notification.js";
import { blogRouter } from "./appBlogRouter.js";
import { areaPostsRouter } from "./appAreaPostsRouter.js";
import { contentPostsRouter } from "./appContentPostsRouter.js";
import { reviewsRouter } from "./appReviewsRouter.js";
import { ENV } from "./_core/env.js";
import { sdk } from "./_core/sdk.js";

const ADMIN_OPEN_ID = "admin-password:leedlqhdk@gmail.com";
const PASSWORD_ADMIN_APP_ID = "2000stair-admin";
function serializeCookie(
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
    maxAge?: number;
    expires?: Date;
  } = {}
) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(options.maxAge)}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) {
    const sameSite = options.sameSite === "none" ? "None" : options.sameSite === "strict" ? "Strict" : "Lax";
    parts.push(`SameSite=${sameSite}`);
  }

  return parts.join("; ");
}

const createAdminUser = () => {
  const now = new Date();
  return {
    id: 0,
    openId: ADMIN_OPEN_ID,
    name: "이천계단지기 관리자",
    email: ENV.adminEmail,
    loginMethod: "password",
    role: "admin" as const,
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
};

export const appRouter = router({
  system: systemRouter,
  blog: blogRouter,
  areaPosts: areaPostsRouter,
  contentPosts: contentPostsRouter,
  reviews: reviewsRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    passwordLogin: publicProcedure
      .input(z.object({ password: z.string().min(1, "비밀번호를 입력해주세요") }))
      .mutation(async ({ ctx, input }) => {
        if (!ENV.adminPassword) {
          throw new Error("관리자 비밀번호가 아직 설정되지 않았습니다.");
        }
        if (input.password !== ENV.adminPassword) {
          throw new Error("비밀번호가 올바르지 않습니다.");
        }
        await upsertUser({
          openId: ADMIN_OPEN_ID,
          name: "이천계단지기 관리자",
          email: ENV.adminEmail,
          loginMethod: "password",
          role: "admin",
          lastSignedIn: new Date(),
        });
        const sessionToken = await sdk.signSession(
          {
            openId: ADMIN_OPEN_ID,
            appId: ENV.appId || PASSWORD_ADMIN_APP_ID,
            name: "이천계단지기 관리자",
          },
          { expiresInMs: ONE_YEAR_MS }
        );
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const cookieStr = serializeCookie(COOKIE_NAME, sessionToken, {
          httpOnly: cookieOptions.httpOnly,
          path: cookieOptions.path,
          sameSite: cookieOptions.sameSite as "lax" | "strict" | "none",
          secure: cookieOptions.secure,
          maxAge: Math.floor(ONE_YEAR_MS / 1000),
        });
        ctx.res.setHeader("Set-Cookie", cookieStr);
        console.log("[LOGIN-DEBUG] Set-Cookie header:", cookieStr.substring(0, 120));
        console.log("[LOGIN-DEBUG] secure:", cookieOptions.secure, "x-forwarded-proto:", ctx.req.headers?.["x-forwarded-proto"]);
        return { success: true, user: createAdminUser() } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.setHeader(
        "Set-Cookie",
        serializeCookie(COOKIE_NAME, "", {
          httpOnly: true,
          path: "/",
          maxAge: 0,
          expires: new Date(0),
        })
      );
      return { success: true } as const;
    }),
  }),

  quote: router({
    plans: publicProcedure.query(() => {
      return PLANS.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        popular: p.popular,
      }));
    }),
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
        const plan = PLANS.find((p) => p.id === input.planId);
        try {
          const notified = await notifyOwner({
            title: "새 견적 신청이 접수되었습니다",
            content: "이름: " + input.name + "\n연락처: " + input.phone + "\n주소: " + input.address + "\n서비스: " + (input.serviceType === "in_person" ? "대면" : "비대면") + "\n플랜: " + (plan?.name || input.planId),
          });
          if (!notified) {
            console.warn("견적 신청 알림을 전송하지 못했⊵니다.");
          }
        } catch (error) {
          console.error("견적 신청 알림 전송 중 오류", error);
        }
        return { success: true };
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Admin access required");
      }
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
    }),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Admin access required");
      }
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(quoteRequests).where(eq(quoteRequests.id, input.id)).limit(1);
      return result[0] || null;
    }),
    myRequests: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user?.id) return [];
      return await db.select().from(quoteRequests).where(eq(quoteRequests.userId, ctx.user.id)).orderBy(desc(quoteRequests.createdAt));
    }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "contacted", "confirmed", "canceled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Admin access required");
        }
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(quoteRequests)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(quoteRequests.id, input.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
