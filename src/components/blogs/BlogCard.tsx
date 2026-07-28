"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/mdx";
import { useState } from "react";

export default function BlogCard({ blog }: { blog: BlogPost }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="group relative flex flex-col gap-4 py-8 border-b border-[color-mix(in_srgb,var(--color-text)_10%,transparent)]"
        style={{ cursor: "pointer" }}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <h3 
              className="f-display text-3xl md:text-4xl transition-colors duration-300"
              style={{
                color: hovered ? "var(--color-text)" : "color-mix(in srgb, var(--color-text) 80%, transparent)",
                letterSpacing: "-0.02em"
              }}
            >
              {blog.title}
            </h3>
            
            <p 
              className="f-mono text-sm leading-relaxed"
              style={{
                color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {blog.excerpt}
            </p>
          </div>

          <div 
            className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-2 f-mono text-xs uppercase tracking-widest shrink-0"
            style={{ color: "color-mix(in srgb, var(--color-text) 50%, transparent)" }}
          >
            <span>{new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-text-primary opacity-30 hidden md:block"></span>
              {blog.category}
            </span>
            <span>{blog.readTime}</span>
          </div>
        </div>

        {/* Subtle Animated Hover Underline */}
        <motion.div 
          className="absolute bottom-[-1px] left-0 h-[1px] bg-text-primary"
          initial={{ width: "0%" }}
          animate={{ width: hovered ? "100%" : "0%" }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        />
      </motion.div>
    </Link>
  );
}
