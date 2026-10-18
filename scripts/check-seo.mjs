// Audits what search engines and LLM crawlers see, against a running server.
//   node scripts/check-seo.mjs [baseUrl]      (default http://localhost:3000)
// Exits non-zero when any check fails, so it can gate a deploy.

import { readdirSync } from "node:fs";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

const get = async (path) => {
  const res = await fetch(base + path, { redirect: "manual" });
  return { status: res.status, type: res.headers.get("content-type") ?? "", body: await res.text() };
};

const meta = (html, attr, key) =>
  html.match(new RegExp(`<meta[^>]+${attr}="${key}"[^>]+content="([^"]*)"`))?.[1] ??
  html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+${attr}="${key}"`))?.[1];

const robots = await get("/robots.txt");
const sitemapUrl = robots.body.match(/Sitemap:\s*(\S+)/i)?.[1];
if (!sitemapUrl) fail("/robots.txt", "no Sitemap line");
const origin = sitemapUrl ? new URL(sitemapUrl).origin : "";

const sitemap = await get("/sitemap.xml");
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) fail("/sitemap.xml", "no <loc> entries");
for (const u of urls) if (!u.startsWith(origin)) fail("/sitemap.xml", `${u} is not on ${origin}`);

const blogSlugs = readdirSync(new URL("../src/content/blogs/", import.meta.url))
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));
for (const slug of blogSlugs)
  if (!urls.includes(`${origin}/blogs/${slug}`)) fail("/sitemap.xml", `missing /blogs/${slug}`);

for (const url of urls) {
  const path = url.slice(origin.length) || "/";
  const { status, body: html } = await get(path);
  if (status !== 200) { fail(path, `HTTP ${status}`); continue; }

  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(path, "title missing or too short");
  const desc = meta(html, "name", "description");
  if (!desc || desc.length < 50) fail(path, "description missing or under 50 chars");

  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
  if (canonical !== url) fail(path, `canonical is ${canonical ?? "missing"}, expected ${url}`);

  for (const key of ["og:title", "og:description", "og:url", "og:image"])
    if (!meta(html, "property", key)) fail(path, `${key} missing`);
  if (meta(html, "property", "og:url") && meta(html, "property", "og:url") !== url)
    fail(path, `og:url is ${meta(html, "property", "og:url")}`);
  if (!meta(html, "name", "twitter:card")) fail(path, "twitter:card missing");

  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (ld.length === 0) fail(path, "no JSON-LD");
  const types = [];
  for (const [, json] of ld) {
    try {
      const data = JSON.parse(json);
      types.push(...[data].flat().flatMap((d) => d["@graph"] ?? [d]).map((d) => d["@type"]));
    }
    catch { fail(path, "JSON-LD does not parse"); }
  }
  if (path.startsWith("/blogs/") && !types.includes("BlogPosting")) fail(path, "no BlogPosting JSON-LD");
  if (path.startsWith("/projects/") && !types.includes("SoftwareSourceCode")) fail(path, "no SoftwareSourceCode JSON-LD");
}

const llms = await get("/llms.txt");
if (llms.status !== 200 || !llms.type.startsWith("text/plain")) fail("/llms.txt", `HTTP ${llms.status} ${llms.type}`);
else for (const slug of blogSlugs) if (!llms.body.includes(`/blogs/${slug}`)) fail("/llms.txt", `missing /blogs/${slug}`);

console.log(`checked ${urls.length} sitemap URLs on ${base} (canonical origin ${origin})`);
if (failures.length) {
  console.log(`${failures.length} failure(s):`);
  for (const f of failures) console.log("  " + f);
  process.exit(1);
}
console.log("all SEO checks passed");
