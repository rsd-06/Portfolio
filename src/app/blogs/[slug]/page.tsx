import { getBlogBySlug, getBlogSlugs, getAllBlogs, sourceUrl, toSummary } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Metadata } from "next";
import { isValidElement, type ReactNode } from "react";
import { CodeBlock } from "@/components/blogs/CodeBlock";
import BlogTOC from "@/components/blogs/BlogTOC";
import ScrollProgressTracker from "@/components/about/ScrollProgressTracker";
import JsonLd from "@/components/seo/JsonLd";
import { AUTHOR, absoluteUrl, blogCardUrl, pageMetadata } from "@/lib/seo";
import { ShareButton } from "@/components/blogs/ShareSheet";
import PostSources from "@/components/blogs/PostSources";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const blog = getBlogBySlug(params.slug);
    return pageMetadata({
      path: `/blogs/${blog.slug}`,
      title: blog.title,
      description: blog.excerpt,
      eyebrow: blog.category,
      article: { publishedTime: blog.date, tags: [blog.category] },
      image: blogCardUrl(blog.slug),
      alternates: { "text/markdown": `/blogs/${blog.slug}.md` },
    });
  } catch {
    return { title: "Blog Not Found" };
  }
}

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

export default async function BlogDetailPage(props: Props) {
  let blog;
  try {
    const params = await props.params;
    blog = getBlogBySlug(params.slug);
  } catch {
    notFound();
  }

  const allBlogs = getAllBlogs();
  const currentIndex = allBlogs.findIndex(b => b.slug === blog.slug);
  const nextBlog = currentIndex >= 0 && currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;

  const extractText = (children: ReactNode): string => {
    if (typeof children === 'string' || typeof children === 'number') return String(children);
    if (Array.isArray(children)) return children.map(extractText).join('');
    if (isValidElement<{ children?: ReactNode }>(children)) return extractText(children.props.children);
    return '';
  };

  const generateId = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const headingLines = blog.content.split('\n').filter(line => line.startsWith('## ') || line.startsWith('### '));
  const headings = headingLines.map(line => {
    const level = line.startsWith('### ') ? 3 : 2;
    const text = line.replace(/^#+\s/, '');
    return { level, text, id: generateId(text) };
  });

  const sharePost = toSummary(blog);
  const url = absoluteUrl(`/blogs/${blog.slug}`);
  const wordCount = blog.content.split(/\s+/).filter(Boolean).length;

  const components = {
    pre: CodeBlock,
    h2: ({ children }: { children?: ReactNode }) => <h2 id={generateId(extractText(children))} className="text-3xl font-semibold mt-24 mb-10 tracking-tight text-text-primary">{children}</h2>,
    h3: ({ children }: { children?: ReactNode }) => <h3 id={generateId(extractText(children))} className="text-xl md:text-2xl font-medium mt-16 mb-6 tracking-tight text-text-primary opacity-90">{children}</h3>,
  };

  return (
    <main className="min-h-screen bg-base-bg text-text-primary pt-[var(--nav-h,120px)] pb-32 px-[var(--page-px)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#post`,
              headline: blog.title,
              description: blog.excerpt,
              datePublished: blog.date,
              dateModified: blog.date,
              url,
              mainEntityOfPage: url,
              articleSection: blog.category,
              keywords: blog.category,
              wordCount,
              timeRequired: `PT${parseInt(blog.readTime, 10) || 5}M`,
              image: { "@type": "ImageObject", url: absoluteUrl(blogCardUrl(blog.slug)), width: 1200, height: 630 },
              author: { "@type": "Person", "@id": `${absoluteUrl("/")}/#person`, name: AUTHOR, url: absoluteUrl("/") },
              publisher: { "@type": "Person", "@id": `${absoluteUrl("/")}/#person`, name: AUTHOR },
              isPartOf: { "@type": "Blog", name: "rsd.exe — Blogs", url: absoluteUrl("/blogs") },
              inLanguage: "en-IN",
              encoding: { "@type": "MediaObject", encodingFormat: "text/markdown", contentUrl: absoluteUrl(`/blogs/${blog.slug}.md`) },
              ...(blog.sources.length ? { isBasedOn: blog.sources.map(sourceUrl) } : {}),
              ...(blog.sources.some((s) => s.type === "youtube")
                ? {
                    video: blog.sources.flatMap((s) =>
                      s.type === "youtube"
                        ? [{
                            "@type": "VideoObject",
                            name: s.title,
                            ...(s.creator ? { author: { "@type": "Organization", name: s.creator } } : {}),
                            embedUrl: `https://www.youtube-nocookie.com/embed/${s.id}`,
                            contentUrl: `https://www.youtube.com/watch?v=${s.id}`,
                            thumbnailUrl: `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`,
                          }]
                        : []
                    ),
                  }
                : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Blogs", item: absoluteUrl("/blogs") },
                { "@type": "ListItem", position: 3, name: blog.title, item: url },
              ],
            },
          ],
        }}
      />
      <ScrollProgressTracker />
      <div className="flex flex-col gap-16">
        {/* Back Link */}
        <Link 
          href="/blogs" 
          className="f-mono text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 w-fit"
        >
          ← Back to blogs
        </Link>

        {/* Header - Takes full horizontal space */}
        <header className="flex flex-col gap-8 border-b border-[color-mix(in_srgb,var(--color-text)_10%,transparent)] pb-16 pt-8">
          <div className="flex items-center justify-center gap-3 f-mono uppercase tracking-widest">
            <span className="text-xs opacity-60">{new Date(`${blog.date}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</span>
            <span className="text-xs opacity-60">·</span>
            <span className="opacity-90 font-medium text-text-primary text-base">[{blog.category}]</span>
            <span className="text-xs opacity-60">·</span>
            <span className="text-xs opacity-60">{blog.readTime}</span>
          </div>
          <h1 className="f-display text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] leading-tight text-center w-full">
            {blog.title}
          </h1>
          <div className="flex justify-center">
            <ShareButton post={sharePost} />
          </div>
        </header>

        {/* Content & TOC Layout */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-24 max-w-7xl mx-auto w-full justify-center">
          
          <article 
            className="w-full max-w-3xl font-sans text-lg md:text-xl opacity-90
              [&_p]:mb-10 [&_p]:leading-[1.8] [&_p]:font-light
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-10 [&_li]:mb-4 [&_li]:leading-[1.8] [&_li]:font-light
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-10
              [&_strong]:font-semibold 
              [&_a]:underline [&_a]:underline-offset-4 [&_a]:opacity-70 hover:[&_a]:opacity-100 [&_a]:transition-opacity
              [&_blockquote]:border-l-4 [&_blockquote]:border-text-primary [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:opacity-80 [&_blockquote]:my-10
              [&_code:not(pre_code)]:f-mono [&_code:not(pre_code)]:text-base [&_code:not(pre_code)]:bg-[color-mix(in_srgb,var(--color-text)_10%,transparent)] [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:rounded-md"
            style={{ color: "var(--color-text)" }}
          >
            <MDXRemote source={blog.content} components={components} />
            <PostSources sources={blog.sources} />
            <div className="mt-16 pt-8 border-t border-[color-mix(in_srgb,var(--color-text)_10%,transparent)] flex flex-wrap items-center justify-between gap-4">
              <p className="f-accent text-lg opacity-70 !mb-0">Found this useful? Pass it on.</p>
              <ShareButton post={sharePost} />
            </div>
          </article>

          {/* TOC Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <BlogTOC headings={headings} />
          </aside>
          
          
        </div>

        {/* Bottom nav: previous left, back to blogs centred, next right. On
            phones previous/next share a row and "back" sits centred below. */}
        <nav
          aria-label="More posts"
          className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 items-start w-full border-t border-[color-mix(in_srgb,var(--color-text)_10%,transparent)] mt-12 pt-12 pb-8 max-w-7xl mx-auto"
        >
          <div className="flex justify-start text-left">
            {prevBlog ? (
              <Link href={`/blogs/${prevBlog.slug}`} className="f-mono text-sm uppercase tracking-widest opacity-90 hover:opacity-100 transition-opacity flex flex-col items-start gap-2">
                <span className="opacity-70 font-medium">← Previous</span>
                <span className="text-base font-bold">[{prevBlog.title}]</span>
              </Link>
            ) : (
              <span className="f-mono text-sm uppercase tracking-widest opacity-50 font-medium">Start of Blogs</span>
            )}
          </div>
          <div className="col-span-2 md:col-span-1 order-last md:order-none flex justify-center self-center">
            <Link href="/blogs" className="f-mono text-sm uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity font-medium inline-flex items-center min-h-[44px]">
              Back to blogs
            </Link>
          </div>
          <div className="flex justify-end text-right">
            {nextBlog ? (
              <Link href={`/blogs/${nextBlog.slug}`} className="f-mono text-sm uppercase tracking-widest opacity-90 hover:opacity-100 transition-opacity flex flex-col items-end gap-2">
                <span className="opacity-70 font-medium">Next →</span>
                <span className="text-base font-bold">[{nextBlog.title}]</span>
              </Link>
            ) : (
              <span className="f-mono text-sm uppercase tracking-widest opacity-50 font-medium">End of Blogs</span>
            )}
          </div>
        </nav>

      </div>
    </main>
  );
}
