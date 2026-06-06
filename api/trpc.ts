import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import express from "express";
import cookieParser from "cookie-parser";
import type { Request, Response } from "express";

const app = express();
app.use(cookieParser());
app.use(express.json());

// server/_core/trpc.ts에서 실제 export 이름 확인 후 import
// createContext 대신 ctx 생성 방식을 직접 사용
app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ req, res }),
  })
);

export default app;
