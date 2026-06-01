import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { eq } from "drizzle-orm";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerStripeWebhook } from "../stripe";
import { getDb } from "../db";
import { posts } from "../../drizzle/schema";
import { fetchAreaPostsFromNotion } from "../routers/areaPosts";
import { getWorkSlug } from "../../client/src/lib/workSlug";

const CANONICAL_HOST = "2000stair.kr";
const SITE_URL = `https://${CANONICAL_HOST}`;
const LEGACY_HOSTS = new Set(["2000stair.click", "www.2000stair.click", "www.2000stair.kr"]);
const STATIC_SITEMAP_ROUTES = [
  { path: "/", lastmod: "2026-05-31", changefreq: "weekly", priority: "1.0" },
  { path: "/about", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/qna", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/areas", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.9" },
  { path: "/records", lastmod: "2026-05-31", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", lastmod: "2026-05-31", changefreq: "weekly", priority: "0.8" },
  { path: "/area/majang", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/daewol", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/sindun", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/downtown", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/bubal", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/baeksa", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
] as const;

function getRequestHost(req: express.Request) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const hostHeader = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost ?? req.headers.host ?? "";

  return hostHeader.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
}

function buildCanonicalUrl(req: express.Request) {
  return `${SITE_URL}${req.originalUrl}`;
}

function toLastMod(value: Date | string | null | undefined) {
  if (!value) return new Date().toISOString().slice(0, 10);

  const normalized = typeof value === "string" ? value.replace(/\./g, "-") : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemapUrlTag({
  loc,
  lastmod,
  changefreq,
  priority,
}: {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}) {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function buildSitemapXml() {
  const staticUrls = STATIC_SITEMAP_ROUTES.map((route) =>
    sitemapUrlTag({
      loc: `${SITE_URL}${route.path}`,
      lastmod: route.lastmod,
      changefreq: route.changefreq,
      priority: route.priority,
    })
  );

  const db = await getDb();
  const blogUrls = db
    ? await db
        .select({ id: posts.id, updatedAt: posts.updatedAt, createdAt: posts.createdAt })
        .from(posts)
        .where(eq(posts.published, "published"))
    : [];

  const blogTags = blogUrls.map((post) =>
    sitemapUrlTag({
      loc: `${SITE_URL}/blog/${post.id}`,
      lastmod: toLastMod(post.updatedAt ?? post.createdAt),
      changefreq: "monthly",
      priority: "0.7",
    })
  );

  const areaPosts = await fetchAreaPostsFromNotion();
  const workTags = areaPosts.map((post) =>
    sitemapUrlTag({
      loc: `${SITE_URL}/work/${getWorkSlug(post)}`,
      lastmod: toLastMod(post.date),
      changefreq: "monthly",
      priority: "0.7",
    })
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...blogTags,
    ...workTags,
    '</urlset>',
  ].join("\n");
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Legacy: Stripe webhook placeholder (no-op)
  registerStripeWebhook(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.set("trust proxy", true);
  app.use((req, res, next) => {
    const host = getRequestHost(req);

    if (!host) {
      return next();
    }

    if (LEGACY_HOSTS.has(host) || (host === CANONICAL_HOST && req.protocol !== "https")) {
      return res.redirect(301, buildCanonicalUrl(req));
    }

    return next();
  });
  app.get("/sitemap.xml", async (_req, res, next) => {
    try {
      const xml = await buildSitemapXml();
      res.status(200).type("application/xml").send(xml);
    } catch (error) {
      next(error);
    }
  });
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
