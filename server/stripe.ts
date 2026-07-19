// Stripe integration removed - service uses free quote request flow instead
import type { Express } from "express";

export function registerStripeWebhook(_app: Express) {
  // No-op: Stripe webhook removed
}
