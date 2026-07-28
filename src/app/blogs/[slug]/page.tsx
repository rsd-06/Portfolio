import { getBlogBySlug, getBlogSlugs } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const blog = getBlogBySlug(params.slug);
    return {
      title: blog.title,
      description: blog.excerpt,
    };
  } catch (e) {
    return { title: "Blog Not Found" };
  }
}

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

export default function BlogDetailPage({ params }: Props) {
  let blog;
  try {
    blog = getBlogBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-base-bg text-text-primary pt-[var(--nav-h,120px)] pb-32 px-[var(--page-px)]">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        {/* Back Link */}
        <Link 
          href="/blogs" 
          className="f-mono text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 w-fit"
        >
          ← Back to blogs
        </Link>

        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-[color-mix(in_srgb,var(--color-text)_10%,transparent)] pb-12">
          <div className="flex items-center gap-3 f-mono text-xs uppercase tracking-widest opacity-60">
            <span>{new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>·</span>
            <span>{blog.category}</span>
            <span>·</span>
            <span>{blog.readTime}</span>
          </div>
          <h1 className="f-display text-4xl md:text-6xl font-light tracking-[-0.02em] leading-tight">
            {blog.title}
          </h1>
        </header>

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none f-mono text-sm md:text-base leading-relaxed opacity-80" style={{ color: "var(--color-text)" }}>
          <MDXRemote source={blog.content} />
        </article>
      </div>
    </main>
  );
}
