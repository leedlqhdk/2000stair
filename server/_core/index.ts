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
import nodemailer from "nodemailer";

const CANONICAL_HOST = "2000stair.kr";
const SITE_URL = `https://${CANONICAL_HOST}`;
const REPOSITORY_URL = "https://github.com/leedlqhdk/2000stair";
const LEGACY_HOSTS = new Set(["2000stair.click", "www.2000stair.click", "www.2000stair.kr"]);
const STATIC_SITEMAP_ROUTES = [
  { path: "/", lastmod: "2026-05-31", changefreq: "weekly", priority: "1.0" },
  { path: "/about", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/qna", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/services", lastmod: "2026-06-10", changefreq: "monthly", priority: "0.8" },
  { path: "/services/stair", lastmod: "2026-06-10", changefreq: "monthly", priority: "0.8" },
  { path: "/services/glass", lastmod: "2026-06-10", changefreq: "monthly", priority: "0.7" },
  { path: "/services/bathroom", lastmod: "2026-06-10", changefreq: "monthly", priority: "0.7" },
  { path: "/services/office", lastmod: "2026-06-10", changefreq: "monthly", priority: "0.7" },
  { path: "/reviews", lastmod: "2026-06-10", changefreq: "monthly", priority: "0.7" },
  { path: "/guide", lastmod: "2026-06-10", changefreq: "monthly", priority: "0.6" },
  { path: "/areas", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.9" },
  { path: "/records", lastmod: "2026-05-31", changefreq: "weekly", priority: "0.8" },
  { path: "/area/majang", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/daewol", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/sindun", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/gwango", lastmod: "2026-06-22", changefreq: "monthly", priority: "0.8" },
  { path: "/area/changjeon", lastmod: "2026-06-22", changefreq: "monthly", priority: "0.8" },
  { path: "/area/jungni", lastmod: "2026-06-24", changefreq: "monthly", priority: "0.8" },
  { path: "/area/jeungpo", lastmod: "2026-06-24", changefreq: "monthly", priority: "0.8" },
  { path: "/area/bubal", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/baeksa", lastmod: "2026-05-31", changefreq: "monthly", priority: "0.8" },
  { path: "/area/gonjiam", lastmod: "2026-06-24", changefreq: "monthly", priority: "0.7" },
] as const;
const LEGACY_PATH_REDIRECTS: Record<string, string> = {
  "/blog": "/records",
  "/work": "/records",
  "/area/Majang": "/area/majang",
  "/area/downtown": "/areas",
  "/area/songjeong": "/area/jungni",
};
const RELEASE_NOTES = [
  {
    date: "2026-06-01",
    title: "연락처/CTA 정리",
    summary: "푸터와 소개 페이지에서 카톡을 메인 CTA로 두고 전화·메일·카톡을 분리 표기했습니다.",
    commit: "f8c57a531f8c38c5830c9aadf617d5c1496c7c07",
  },
  {
    date: "2026-06-01",
    title: "운영·배포 상태 공개",
    summary: "외부에서 배포 SHA, 브랜치, 최근 반영한 변경 로그를 확인할 수 있는 공개 상태 API를 추가했습니다.",
    commit: "f14dcf8368f6bc895bb7ac32a87ac32a54158e77",
  },
  {
    date: "2026-06-01",
    title: "후기 카드 문구 차별화",
    summary: "네이버는 관리 결과, 당근은 상담 편의 중심으로 리뷰 톤을 분리했습니다.",
    commit: "2395df932a8d327706f284096205d7b3560fc794",
  },
  {
    date: "2026-06-01",
    title: "동적 sitemap 보강",
    summary: "blog 상세와 work 상세 URL이 sitemap.xml에 자동 반영되도록 변경했습니다.",
    commit: "3777868539547517bf3c939d1243901d823ddfdc",
  },
  {
    date: "2026-06-01",
    title: "상세 canonical 보강",
    summary: "블로그/작업일지 상세 페이지의 canonical과 og:url을 .kr 정본으로 고정했습니다.",
    commit: "38196d84f1beaa90eab19c00d52fc7c3e1a5e14b",
  },
  {
    date: "2026-06-01",
    title: "legacy 도메인 301 정리",
    summary: "2000stair.click, www 하위 도메인을 2000stair.kr로 301 리디렉션하도록 추가했습니다.",
    commit: "f69d682ba546dfd3412d9d1158e003fee1674589",
  },
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

function buildRedirectUrl(req: express.Request, targetPath: string) {
  const queryIndex = req.originalUrl.indexOf("?");
  const queryString = queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : "";

  return `${SITE_URL}${targetPath}${queryString}`;
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

function getPublicStatus() {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || "unknown";
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_URL || "unknown";
  const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || "unknown";
  const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE || process.env.GIT_COMMIT_MESSAGE || "";

  return {
    siteUrl: SITE_URL,
    repositoryUrl: REPOSITORY_URL,
    generatedAt: new Date().toISOString(),
    deployment: {
      sha: commitSha,
      shortSha: commitSha === "unknown" ? "unknown" : commitSha.slice(0, 7),
      branch,
      deploymentId,
      commitMessage,
    },
    releaseNotes: RELEASE_NOTES.map((note) => ({
      ...note,
      commitUrl: `${REPOSITORY_URL}/commit/${note.commit}`,
    })),
  };
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
  registerStripeWebhook(app);
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
  app.use((req, res, next) => {
    const targetPath = LEGACY_PATH_REDIRECTS[req.path];

    if (targetPath) {
      return res.redirect(301, buildRedirectUrl(req, targetPath));
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
  app.get("/api/public/status", (_req, res) => {
    res.status(200).json(getPublicStatus());
  });
  app.post("/api/quote", async (req, res) => {
  try {
    const { phone, address, notes } = req.body as { phone: string; address: string; notes?: string };
    if (!phone?.trim() || !address?.trim()) {
      return res.status(400).json({ error: "연락처와 주소는 필수입니다." });
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.naver.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `"이천계단지기 홈페이지" <${process.env.EMAIL_USER}>`,
      to: "rbska3308@naver.com",
      subject: "[이천계단지기] 무료방문견적 신청",
      text: `[무료방문견적 신청]\n\n📞 연락처: ${phone}\n📍 주소: ${address}${notes?.trim() ? `\n📝 기타: ${notes}` : ""}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "전송에 실패했습니다." });
  }
});
registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
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
