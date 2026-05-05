"use client";

import { Project } from "@/data/projects";
import { useScroll, motion } from "framer-motion";
import { useRef } from "react";
import ProjectDetailMedia from "./ProjectDetailMedia";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.section
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    className="py-[clamp(4rem,8vw,6rem)] px-[clamp(2rem,4vw,3rem)] flex flex-col gap-8 md:gap-12"
  >
    <h2 className="f-mono text-[10px] tracking-widest uppercase opacity-35">{title}</h2>
    {children}
  </motion.section>
);

export default function ProjectDetailBody({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const approachPoints = project.approach
    .split(". ")
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim() + (s.endsWith(".") ? "" : "."));

  return (
    <div className="flex flex-col lg:flex-row relative" ref={containerRef}>
      {/* Left — sticky media */}
      <div className="w-full lg:w-1/2 relative lg:h-[calc(100dvh-var(--nav-h))]">
        <ProjectDetailMedia images={project.images} video={project.video} scrollProgress={scrollYProgress} />
      </div>

      {/* Right — scrolling content */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 lg:pt-0">

        <Section title="Overview">
          <p className="f-mono text-base opacity-70 leading-relaxed max-w-[52ch]">
            {project.summary}
          </p>
        </Section>

        <Section title="Problem">
          <blockquote className="f-accent italic text-lg opacity-60 leading-[1.55] max-w-[56ch] border-l border-[var(--color-border)] pl-6 py-2">
            "{project.problem}"
          </blockquote>
        </Section>

        <Section title="Objective">
          <p className="f-mono text-base opacity-70 leading-relaxed max-w-[52ch]">
            {project.objective}
          </p>
        </Section>

        <Section title="Approach">
          <div className="flex flex-col gap-8">
            <p className="f-mono text-base opacity-70 leading-relaxed max-w-[52ch]">
              {project.approach}
            </p>
            <ul className="flex flex-col gap-4">
              {approachPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-4 f-display text-xl md:text-2xl">
                  <span className="opacity-40 mt-1 text-lg shrink-0">→</span>
                  <span className="opacity-80">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="Solution">
          <p className="f-mono text-base opacity-70 leading-relaxed max-w-[52ch]">
            {project.solution}
          </p>
        </Section>

        <Section title="Stack">
          <div className="flex flex-col gap-6 w-full max-w-[52ch]">
            {project.techStack.map((stack, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                <span className="f-mono text-[10px] opacity-30 tracking-wide uppercase min-w-[80px]">
                  {stack.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {stack.items.map((item, i) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03, duration: 0.4 }}
                      className="f-mono text-[10px] border border-[var(--color-border)] rounded-full px-3 py-1 opacity-65"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Achievement">
          <p className="f-display text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.02em] leading-[1.3] opacity-85 max-w-[40ch]">
            {project.achievement}
          </p>
        </Section>

        <Section title="Completion">
          <div className="flex flex-col gap-4 w-full">
            <div className="h-[1px] w-full bg-[var(--color-border)] opacity-30">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: project.completion / 100 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="h-full bg-[var(--color-text)] origin-left"
              />
            </div>
            <div className="flex justify-between f-mono text-[10px] opacity-35 uppercase tracking-wide">
              <span>{project.status}</span>
              <span>{project.completion}%</span>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}
