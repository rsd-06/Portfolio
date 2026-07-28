"use client";

import { Project } from "@/data/projects";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectDetailNav({
  prev,
  next,
}: {
  prev: Project | null;
  next: Project | null;
}) {
  return (
    <section className="w-full border-t border-[var(--color-border)]">
      <div className="flex flex-col md:flex-row min-h-[clamp(12rem,20vw,18rem)]">
        {/* Previous Project */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[var(--color-border)] relative group overflow-hidden">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="absolute inset-0 p-[var(--page-px)] flex flex-col justify-center gap-4 z-10">
              <span className="font-mono text-[10px] opacity-35">← Previous</span>
              <h3 className="font-display text-3xl md:text-5xl font-light tracking-[-0.03em]">{prev.title}</h3>
            </Link>
          ) : (
            <Link href="/projects" className="absolute inset-0 p-[var(--page-px)] flex flex-col justify-center gap-4 z-10">
              <span className="font-mono text-[10px] opacity-35">← All</span>
              <h3 className="font-display text-3xl md:text-5xl font-light tracking-[-0.03em]">Projects</h3>
            </Link>
          )}

          {/* Hover Background Image */}
          {prev && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.25] transition-opacity duration-500 bg-[var(--color-border)]">
              <img src={prev.images[0]} alt="" className="w-full h-full object-cover blur-[4px]" />
            </div>
          )}
        </div>

        {/* Next Project */}
        <div className="w-full md:w-1/2 relative group overflow-hidden">
          {next ? (
            <Link href={`/projects/${next.slug}`} className="absolute inset-0 p-[var(--page-px)] flex flex-col justify-center items-end gap-4 z-10 text-right">
              <span className="font-mono text-[10px] opacity-35">Next →</span>
              <h3 className="font-display text-3xl md:text-5xl font-light tracking-[-0.03em]">{next.title}</h3>
            </Link>
          ) : (
            <Link href="/projects" className="absolute inset-0 p-[var(--page-px)] flex flex-col justify-center items-end gap-4 z-10 text-right">
              <span className="font-mono text-[10px] opacity-35">All →</span>
              <h3 className="font-display text-3xl md:text-5xl font-light tracking-[-0.03em]">Projects</h3>
            </Link>
          )}

          {/* Hover Background Image */}
          {next && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.25] transition-opacity duration-500 bg-[var(--color-border)]">
              <img src={next.images[0]} alt="" className="w-full h-full object-cover blur-[4px]" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
