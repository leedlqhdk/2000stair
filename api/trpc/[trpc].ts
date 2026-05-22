import { nodeHTTPRequestHandler } from "@trpc/server/adapters/node-http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { appRouter } from "../../server/routers";
import { sdk } from "../../server/_core/sdk";
import type { User } from "../../drizzle/schema";

type VercelRequest = IncomingMessage & {
  query?: Record<string, string | string[] | undefined>;
};

function getTrpcPath(req: VercelRequest) {
  const queryPath = req.query?.trpc;
  if (Array.isArray(queryPath)) return queryPath.join("/");
  if (queryPath) return queryPath;

  const url = new URL(req.url ?? "/", "http://localhost");
  return url.pathname.replace(/^\/api\/trpc\/?/, "");
}

export default async function handler(req: VercelRequest, res: ServerResponse) {
  await nodeHTTPRequestHandler({
    req,
    res,
    path: getTrpcPath(req),
    router: appRouter,
    createContext: async () => {
      let user: User | null = null;

      try {
        user = await sdk.authenticateRequest(req as never);
      } catch {
        user = null;
      }

      return {
        req: req as never,
        res: res as never,
        user,
      };
    },
  });
}
