import Stripe from "stripe";
import express, { Request, Response, Express } from "express";
import { getDb } from "./db";
import { subscriptions, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export function registerStripeWebhook(app: Express) {
  // MUST be registered BEFORE express.json() middleware
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutComplete(session);
            break;
          }
          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdate(subscription);
            break;
          }
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionDeleted(subscription);
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Error processing event:", err);
      }

      res.json({ received: true });
    }
  );
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const db = await getDb();
  if (!db) return;

  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error("[Stripe] No user_id in session metadata");
    return;
  }

  // Save stripe customer ID to user
  if (session.customer) {
    await db
      .update(users)
      .set({ stripeCustomerId: session.customer as string })
      .where(eq(users.id, parseInt(userId)));
  }

  // Create subscription record
  if (session.subscription) {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.insert(subscriptions).values({
      userId: parseInt(userId),
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id || "",
      status: stripeSubscription.status,
      currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
    });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(subscriptions)
    .set({
      status: subscription.status,
      stripePriceId: subscription.items.data[0]?.price.id || "",
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(subscriptions)
    .set({ status: "canceled" })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

export { stripe };
