import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { PLANS } from "./products";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      stripeCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: { origin: "https://example.com" },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("subscription.plans", () => {
  it("returns all available plans with correct structure", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const plans = await caller.subscription.plans();

    expect(plans).toHaveLength(3);
    expect(plans[0].id).toBe("basic");
    expect(plans[1].id).toBe("standard");
    expect(plans[2].id).toBe("premium");
  });

  it("plans have correct pricing data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const plans = await caller.subscription.plans();

    const basic = plans.find((p) => p.id === "basic");
    expect(basic).toBeDefined();
    expect(basic!.monthlyPrice).toBe(19900);
    expect(basic!.yearlyPrice).toBe(199000);
    expect(basic!.name).toBe("Basic");

    const standard = plans.find((p) => p.id === "standard");
    expect(standard).toBeDefined();
    expect(standard!.popular).toBe(true);
    expect(standard!.monthlyPrice).toBe(29900);

    const premium = plans.find((p) => p.id === "premium");
    expect(premium).toBeDefined();
    expect(premium!.monthlyPrice).toBe(49900);
  });

  it("each plan has features array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const plans = await caller.subscription.plans();

    plans.forEach((plan) => {
      expect(Array.isArray(plan.features)).toBe(true);
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });
});

describe("subscription.current", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.subscription.current()).rejects.toThrow();
  });
});

describe("subscription.createCheckout", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.subscription.createCheckout({ planId: "basic", interval: "monthly" })
    ).rejects.toThrow();
  });
});

describe("products", () => {
  it("PLANS has correct structure", () => {
    expect(PLANS).toHaveLength(3);

    PLANS.forEach((plan) => {
      expect(plan.id).toBeDefined();
      expect(plan.name).toBeDefined();
      expect(plan.description).toBeDefined();
      expect(plan.monthlyPrice).toBeGreaterThan(0);
      expect(plan.yearlyPrice).toBeGreaterThan(0);
      expect(plan.yearlyPrice).toBeLessThan(plan.monthlyPrice * 12);
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });

  it("plans are ordered Basic < Standard < Premium by price", () => {
    expect(PLANS[0].monthlyPrice).toBeLessThan(PLANS[1].monthlyPrice);
    expect(PLANS[1].monthlyPrice).toBeLessThan(PLANS[2].monthlyPrice);
  });
});
