"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

import { PROJECTS as ALL_PROJECTS } from "@/data/projects";

const PROJECTS = ALL_PROJECTS.filter(p => p.featured).map((p) => ({
  id: p.slug,
  index: p.index,
  title: p.title,
  category: p.category,
  year: p.year,
  tagline: p.tagline,
  problem: p.problem,
  objective: p.objective,
  stack: p.techStack.flatMap(ts => ts.items).slice(0, 8),
  achievement: p.achievement,
  status: p.status,
  completion: p.completion,
  image: p.images[0],
  video: p.video,
  href: `/projects/${p.slug}`,
}));

type Project = (typeof PROJECTS)[number];

/* ─── EXPO easing ─── */
const EXPO = [0.19, 1, 0.22, 1] as const;

/* ─── End Card ─── */
function EndCard() {
  return (
    <div
      className="flex-shrink-0 flex flex-col items-start justify-center"
      style={{ width: "70vw", padding: "0 var(--page-px)" }}
    >
      <h2
        className="f-display"
        style={{
          fontSize: "var(--text-3xl)",
          fontWeight: 300,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          opacity: 0.9,
          color: "var(--color-text)",
        }}
      >
        More where
        <br />
        that came from.
      </h2>
      <Link
        href="/projects"
        className="f-mono"
        style={{
          fontSize: "var(--text-sm)",
          letterSpacing: "0.1em",
          opacity: 0.55,
          marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "opacity 0.3s ease, gap 0.4s cubic-bezier(0.19,1,0.22,1)",
          minHeight: "44px",
          color: "var(--color-text)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
          (e.currentTarget as HTMLAnchorElement).style.gap = "1rem";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "0.55";
          (e.currentTarget as HTMLAnchorElement).style.gap = "0.5rem";
        }}
      >
        See all projects →
      </Link>
    </div>
  );
}

/* ─── Project Card ─── */
interface CardProps {
  project: Project;
  index: number;
  onOpen: (id: string) => void;
}

function ProjectCard({ project, onOpen }: CardProps) {
  const [hovered, setHovered] = useState(false);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(project.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} details`}
      onClick={() => onOpen(project.id)}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        flexShrink: 0,
        width: "clamp(280px, 85vw, 85vw)",
        height: "100dvh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        border: hovered ? "1px solid var(--color-border)" : "1px solid transparent",
        transition: "border-color 0.4s ease",
        outline: "none",
      }}
    >
      {/* Index — top right */}
      <span
        className="f-display"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "var(--page-px)",
          right: "var(--page-px)",
          fontSize: "var(--text-2xl)",
          fontWeight: 300,
          opacity: 0.12,
          color: "var(--color-text)",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {project.index}
      </span>

      {/* ── Left column ── */}
      <div
        style={{
          width: "38%",
          paddingLeft: "var(--page-px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(1rem, 2vw, 2rem)",
        }}
      >
        {/* Index + title */}
        <div>
          <p
            className="f-display"
            style={{
              fontSize: "var(--text-2xs)",
              opacity: 0.35,
              marginBottom: "0.4rem",
              color: "var(--color-text)",
            }}
          >
            {project.index}/
          </p>
          <h3
            className="f-display"
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--color-text)",
            }}
          >
            {project.title}
          </h3>
        </div>

        {/* Category */}
        <p
          className="f-mono"
          style={{
            fontSize: "var(--text-2xs)",
            letterSpacing: "0.14em",
            opacity: 0.45,
            color: "var(--color-text)",
          }}
        >
          {project.category}
        </p>

        {/* Tagline */}
        <p
          className="f-accent"
          style={{
            fontSize: "var(--text-md)",
            fontStyle: "italic",
            opacity: 0.6,
            lineHeight: 1.5,
            color: "var(--color-text)",
          }}
        >
          &ldquo;{project.tagline}&rdquo;
        </p>

        {/* View Project link */}
        <Link
          href={project.href}
          className="f-mono"
          onClick={(e) => e.stopPropagation()}
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.1em",
            opacity: 0.55,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            minHeight: "44px",
            color: "var(--color-text)",
            textDecoration: "none",
            transition: "opacity 0.3s ease, gap 0.4s cubic-bezier(0.19,1,0.22,1)",
          }}
        >
          <motion.span
            animate={{ x: hovered ? 8 : 0, opacity: hovered ? 1 : 0.55 }}
            transition={{ duration: 0.4, ease: EXPO }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            View Project →
          </motion.span>
        </Link>

        {/* Year */}
        <p
          className="f-mono"
          style={{
            fontSize: "var(--text-2xs)",
            opacity: 0.3,
            color: "var(--color-text)",
          }}
        >
          {project.year}
        </p>
      </div>

      {/* ── Right column — image ── */}
      <div
        style={{
          width: "52%",
          height: "75dvh",
          marginLeft: "auto",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <motion.div
          style={{ width: "100%", height: "100%", position: "relative" }}
          animate={{
            scale: hovered ? 1.03 : 1,
            filter: hovered ? "brightness(1.05)" : "brightness(1)",
          }}
          transition={{ duration: 0.6, ease: EXPO }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 92vw, 52vw"
          />
        </motion.div>
      </div>

      {/* ── Mobile layout override ── */}
      <style>{`
        @media (max-width: 767px) {
          [data-card-id="${project.id}"] {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 92vw !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Expanded Overlay ─── */
interface OverlayProps {
  project: Project | null;
  onClose: () => void;
}

function ExpandedOverlay({ project, onClose }: OverlayProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  /* Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Focus trap: focus close btn on open */
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (project) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(245,244,240,0.7)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} project details`}
            className="fixed z-50"
            style={{
              top: isMobile ? "2dvh" : "5dvh",
              left: isMobile ? "2vw" : "5vw",
              width: isMobile ? "96vw" : "90vw",
              height: isMobile ? "96dvh" : "90dvh",
              backgroundColor: "var(--color-bg)",
              borderRadius: "clamp(12px, 2vw, 24px)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              overflow: "hidden",
            }}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Close button */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute f-mono"
              style={{
                top: "1.5rem",
                right: "1.5rem",
                zIndex: 10,
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.16em",
                opacity: 0.5,
                minHeight: "44px",
                minWidth: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text)",
              }}
              aria-label="Close project details"
            >
              ✕ close
            </button>

            {/* ── LEFT — scrollable text ── */}
            <div
              style={{
                width: isMobile ? "100%" : "42%",
                height: isMobile ? "65%" : "100%",
                overflowY: "auto",
                padding: "clamp(2rem, 4vw, 3.5rem)",
                paddingTop: "clamp(3rem, 5vw, 4.5rem)",
                borderRight: isMobile ? "none" : "1px solid var(--color-border)",
                borderBottom: isMobile ? "1px solid var(--color-border)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
              }}
            >
              {/* Index + category */}
              <p
                className="f-mono"
                style={{
                  fontSize: "var(--text-2xs)",
                  letterSpacing: "0.18em",
                  opacity: 0.35,
                  color: "var(--color-text)",
                }}
              >
                {project.index} / {project.category}
              </p>

              {/* Title */}
              <h2
                className="f-display"
                style={{
                  fontSize: "var(--text-xl)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  color: "var(--color-text)",
                }}
              >
                {project.title}
              </h2>

              {/* Tagline */}
              <p
                className="f-accent"
                style={{
                  fontSize: "var(--text-md)",
                  fontStyle: "italic",
                  opacity: 0.6,
                  color: "var(--color-text)",
                }}
              >
                &ldquo;{project.tagline}&rdquo;
              </p>

              <div className="rule" />

              {/* Problem */}
              <div>
                <p
                  className="f-mono"
                  style={{
                    fontSize: "var(--text-2xs)",
                    letterSpacing: "0.16em",
                    opacity: 0.35,
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                    color: "var(--color-text)",
                  }}
                >
                  Problem
                </p>
                <p
                  className="f-mono"
                  style={{
                    fontSize: "var(--text-sm)",
                    opacity: 0.7,
                    lineHeight: 1.7,
                    color: "var(--color-text)",
                  }}
                >
                  {project.problem}
                </p>
              </div>

              {/* Objective */}
              <div>
                <p
                  className="f-mono"
                  style={{
                    fontSize: "var(--text-2xs)",
                    letterSpacing: "0.16em",
                    opacity: 0.35,
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                    color: "var(--color-text)",
                  }}
                >
                  Objective
                </p>
                <p
                  className="f-mono"
                  style={{
                    fontSize: "var(--text-sm)",
                    opacity: 0.7,
                    lineHeight: 1.7,
                    color: "var(--color-text)",
                  }}
                >
                  {project.objective}
                </p>
              </div>

              {/* Stack */}
              <div>
                <p
                  className="f-mono"
                  style={{
                    fontSize: "var(--text-2xs)",
                    letterSpacing: "0.16em",
                    opacity: 0.35,
                    textTransform: "uppercase",
                    marginBottom: "0.8rem",
                    color: "var(--color-text)",
                  }}
                >
                  Stack
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="f-mono"
                      style={{
                        fontSize: "var(--text-2xs)",
                        letterSpacing: "0.1em",
                        padding: "4px 12px",
                        border: "1px solid var(--color-border)",
                        borderRadius: "100px",
                        opacity: 0.75,
                        color: "var(--color-text)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievement */}
              <div>
                <p
                  className="f-mono"
                  style={{
                    fontSize: "var(--text-2xs)",
                    letterSpacing: "0.16em",
                    opacity: 0.35,
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                    color: "var(--color-text)",
                  }}
                >
                  Achievement
                </p>
                <p
                  className="f-mono"
                  style={{
                    fontSize: "var(--text-sm)",
                    opacity: 0.7,
                    lineHeight: 1.7,
                    color: "var(--color-text)",
                  }}
                >
                  {project.achievement}
                </p>
              </div>

              <div className="rule" />

              {/* Completion bar */}
              <div style={{ marginTop: "auto", paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <p
                    className="f-mono"
                    style={{
                      fontSize: "var(--text-2xs)",
                      letterSpacing: "0.14em",
                      opacity: 0.35,
                      textTransform: "uppercase",
                      color: "var(--color-text)",
                    }}
                  >
                    Completion
                  </p>
                  <p
                    className="f-mono"
                    style={{ fontSize: "var(--text-2xs)", opacity: 0.5, color: "var(--color-text)" }}
                  >
                    {project.completion}%
                  </p>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "var(--color-border)",
                    position: "relative",
                  }}
                >
                  <motion.div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "1px",
                      background: "var(--color-text)",
                      transformOrigin: "left",
                      width: "100%",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: project.completion / 100 }}
                    transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
                  />
                </div>
                <p
                  className="f-mono"
                  style={{
                    fontSize: "var(--text-2xs)",
                    opacity: 0.3,
                    marginTop: "0.5rem",
                    color: "var(--color-text)",
                  }}
                >
                  {project.status}
                </p>
              </div>

              {/* Full project link */}
              <Link
                href={project.href}
                className="f-mono"
                style={{
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.1em",
                  opacity: 0.55,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  minHeight: "44px",
                  color: "var(--color-text)",
                  textDecoration: "none",
                  transition: "opacity 0.25s ease, gap 0.4s cubic-bezier(0.19,1,0.22,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                  (e.currentTarget as HTMLAnchorElement).style.gap = "0.8rem";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.55";
                  (e.currentTarget as HTMLAnchorElement).style.gap = "0.4rem";
                }}
              >
                View full case study →
              </Link>
            </div>

            {/* ── RIGHT — image + video ── */}
            <div
              style={{
                flex: 1,
                height: isMobile ? "35%" : "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Video — top portion (hidden on mobile) */}
              {!isMobile && (
                <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                  <video
                    src={project.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Image */}
              <div
                style={{
                  height: isMobile ? "100%" : "40%",
                  position: "relative",
                  borderTop: isMobile ? "none" : "1px solid var(--color-border)",
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 96vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Section ─── */
export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProject = PROJECTS.find((p) => p.id === selectedId) ?? null;

  /* Measure scrollable track width */
  useEffect(() => {
    const update = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth - window.innerWidth);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Scroll-driven horizontal transform */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -trackWidth]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 1 });

  /* Horizontal progress indicator */
  const horizontalProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="Featured projects"
        style={{ height: "500vh", position: "relative", overflowX: "hidden" }}
      >
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: "100dvh", width: "100%" }}
        >
          {/* Section header */}
          <div
            className="absolute top-0 left-0 right-0 z-10"
            style={{
              padding: "clamp(1.5rem, 3vw, 2rem) var(--page-px) 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              pointerEvents: "none",
            }}
          >
            <p
              className="f-mono uppercase"
              style={{
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.2em",
                opacity: 0.35,
                color: "var(--color-text)",
              }}
            >
              selected work
            </p>
            <p
              className="f-mono uppercase"
              style={{
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.2em",
                opacity: 0.35,
                color: "var(--color-text)",
              }}
            >
              03 projects
            </p>
          </div>

          {/* Horizontal track */}
          <motion.div
            ref={trackRef}
            style={{
              x: smoothX,
              display: "flex",
              height: "100%",
              alignItems: "stretch",
              gap: "clamp(2rem, 4vw, 4rem)",
            }}
          >
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={(id) => setSelectedId(id)}
              />
            ))}
            <EndCard />
          </motion.div>

          {/* Scroll progress bar */}
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "1px",
              width: "100%",
              background: "var(--color-text)",
              scaleX: horizontalProgress,
              transformOrigin: "left",
              opacity: 0.25,
            }}
          />
        </div>
      </section>

      {/* Expanded overlay — rendered outside section to avoid scroll context issues */}
      <ExpandedOverlay
        project={selectedProject}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
