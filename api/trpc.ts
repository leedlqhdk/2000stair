import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/appRouter.js";
import { createContext } from "../server/_core/context.js";
import express from "express";

const app = express();
app.use(express.json());

app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
