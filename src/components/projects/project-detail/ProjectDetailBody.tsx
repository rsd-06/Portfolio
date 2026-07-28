"use client";

import { Project } from "@/data/projects";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ProjectDetailMedia from "./ProjectDetailMedia";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <motion.section
    id={id}
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    className="py-[clamp(2rem,4vw,3rem)] px-[clamp(2rem,4vw,3rem)] flex flex-col gap-4 md:gap-6"
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

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [pct, setPct] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setPct(Math.round(v * 100)));
  }, [scrollYProgress]);

  const approachPoints = project.approach
    .split(". ")
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim() + (s.endsWith(".") ? "" : "."));

  return (
    <div className="flex flex-col lg:flex-row relative">
      {/* Left — media panel */}
      <div className="w-full lg:w-1/2 relative border-b lg:border-b-0 lg:border-r border-[var(--color-border)] border-opacity-30">
        <ProjectDetailMedia images={project.images} video={project.video} />
      </div>

      {/* Right — scrolling content */}
      <div className="w-full lg:w-1/2 flex flex-row relative pt-8 lg:pt-0" ref={containerRef}>
        
        {/* ── Content ── */}
        <div className="flex-1 flex flex-col">
          <Section id="overview" title="Overview">
            <p className="f-mono text-base opacity-70 leading-relaxed max-w-[52ch]">
              {project.summary}
            </p>
          </Section>

          <Section id="problem" title="Problem">
            <blockquote className="f-accent italic text-lg opacity-60 leading-[1.55] max-w-[56ch] border-l border-[var(--color-border)] pl-6 py-2">
              "{project.problem}"
            </blockquote>
          </Section>

          <Section id="objective" title="Objective">
            <p className="f-mono text-base opacity-70 leading-relaxed max-w-[52ch]">
              {project.objective}
            </p>
          </Section>

          <Section id="approach" title="Approach">
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

          <Section id="solution" title="Solution">
            <p className="f-mono text-base opacity-70 leading-relaxed max-w-[52ch]">
              {project.solution}
            </p>
          </Section>

          <Section id="stack" title="Stack">
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

          <Section id="achievement" title="Achievement">
            <p className="f-display text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.02em] leading-[1.3] opacity-85 max-w-[40ch]">
              {project.achievement}
            </p>
          </Section>

          <Section id="completion" title="Completion">
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

        {/* ── Tracker column ── */}
        <div className="hidden md:block sticky top-[var(--nav-h)] h-[calc(100dvh-var(--nav-h))] shrink-0 w-[clamp(3.5rem,5vw,5rem)] border-l border-[var(--color-border)] border-opacity-10 z-10">
          <div className="relative w-full h-full py-[clamp(4rem,8vw,6rem)]">
            <div className="relative w-full h-full">
              {/* Ghost track */}
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[var(--color-border)] opacity-20" />
              
              {/* Progress fill */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[1px] bg-[var(--color-text)] opacity-40 origin-top"
                style={{ scaleY }}
              />

              {/* Dot + percentage */}
              <motion.div
                className="absolute left-0 flex items-center gap-[6px] pointer-events-none"
                style={{ top: dotTop, translateY: "-50%" }}
              >
                <div className="w-[5px] h-[5px] rounded-full bg-[var(--color-text)] opacity-50 shrink-0 -ml-[2px]" />
                <span className="f-mono text-[8px] tracking-[0.04em] opacity-40 min-w-[24px] text-left">
                  {pct}%
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
