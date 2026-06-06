import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/trpc";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());

const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // path prefix 제거
  const originalUrl = req.url ?? "/";
  req.url = originalUrl.replace(/^\/api\/trpc/, "") || "/";

  return new Promise((resolve) => {
    app.use(trpcMiddleware);
    app(req as any, res as any, resolve as any);
  });
}
