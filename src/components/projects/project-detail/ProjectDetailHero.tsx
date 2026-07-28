"use client";

import { Project } from "@/data/projects";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { FiArrowUpRight } from "react-icons/fi";
import RepoActivityGrid from "./RepoActivityGrid";

export default function ProjectDetailHero({ project }: { project: Project }) {
  const words = project.title.split(" ");

  return (
    <section className="pt-32 pb-16 px-[var(--page-px)]">
      <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs opacity-45 hover:opacity-100 transition-opacity mb-8 min-h-[44px] group">
        <span className="transform transition-transform group-hover:-translate-x-1">←</span> Back to Projects
      </Link>

      <div className="flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
          <div className="flex flex-col gap-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-baseline gap-2"
            >
              <span className="font-mono text-[10px] opacity-30">{project.index}/</span>
            </motion.div>
            
            <h1 className="f-display text-[clamp(4rem,10vw,8rem)] font-light tracking-[-0.04em] leading-[0.95] overflow-hidden flex flex-wrap">
              {words.map((word, wIdx) => {
                const startIndex = project.title.split(" ").slice(0, wIdx).join(" ").length + (wIdx > 0 ? 1 : 0);
                return (
                  <span key={wIdx} className="inline-flex whitespace-nowrap">
                    {word.split("").map((char, cIdx) => (
                      <motion.span
                        key={cIdx}
                        initial={{ y: "100%", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 0.8,
                          ease: [0.19, 1, 0.22, 1],
                          delay: 0.2 + (startIndex + cIdx) * 0.03,
                        }}
                        className="inline-block origin-top"
                      >
                        {char}
                      </motion.span>
                    ))}
                    {wIdx !== words.length - 1 && (
                      <motion.span
                        initial={{ y: "100%", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 0.8,
                          ease: [0.19, 1, 0.22, 1],
                          delay: 0.2 + (startIndex + word.length) * 0.03,
                        }}
                        className="inline-block origin-top"
                      >
                        {"\u00A0"}
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col gap-2 md:items-end pb-2 hidden md:flex"
          >
            {[
              { id: "overview", label: "Overview" },
              { id: "problem", label: "Problem" },
              { id: "objective", label: "Objective" },
              { id: "approach", label: "Approach" },
              { id: "solution", label: "Solution" },
              { id: "stack", label: "Stack" },
              { id: "achievement", label: "Achievement" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex flex-row-reverse md:flex-row items-center gap-3 font-mono text-[11px] md:text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                <span className="w-4 h-[1px] bg-current opacity-30 group-hover:opacity-100 group-hover:w-8 transition-all duration-300" />
                {item.label}
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="w-[100vw] h-[1px] bg-[var(--color-border)] origin-left relative left-[calc(var(--page-px)*-1)]"
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
              <span className="font-mono text-xs md:text-sm opacity-40 tracking-widest uppercase">{project.category}</span>
              <span className="font-mono text-xs md:text-sm opacity-30">{project.year}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col gap-2 max-w-[240px]"
            >
              <div className="flex justify-between font-mono text-xs opacity-60">
                <span>Status: {project.status}</span>
              </div>
              <div className="flex justify-between font-mono text-xs opacity-60">
                <span>Completion: {project.completion}%</span>
              </div>
              <div className="h-[2px] w-full bg-[var(--color-border)] opacity-40 mt-1">
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
                  className="font-mono text-xs md:text-sm border border-[var(--color-border)] rounded-full px-3 py-1 opacity-65"
                >
                  {tech}
                </motion.span>
              ))}
              {project.techStack.flatMap(ts => ts.items).length > 5 && (
                <span className="font-mono text-xs md:text-sm border border-transparent px-1 py-1 opacity-40">
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
              <RepoActivityGrid repoUrl={project.repoUrl} boxSize={18} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2 flex flex-col gap-8 md:items-end md:text-right">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="f-accent italic text-xl md:text-2xl lg:text-3xl opacity-60 max-w-[400px]"
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
