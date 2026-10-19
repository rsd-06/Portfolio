import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src/content/blogs");

/** What a post was written from; declared in frontmatter as `sources:`. */
export type PostSource =
  | { type: "youtube"; id: string; title: string; creator?: string }
  | { type: "article"; url: string; title: string; author?: string; publisher?: string; date?: string; description?: string; image?: string };

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  sources: PostSource[];
};

/** A post without its body: what lists, cards and the share sheet need. */
export type BlogSummary = Omit<BlogPost, "content" | "sources">;

export const sourceUrl = (s: PostSource) => (s.type === "youtube" ? `https://www.youtube.com/watch?v=${s.id}` : s.url);

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/**
 * Frontmatter is hand-written, so it's parsed here, at the boundary: an entry
 * missing its id/url or title is dropped with a build-time warning instead of
 * rendering a broken embed.
 */
function parseSources(raw: unknown, slug: string): PostSource[] {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) {
    console.warn(`[mdx] ${slug}: "sources" must be a list`);
    return [];
  }
  return raw.flatMap((s): PostSource[] => {
    const title = str(s?.title);
    if (s?.type === "youtube" && /^[\w-]{11}$/.test(s?.id ?? "") && title)
      return [{ type: "youtube", id: s.id, title, creator: str(s.creator) }];
    if (s?.type === "article" && /^https?:\/\//.test(s?.url ?? "") && title)
      return [{
        type: "article", url: s.url, title,
        author: str(s.author), publisher: str(s.publisher), date: str(s.date),
        description: str(s.description), image: str(s.image),
      }];
    console.warn(`[mdx] ${slug}: skipped invalid source ${JSON.stringify(s)}`);
    return [];
  });
}

export const toSummary = (p: BlogPost): BlogSummary => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  category: p.category,
  readTime: p.readTime,
  excerpt: p.excerpt,
});

// Ensure directory exists
if (!fs.existsSync(contentDirectory)) {
  fs.mkdirSync(contentDirectory, { recursive: true });
}

export function getBlogSlugs() {
  if (!fs.existsSync(contentDirectory)) return [];
  return fs.readdirSync(contentDirectory).filter((file) => file.endsWith(".mdx"));
}

export function getBlogBySlug(slug: string): BlogPost {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || "Untitled Blog",
    date: data.date || "Unknown Date",
    category: data.category || "Uncategorized",
    readTime: data.readTime || "5 min read",
    excerpt: data.excerpt || "",
    content,
    sources: parseSources(data.sources, realSlug),
  };
}

export function getAllBlogs(): BlogPost[] {
  const slugs = getBlogSlugs();
  const blogs = slugs
    .map((slug) => getBlogBySlug(slug))
    // sort blogs by date in descending order
    .sort((blog1, blog2) => (new Date(blog1.date) > new Date(blog2.date) ? -1 : 1));
  return blogs;
}
