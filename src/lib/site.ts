// src/lib/site.ts
// Canonical origin for the site, used by metadata, sitemap, robots and JSON-LD.
//
// Previously `https://rsd.exe` was hardcoded in six places. `.exe` is not a
// resolvable TLD, so every canonical URL, OpenGraph URL, sitemap entry and the
// JSON-LD Person.url pointed at a host that does not exist.
//
// Production lives at sudharshan-r.vercel.app; rsd-exe.vercel.app 307-redirects
// there. When sudharshan-r.dev is live, change the fallback below (or set
// NEXT_PUBLIC_BASE_URL in Vercel) — nothing else in the app hard-codes the host.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://sudharshan-r.vercel.app"
).replace(/\/$/, "");
