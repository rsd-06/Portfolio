import { getAllBlogs, toSummary } from "@/lib/mdx";
import BlogsLayout from "@/components/blogs/BlogsLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/blogs",
  title: "Blogs",
  description:
    "Writing by Sudharshan R on software engineering, computer science fundamentals, AI, startups, philosophy and the ideas behind them.",
  eyebrow: "writing",
});

export default function BlogsPage() {
  // Summaries only: the list is a client component, and passing whole posts
  // shipped every post body to the browser.
  const blogs = getAllBlogs().map(toSummary);

  return (
    <main className="min-h-screen bg-base-bg text-text-primary overflow-hidden relative">
      <BlogsLayout initialBlogs={blogs} />
    </main>
  );
}
