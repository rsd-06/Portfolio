// src/app/blogs/[slug]/md/route.ts
// A post as plain markdown, served at /blogs/<slug>.md (rewrite in
// next.config.ts) — the llms.txt convention for giving LLMs clean text
// instead of a styled page.

import { getAllBlogs, getBlogBySlug, sourceUrl } from "@/lib/mdx";
import { AUTHOR, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllBlogs().map((b) => ({ slug: b.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getBlogBySlug(slug);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const body = `# ${post.title}

> ${post.excerpt}

By ${AUTHOR} · ${post.date} · ${post.category} · ${post.readTime}
Canonical: ${absoluteUrl(`/blogs/${post.slug}`)}

${post.content.trim()}
${post.sources.length ? `\n## Sources\n\n${post.sources.map((s) => `- ${s.title}${s.type === "youtube" ? (s.creator ? ` — ${s.creator}` : "") : s.author ? ` — ${s.author}` : ""}: ${sourceUrl(s)}`).join("\n")}\n` : ""}`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
