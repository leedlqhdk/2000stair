import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema.js";
import { sdk } from "./sdk.js";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const rawCookie = opts.req.headers?.cookie;
  console.log("[AUTH-DEBUG] cookie header:", rawCookie ? `YES: ${rawCookie.substring(0, 120)}` : "NONE");

  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
    console.log("[AUTH-DEBUG] auth success, openId:", (user as any)?.openId ?? "unknown");
  } catch (error) {
    console.log("[AUTH-DEBUG] auth failed:", String(error));
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
