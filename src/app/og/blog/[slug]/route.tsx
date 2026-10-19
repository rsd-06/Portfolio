// src/app/og/blog/[slug]/route.tsx
// The share card for one post (og:image / twitter:image), prerendered per slug
// at build: an article card with the title, meta line and the post's
// generative artwork from lib/artwork.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getAllBlogs, getBlogBySlug } from "@/lib/mdx";
import { artworkFor } from "@/lib/artwork";
import { renderArtwork } from "@/components/blogs/renderArtwork";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllBlogs().map((b) => ({ slug: b.slug }));
}

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/** Shortens at a word boundary so the card never ends on half a word. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), max * 0.6)).replace(/[\s,;:—-]+$/, "") + "…";
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getBlogBySlug(slug);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const [serif, serifItalic, mono] = await Promise.all([
    font("cormorant-garamond-latin-500-normal.woff"),
    font("cormorant-garamond-latin-400-italic.woff"),
    font("dm-mono-latin-400-normal.woff"),
  ]);

  const date = new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const title = clip(post.title, 90);
  const titleSize = title.length > 60 ? 54 : title.length > 36 ? 64 : 76;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FBF9F6", color: "#1F1F1F", padding: 56 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            border: "1.5px solid #E2E2DF",
            borderRadius: 28,
            background: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "44px 40px 40px 48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "DM Mono", fontSize: 20, letterSpacing: 3 }}>
              <span style={{ color: "#737373" }}>RSD.EXE / BLOG</span>
              <span style={{ color: "#5227FF", border: "1.5px solid #B19EEF", borderRadius: 999, padding: "4px 14px", fontSize: 17 }}>
                {post.category}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontFamily: "Cormorant", fontSize: titleSize, lineHeight: 1.04, letterSpacing: -1.5 }}>{title}</div>
              {post.excerpt ? (
                <div style={{ fontFamily: "Cormorant Italic", fontSize: 28, lineHeight: 1.3, color: "#4A4A4A", maxWidth: 620 }}>
                  {clip(post.excerpt, 118)}
                </div>
              ) : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "DM Mono", fontSize: 19, color: "#4A4A4A" }}>
              <span style={{ color: "#1F1F1F" }}>Sudharshan R</span>
              <span>·</span>
              <span>{date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
          <div
            style={{
              width: 420,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#F6F4F0",
              borderLeft: "1.5px solid #E2E2DF",
              gap: 18,
            }}
          >
            {renderArtwork(artworkFor(post.slug, post.category), { size: 340 })}
            <span style={{ fontFamily: "DM Mono", fontSize: 16, color: "#5227FF", letterSpacing: 1 }}>{new URL(SITE_URL).host}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Cormorant", data: serif, weight: 500, style: "normal" },
        { name: "Cormorant Italic", data: serifItalic, weight: 400, style: "italic" },
        { name: "DM Mono", data: mono, weight: 400, style: "normal" },
      ],
    }
  );
}
