import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/appRouter.js";
import { createContext } from "../server/_core/context.js";
import express from "express";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
