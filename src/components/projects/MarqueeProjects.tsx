"use client";

import { Project } from "@/data/projects";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MarqueeProjects({ projects }: { projects: Project[] }) {
  // We duplicate projects to ensure continuous scrolling
  const marqueeItemsRow1 = [...projects, ...projects, ...projects, ...projects];
  const marqueeItemsRow2 = [...projects].reverse();
  const marqueeItemsRow2Extended = [...marqueeItemsRow2, ...marqueeItemsRow2, ...marqueeItemsRow2, ...marqueeItemsRow2];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="pb-32 overflow-hidden flex flex-col gap-12 group/marquee-section"
    >
      {/* Row 1: Left scrolling */}
      <div className="relative flex whitespace-nowrap">
        <motion.div
          className="flex gap-[clamp(3rem,6vw,6rem)] min-w-max hover:[animation-play-state:paused]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
        >
          {marqueeItemsRow1.map((project, idx) => (
            <Link
              key={`${project.slug}-${idx}`}
              href={`/projects/${project.slug}`}
              className="flex items-center gap-4 opacity-100 transition-opacity duration-300 group-hover/marquee-section:opacity-35 hover:!opacity-100"
            >
              <h2 className="font-display text-4xl md:text-6xl font-light">{project.title}</h2>
              <span className="font-mono text-xs opacity-50 mt-2 md:mt-4">·</span>
              <span className="font-mono text-xs opacity-50 uppercase tracking-widest mt-2 md:mt-4">{project.category}</span>
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="w-full h-[1px] bg-[var(--color-border)] opacity-30" />

      {/* Row 2: Right scrolling */}
      <div className="relative flex whitespace-nowrap">
        <motion.div
          className="flex gap-[clamp(3rem,6vw,6rem)] min-w-max hover:[animation-play-state:paused]"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
        >
          {marqueeItemsRow2Extended.map((project, idx) => (
            <Link
              key={`${project.slug}-${idx}`}
              href={`/projects/${project.slug}`}
              className="flex items-center gap-4 opacity-100 transition-opacity duration-300 group-hover/marquee-section:opacity-35 hover:!opacity-100"
            >
              <h2 className="font-display text-4xl md:text-6xl font-light">{project.title}</h2>
              <span className="font-mono text-xs opacity-50 mt-2 md:mt-4">·</span>
              <span className="font-mono text-xs opacity-50 uppercase tracking-widest mt-2 md:mt-4">{project.category}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
