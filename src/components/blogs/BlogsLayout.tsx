"use client";

import { useState, useMemo } from "react";
import { BlogPost } from "@/lib/mdx";
import BlogCard from "./BlogCard";
import { motion } from "framer-motion";
import ScrollProgressTracker from "@/components/about/ScrollProgressTracker";

export default function BlogsLayout({ initialBlogs }: { initialBlogs: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const categories = ["All", ...Array.from(new Set(initialBlogs.map(b => b.category)))];

  const filteredAndSortedBlogs = useMemo(() => {
    let result = initialBlogs;

    if (selectedCategory !== "All") {
      result = result.filter(b => b.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q));
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [initialBlogs, searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen pt-[calc(var(--nav-h,120px)+4rem)] px-[var(--page-px)] pb-32">
      <ScrollProgressTracker />

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-16">
        {/* Header section */}
        <div className="flex flex-col gap-6">
          <h1 className="f-display text-5xl md:text-7xl font-light tracking-[-0.03em]">
            Blogs & Thoughts
          </h1>
          <p className="f-mono text-sm md:text-base opacity-60 max-w-2xl">
            A collection of technical articles, design thoughts, and personal musings.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between border-y border-[color-mix(in_srgb,var(--color-text)_10%,transparent)] py-6 sticky top-[var(--nav-h,120px)] bg-base-bg z-40 backdrop-blur-md bg-opacity-90">
          
          <div className="flex flex-wrap items-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="f-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300"
                style={{
                  borderColor: selectedCategory === cat ? "var(--color-text)" : "color-mix(in srgb, var(--color-text) 15%, transparent)",
                  backgroundColor: selectedCategory === cat ? "var(--color-text)" : "transparent",
                  color: selectedCategory === cat ? "var(--color-base-bg)" : "var(--color-text)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="f-mono text-sm bg-transparent border-b border-[color-mix(in_srgb,var(--color-text)_20%,transparent)] px-2 py-1 outline-none focus:border-text-primary transition-colors"
              style={{ color: "var(--color-text)" }}
            />
            <button 
              onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
              className="f-mono text-xs uppercase tracking-widest px-3 py-1 border border-[color-mix(in_srgb,var(--color-text)_15%,transparent)] rounded-full hover:bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)] transition-colors"
            >
              {sortOrder}
            </button>
          </div>
        </div>

        {/* Blog List */}
        <div className="flex flex-col">
          {filteredAndSortedBlogs.length > 0 ? (
            filteredAndSortedBlogs.map((blog, idx) => (
              <motion.div 
                key={blog.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center f-mono text-sm opacity-50">
              No blogs found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
