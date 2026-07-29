"use client";

import { Project } from "@/data/projects";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SiGithub } from "react-icons/si";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Play/pause video on hover — useEffect avoids the hydration mismatch
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovered) {
      video.play().catch(() => {/* ignore AbortError on rapid hover */});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered]);

  const getStatusOpacity = (status: string) => {
    switch (status) {
      case "Completed": return "opacity-90";
      case "Ongoing": return "opacity-50";
      default: return "opacity-70"; // Incubator + others
    }
  };

  const isIncubator = project.status.toLowerCase().includes("incubat");

  return (
    <motion.article
      ref={cardRef}
      initial={{ y: 40, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
      transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
      className="relative flex flex-col gap-4 group transition-colors duration-300 border border-transparent hover:border-[var(--color-border)] rounded-lg p-2 -m-2 cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {project.title}</span>
      </Link>

      {/* Media */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md bg-[var(--color-border)]">
        {project.video ? (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.images[0]}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-105"
          />
        ) : (
          <img
            src={project.images[0]}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-105"
          />
        )}

        {/* Status Indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-2 group/status z-20">
          <div
            className={`w-1.5 h-1.5 rounded-full bg-[var(--color-text)] ${getStatusOpacity(project.status)} ${isIncubator ? "animate-pulse" : ""}`}
          />
          <span className="f-mono text-[9px] opacity-0 group-hover/status:opacity-60 transition-opacity whitespace-nowrap bg-[var(--color-bg)] px-1.5 py-0.5 rounded">
            {project.status}
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="flex flex-col gap-1 mt-1 pb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="f-mono text-[10px] opacity-30">{project.index}/</span>
          <span className="f-mono text-[10px] opacity-30">{project.year}</span>
        </div>

        <h2 className="f-display text-xl">{project.title}</h2>
        <span className="f-mono text-[10px] opacity-45 tracking-wide uppercase">{project.category}</span>

        <p className="f-accent italic text-sm opacity-55 mt-2">{project.tagline}</p>

        {/* Completion bar */}
        <div className="flex items-center gap-3 mt-3 mb-1 w-40">
          <div className="flex-1 h-[2px]" style={{ backgroundColor: "var(--color-border)", opacity: 0.5 }}>
            <div
              className="h-full transition-all duration-700 ease-out"
              style={{
                width: `${project.completion}%`,
                backgroundColor: "var(--color-text)",
                opacity: 0.85,
              }}
            />
          </div>
          <span className="f-mono text-[9px] opacity-60">{project.completion}%</span>
        </div>

        <div className="flex justify-between items-end mt-2 pt-2">
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="f-mono text-[9px] border border-[var(--color-border)] rounded-full px-2.5 py-0.5 opacity-65"
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="f-mono text-[10px] opacity-45 hover:opacity-100 flex items-center gap-1 z-20 min-h-[44px] px-2 -mr-2 transition-opacity relative"
          >
            <SiGithub className="shrink-0" /> repo →
          </a>
        </div>
      </div>

      {/* Custom follow cursor */}
      {isHovered && (
        <div
          className="fixed pointer-events-none z-[200] f-mono text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap"
          style={{
            left: mousePos.x + 16,
            top: mousePos.y + 16,
            backgroundColor: "var(--color-text)",
            color: "var(--color-bg)",
          }}
        >
          View →
        </div>
      )}
    </motion.article>
  );
}
