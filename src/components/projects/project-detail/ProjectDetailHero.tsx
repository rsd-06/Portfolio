"use client";

import { Project } from "@/data/projects";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { FiArrowUpRight } from "react-icons/fi";
import RepoActivityGrid from "./RepoActivityGrid";

export default function ProjectDetailHero({ project }: { project: Project }) {
  const titleText = project.title.split("");

  return (
    <section className="pt-32 pb-16 px-[var(--page-px)]">
      <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs opacity-45 hover:opacity-100 transition-opacity mb-8 min-h-[44px] group">
        <span className="transform transition-transform group-hover:-translate-x-1">←</span> Back to Projects
      </Link>

      <div className="flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-baseline gap-2"
          >
            <span className="font-mono text-[10px] opacity-30">{project.index}/</span>
          </motion.div>
          
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-light tracking-[-0.04em] leading-[0.95] overflow-hidden flex flex-wrap">
            {titleText.map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: "100%", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.8,
                  ease: [0.19, 1, 0.22, 1],
                  delay: 0.2 + index * 0.03,
                }}
                className="inline-block origin-top"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="w-full h-[1px] bg-[var(--color-border)] origin-left"
        />

        <div className="flex flex-col md:flex-row gap-12 md:gap-8 justify-between">
          {/* Left Column */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col gap-1"
            >
              <span className="font-mono text-[10px] opacity-40 tracking-widest uppercase">{project.category}</span>
              <span className="font-mono text-[10px] opacity-30">{project.year}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col gap-2 max-w-[200px]"
            >
              <div className="flex justify-between font-mono text-[10px] opacity-60">
                <span>Status: {project.status}</span>
              </div>
              <div className="flex justify-between font-mono text-[10px] opacity-60">
                <span>Completion: {project.completion}%</span>
              </div>
              <div className="h-[1px] w-full bg-[var(--color-border)] opacity-40 mt-1">
                <div 
                  className="h-full bg-[var(--color-text)] opacity-80"
                  style={{ width: `${project.completion}%` }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-wrap gap-2 mt-2"
            >
              {project.techStack.flatMap(ts => ts.items).slice(0, 5).map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.04 }}
                  className="font-mono text-[10px] border border-[var(--color-border)] rounded-full px-2.5 py-0.5 opacity-65"
                >
                  {tech}
                </motion.span>
              ))}
              {project.techStack.flatMap(ts => ts.items).length > 5 && (
                <span className="font-mono text-[10px] border border-transparent px-1 py-0.5 opacity-40">
                  +{project.techStack.flatMap(ts => ts.items).length - 5} more
                </span>
              )}
            </motion.div>

            {/* Repo Activity under Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
              className="mt-4"
            >
              <RepoActivityGrid repoUrl={project.repoUrl} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2 flex flex-col gap-8 md:items-end md:text-right">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="font-accent italic text-lg md:text-xl opacity-60 max-w-[400px]"
            >
              "{project.tagline}"
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col gap-3 md:items-end"
            >
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs opacity-55 hover:opacity-100 transition-opacity"
              >
                <SiGithub /> View Repo →
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs opacity-55 hover:opacity-100 transition-opacity"
                >
                  <FiArrowUpRight /> Live Demo →
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
