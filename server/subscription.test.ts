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
  it("should have exactly 6 service plans", () => {
    expect(PLANS).toHaveLength(6);
  });

  it("should have correct plan IDs", () => {
    expect(PLANS.map((p) => p.id)).toEqual([
      "stair_2_3",
      "stair_4",
      "stair_5_6",
      "bathroom",
      "office",
      "glass",
    ]);
  });

  it("should mark stair_4 as popular", () => {
    const stair4 = getPlanById("stair_4");
    expect(stair4).toBeDefined();
    expect(stair4!.popular).toBe(true);
  });

  it("stair plans should have price with 원~", () => {
    const stairPlans = PLANS.filter((p) => p.id.startsWith("stair"));
    expect(stairPlans).toHaveLength(3);
    for (const plan of stairPlans) {
      expect(plan.price).toMatch(/\d+,\d+원~/);
    }
  });

  it("non-stair plans should have 별도 문의 as price", () => {
    const otherPlans = PLANS.filter((p) => !p.id.startsWith("stair"));
    expect(otherPlans).toHaveLength(3);
    for (const plan of otherPlans) {
      expect(plan.price).toBe("별도 문의");
    }
  });

  it("getPlanById should return undefined for unknown id", () => {
    expect(getPlanById("nonexistent")).toBeUndefined();
  });

  it("all plans have required fields (no badge field)", () => {
    PLANS.forEach((plan) => {
      expect(plan.id).toBeDefined();
      expect(plan.name).toBeDefined();
      expect(plan.price).toBeDefined();
      expect(plan.description).toBeDefined();
      expect(typeof plan.popular).toBe("boolean");
      // Ensure no badge field exists
      expect((plan as any).badge).toBeUndefined();
    });
  });
});

describe("quote.plans procedure", () => {
  it("should return all 6 plans via tRPC", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const plans = await caller.quote.plans();

    expect(plans).toHaveLength(6);
    expect(plans[0]).toHaveProperty("id");
    expect(plans[0]).toHaveProperty("name");
    expect(plans[0]).toHaveProperty("price");
    expect(plans[0]).toHaveProperty("description");
    expect(plans[0]).toHaveProperty("popular");
    // No badge field should be returned
    expect((plans[0] as any).badge).toBeUndefined();
  });

  it("plans should have correct IDs in order", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const plans = await caller.quote.plans();

    expect(plans[0].id).toBe("stair_2_3");
    expect(plans[1].id).toBe("stair_4");
    expect(plans[2].id).toBe("stair_5_6");
    expect(plans[3].id).toBe("bathroom");
    expect(plans[4].id).toBe("office");
    expect(plans[5].id).toBe("glass");
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
        planId: "stair_4",
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
        planId: "stair_4",
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
        planId: "stair_4",
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
        planId: "stair_4",
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
