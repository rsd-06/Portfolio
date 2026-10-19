// src/app/rss.xml/route.ts
// RSS 2.0 feed of every post, for feed readers and crawlers that follow feeds.

import { getAllBlogs } from "@/lib/mdx";
import { AUTHOR, absoluteUrl, blogCardUrl } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/data/socials";

export const dynamic = "force-static";

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

export function GET() {
  const posts = getAllBlogs();
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blogs/${p.slug}`);
      return `    <item>
      <title>${xml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <category>${xml(p.category)}</category>
      <dc:creator>${xml(AUTHOR)}</dc:creator>
      <description>${xml(p.excerpt)}</description>
      <enclosure url="${absoluteUrl(blogCardUrl(p.slug))}" type="image/png" length="0" />
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>rsd.exe — Blogs</title>
    <link>${absoluteUrl("/blogs")}</link>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    <description>Writing by Sudharshan R on software engineering, computer science, AI, startups and philosophy.</description>
    <language>en-in</language>
    <managingEditor>${CONTACT_EMAIL} (${xml(AUTHOR)})</managingEditor>
    ${posts[0] ? `<lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
