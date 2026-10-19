// src/lib/site.ts
// Canonical origin for the site, used by metadata, sitemap, robots and JSON-LD.
//
// Previously `https://rsd.exe` was hardcoded in six places. `.exe` is not a
// resolvable TLD, so every canonical URL, OpenGraph URL, sitemap entry and the
// JSON-LD Person.url pointed at a host that does not exist.
//
// Production lives at sudharshan-r.vercel.app; rsd-exe.vercel.app 307-redirects
// there. When sudharshan-r.dev is live, change it here — nothing else in the
// app hard-codes the host.
//
// This used to read NEXT_PUBLIC_BASE_URL first. Vercel held the .env.example
// placeholder for it, so every canonical, og:url and sitemap entry in
// production pointed at your-production-domain.vercel.app and Search Console
// rejected all 31 sitemap URLs. The origin is not a secret and does not vary
// per environment, so it is a constant.
export const SITE_URL = "https://sudharshan-r.vercel.app";
