// src/lib/site.ts
// Canonical origin for the site, used by metadata, sitemap, robots and JSON-LD.
//
// Previously `https://rsd.exe` was hardcoded in six places. `.exe` is not a
// resolvable TLD, so every canonical URL, OpenGraph URL, sitemap entry and the
// JSON-LD Person.url pointed at a host that does not exist.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://rsd-exe.vercel.app"
).replace(/\/$/, "");
