import { getBlogBySlug, getBlogSlugs, getAllBlogs } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Metadata } from "next";
import { CodeBlock } from "@/components/blogs/CodeBlock";
import BlogTOC from "@/components/blogs/BlogTOC";
import ScrollProgressTracker from "@/components/about/ScrollProgressTracker";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
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

export default async function BlogDetailPage(props: Props) {
  let blog;
  try {
    const params = await props.params;
    blog = getBlogBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  const allBlogs = getAllBlogs();
  const currentIndex = allBlogs.findIndex(b => b.slug === blog.slug);
  const nextBlog = currentIndex >= 0 && currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  const extractText = (children: any): string => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(extractText).join('');
    if (children?.props?.children) return extractText(children.props.children);
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

  const components = {
    pre: CodeBlock,
    h2: ({ children }: any) => <h2 id={generateId(extractText(children))} className="text-3xl font-semibold mt-24 mb-10 tracking-tight text-text-primary">{children}</h2>,
    h3: ({ children }: any) => <h3 id={generateId(extractText(children))} className="text-xl md:text-2xl font-medium mt-16 mb-6 tracking-tight text-text-primary opacity-90">{children}</h3>,
  };

  return (
    <main className="min-h-screen bg-base-bg text-text-primary pt-[var(--nav-h,120px)] pb-32 px-[var(--page-px)]">
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
            <span className="text-xs opacity-60">{new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="text-xs opacity-60">·</span>
            <span className="opacity-90 font-medium text-text-primary text-base">[{blog.category}]</span>
            <span className="text-xs opacity-60">·</span>
            <span className="text-xs opacity-60">{blog.readTime}</span>
          </div>
          <h1 className="f-display text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] leading-tight text-center w-full">
            {blog.title}
          </h1>
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
          </article>

          {/* TOC Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <BlogTOC headings={headings} />
          </aside>
          
          
        </div>

        {/* Bottom Nav */}
        <div className="flex w-full items-center justify-between border-t border-[color-mix(in_srgb,var(--color-text)_10%,transparent)] mt-12 pt-12 pb-8 max-w-7xl mx-auto">
          <div className="flex-1 hidden md:block" />
          <div className="flex-1 flex justify-start text-left md:justify-center md:text-center">
            {nextBlog ? (
              <Link href={`/blogs/${nextBlog.slug}`} className="f-mono text-sm uppercase tracking-widest opacity-90 hover:opacity-100 transition-opacity flex flex-col items-start md:items-center gap-2">
                <span className="opacity-70 font-medium">Next</span>
                <span className="text-base font-bold">[{nextBlog.title}]</span>
              </Link>
            ) : (
              <span className="f-mono text-sm uppercase tracking-widest opacity-70 font-medium">End of Blogs</span>
            )}
          </div>
          <div className="flex-1 flex justify-end text-right">
            <Link href="/blogs" className="f-mono text-sm uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity font-medium">
              Back to blogs →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
