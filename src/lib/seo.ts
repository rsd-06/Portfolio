// src/lib/seo.ts
// Per-page metadata in one place. Every route calls pageMetadata() with its own
// path, because Next merges metadata shallowly: a canonical or og:url set only
// in the root layout was inherited by every page, which told search engines
// that /about, each project and each ProtoSem week were duplicates of "/".

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const SITE_NAME = "rsd.exe";
export const AUTHOR = "Sudharshan R";
export const TWITTER_HANDLE = "@rsd_2006";

type PageMeta = {
  /** Route path, e.g. "/about". Becomes the canonical and og:url. */
  path: string;
  /** Page title without the site suffix; the root layout's template adds it. */
  title: string;
  description: string;
  keywords?: string[];
  /** Small label above the title on the generated share image. */
  eyebrow?: string;
  article?: { publishedTime: string; tags?: string[] };
};

export function ogImageUrl(title: string, eyebrow?: string) {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/og?${params}`;
}

export function pageMetadata({ path, title, description, keywords, eyebrow, article }: PageMeta): Metadata {
  const fullTitle = path === "/" ? title : `${title} — ${SITE_NAME}`;
  const image = { url: ogImageUrl(title, eyebrow), width: 1200, height: 630, alt: fullTitle };

  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [image],
      ...(article
        ? { type: "article", publishedTime: article.publishedTime, authors: [SITE_URL], tags: article.tags }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: TWITTER_HANDLE,
      images: [image.url],
    },
  };
}

/** Absolute URL for JSON-LD, which (unlike metadata) is not resolved against metadataBase. */
export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
