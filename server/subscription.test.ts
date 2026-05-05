import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { PLANS, getPlanById } from "./products";
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

describe("products", () => {
  it("should have exactly 3 plans: basic, standard, premium", () => {
    expect(PLANS).toHaveLength(3);
    expect(PLANS.map((p) => p.id)).toEqual(["basic", "standard", "premium"]);
  });

  it("should mark standard as popular", () => {
    const standard = getPlanById("standard");
    expect(standard).toBeDefined();
    expect(standard!.popular).toBe(true);
  });

  it("each plan should have features array with at least 3 items", () => {
    for (const plan of PLANS) {
      expect(plan.features.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("getPlanById should return undefined for unknown id", () => {
    expect(getPlanById("nonexistent")).toBeUndefined();
  });

  it("all plans have required fields", () => {
    PLANS.forEach((plan) => {
      expect(plan.id).toBeDefined();
      expect(plan.name).toBeDefined();
      expect(plan.description).toBeDefined();
      expect(plan.features.length).toBeGreaterThan(0);
      expect(typeof plan.popular).toBe("boolean");
    });
  });
});

describe("quote.plans procedure", () => {
  it("should return all plans via tRPC", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const plans = await caller.quote.plans();

    expect(plans).toHaveLength(3);
    expect(plans[0]).toHaveProperty("id");
    expect(plans[0]).toHaveProperty("name");
    expect(plans[0]).toHaveProperty("description");
    expect(plans[0]).toHaveProperty("features");
    expect(plans[0]).toHaveProperty("popular");
  });

  it("plans should have correct IDs in order", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const plans = await caller.quote.plans();

    expect(plans[0].id).toBe("basic");
    expect(plans[1].id).toBe("standard");
    expect(plans[2].id).toBe("premium");
  });
});

describe("quote.submit procedure", () => {
  it("should reject empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.quote.submit({
        name: "",
        phone: "010-1234-5678",
        address: "경기도 이천시",
        serviceType: "in_person",
        planId: "basic",
      })
    ).rejects.toThrow();
  });

  it("should reject empty phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.quote.submit({
        name: "홍길동",
        phone: "",
        address: "경기도 이천시",
        serviceType: "in_person",
        planId: "basic",
      })
    ).rejects.toThrow();
  });

  it("should reject empty address", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.quote.submit({
        name: "홍길동",
        phone: "010-1234-5678",
        address: "",
        serviceType: "in_person",
        planId: "basic",
      })
    ).rejects.toThrow();
  });

  it("should reject invalid serviceType", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.quote.submit({
        name: "홍길동",
        phone: "010-1234-5678",
        address: "경기도 이천시",
        serviceType: "invalid" as any,
        planId: "basic",
      })
    ).rejects.toThrow();
  });
});

describe("quote.myRequests procedure", () => {
  it("should throw UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.quote.myRequests()).rejects.toThrow();
  });
});
