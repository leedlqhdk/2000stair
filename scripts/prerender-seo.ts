import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generalSeoByPath, getSeoForPath, seoByAreaSlug } from "../client/src/data/areaSeo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.resolve(__dirname, "../dist/public");
const indexHtmlPath = path.join(distPublic, "index.html");

const routes = [
  ...Object.keys(generalSeoByPath),
  ...Object.keys(seoByAreaSlug).map((slug) => `/area/${slug}`),
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeJsonForScriptTag(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function replaceOrThrow(html: string, pattern: RegExp, replacement: string, label: string) {
  if (!pattern.test(html)) {
    throw new Error(`prerender-seo: pattern not found for ${label}`);
  }

  return html.replace(pattern, () => replacement);
}

function applySeoToHtml(html: string, seo: NonNullable<ReturnType<typeof getSeoForPath>>) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(seo.canonical);

  let result = html;
  result = replaceOrThrow(result, /<title>.*?<\/title>/s, `<title>${title}</title>`, "title");
  result = replaceOrThrow(result, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`, "description");

  if (seo.keywords) {
    result = replaceOrThrow(result, /<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${escapeHtml(seo.keywords)}"`, "keywords");
  }

  result = replaceOrThrow(result, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`, "og:title");
  result = replaceOrThrow(result, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`, "og:description");
  result = replaceOrThrow(result, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`, "og:url");
  result = replaceOrThrow(result, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`, "twitter:title");
  result = replaceOrThrow(result, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${description}"`, "twitter:description");
  result = replaceOrThrow(result, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`, "canonical");

  if (seo.jsonLd) {
    const script = `<script id="route-seo-jsonld" type="application/ld+json">${escapeJsonForScriptTag(seo.jsonLd)}</script>\n  </head>`;
    result = replaceOrThrow(result, /<\/head>/, script, "jsonld");
  }

  return result;
}

function main() {
  const baseHtml = readFileSync(indexHtmlPath, "utf-8");
  let count = 0;

  for (const route of routes) {
    const seo = getSeoForPath(route);

    if (!seo) continue;

    const html = applySeoToHtml(baseHtml, seo);
    const outDir = path.join(distPublic, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
    count += 1;
  }

  console.log(`prerender-seo: wrote ${count} static SEO pages`);
}

main();
