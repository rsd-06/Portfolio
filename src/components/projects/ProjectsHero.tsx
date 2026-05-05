"use client";

import { motion } from "framer-motion";
import GitHubActivityGrid from "./GitHubActivityGrid";

export default function ProjectsHero() {
  return (
    <section className="pt-48 pb-12 w-full flex flex-col px-[var(--page-px)] relative">
      {/* Title — matches About page: absolute top-32, f-display text-5xl */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="absolute top-32 left-[var(--page-px)]"
      >
        <h1 className="f-display text-7xl">Projects</h1>
      </motion.div>

      {/* Rule — matches About page */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="w-full h-[1px] bg-[var(--color-border)] mt-8 md:mt-12 origin-left"
      />

      {/* Stats row + GitHub grid */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 mt-12">
        {/* Left Column Stats */}
        <div className="flex md:flex-col gap-12 md:gap-8 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col gap-1"
          >
            <span className="f-mono text-xs opacity-45 uppercase tracking-wider">Total Projects</span>
            <span className="f-display text-2xl">06</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col gap-1"
          >
            <span className="f-mono text-xs opacity-45 uppercase tracking-wider">Featured</span>
            <span className="f-display text-2xl">03</span>
          </motion.div>
        </div>

        {/* Right Column — GitHub Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex-1"
        >
          <GitHubActivityGrid />
        </motion.div>
      </div>
    </section>
  );
}
