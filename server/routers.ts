import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { stripe } from "./stripe";
import { PLANS } from "./products";
import { getDb } from "./db";
import { subscriptions, users } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  subscription: router({
    // Get available plans (public)
    plans: publicProcedure.query(() => {
      return PLANS.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        features: p.features,
        monthlyPrice: p.monthlyPrice,
        yearlyPrice: p.yearlyPrice,
        popular: p.popular || false,
      }));
    }),

    // Get current user's subscription
    current: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      return result[0] || null;
    }),

    // Create checkout session
    createCheckout: protectedProcedure
      .input(
        z.object({
          planId: z.string(),
          interval: z.enum(["monthly", "yearly"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const plan = PLANS.find((p) => p.id === input.planId);
        if (!plan) throw new Error("Invalid plan");

        const price =
          input.interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
        const intervalConfig =
          input.interval === "monthly"
            ? { interval: "month" as const, interval_count: 1 }
            : { interval: "year" as const, interval_count: 1 };

        const origin = ctx.req.headers.origin || ctx.req.headers.referer || "";

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            plan_id: plan.id,
          },
          line_items: [
            {
              price_data: {
                currency: "krw",
                product_data: {
                  name: `PeanutCrate ${plan.name}`,
                  description: plan.description,
                },
                unit_amount: price,
                recurring: intervalConfig,
              },
              quantity: 1,
            },
          ],
          allow_promotion_codes: true,
          success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/#pricing`,
        });

        return { url: session.url };
      }),

    // Cancel subscription
    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      const sub = result[0];
      if (!sub) throw new Error("No active subscription");

      await stripe.subscriptions.cancel(sub.stripeSubscriptionId);

      await db
        .update(subscriptions)
        .set({ status: "canceled" })
        .where(eq(subscriptions.id, sub.id));

      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
