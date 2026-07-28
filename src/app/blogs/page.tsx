import { getAllBlogs } from "@/lib/mdx";
import BlogsLayout from "@/components/blogs/BlogsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Blogs and thoughts on software engineering, design, and life.",
};

export default function BlogsPage() {
  const blogs = getAllBlogs();

  return (
    <main className="min-h-screen bg-base-bg text-text-primary overflow-hidden relative">
      <BlogsLayout initialBlogs={blogs} />
    </main>
  );
}
