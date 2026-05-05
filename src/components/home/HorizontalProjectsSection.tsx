"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useSpring,
  AnimatePresence,
  useScroll,
  useTransform
} from "framer-motion";
import IdentityStatement from "./IdentityStatement";

/* ─── Project Data ─── */
const PROJECTS = [
  {
    id: "skillsync",
    index: "01",
    title: "SkillSync",
    category: "Full Stack · Platform",
    year: "2025",
    tagline: "Where engineers find their people.",
    problem:
      "Engineering students lack a structured way to find collaborators who complement their skill gaps. Existing platforms are either too social or too professional — nothing sits in between.",
    objective:
      "Build a skill-based collaboration platform for engineering students — with smart matching, team workspaces, and a reputation system that rewards contribution.",
    stack: ["Next.js", "Express", "MongoDB", "Zustand", "Tailwind CSS", "JWT", "Vercel", "Render"],
    achievement:
      "Pitched to KCT College Incubator. Prototype live with full feature set including idea feed, skill matching engine, task management, and reputation scores.",
    status: "Incubator pitch stage",
    completion: 72,
    image: "/assets/projects/skillsync.jpg",
    video: "/assets/projects/skillsync.mp4",
    href: "/projects/skillsync",
  },
  {
    id: "dengue",
    index: "02",
    title: "Dengue Prediction",
    category: "AI · Full Stack",
    year: "2024",
    tagline: "Predicting outbreaks before they spread.",
    problem:
      "Dengue outbreak data in Indian Tier-2 cities is reactive — health systems respond after spikes, not before. No district-level predictive tooling exists for early intervention.",
    objective:
      "Build an AI web platform that predicts dengue outbreak risk at district level across Indian Tier-2 cities, with an interactive hotspot map for health officials.",
    stack: ["React.js", "Flask", "Random Forest", "Leaflet.js", "Python", "scikit-learn"],
    achievement:
      "Six-member team project under faculty mentorship. District-level prediction with visual hotspot map. Formal project report published.",
    status: "Completed",
    completion: 100,
    image: "/assets/projects/dengue.jpg",
    video: "/assets/projects/dengue.mp4",
    href: "/projects/dengue-prediction",
  },
  {
    id: "portfolio",
    index: "03",
    title: "rsd.exe",
    category: "Design · Frontend",
    year: "2025",
    tagline: "A portfolio that doesn't look like one.",
    problem:
      "Most student portfolios look identical — hero image, skills list, project cards, contact form. The work gets lost in the template.",
    objective:
      "Design and build a personal portfolio that reflects personality and craft. Every section, animation, and interaction should feel intentional.",
    stack: ["Next.js 16", "Tailwind v4", "Framer Motion", "Lenis", "TypeScript"],
    achievement: "This site. End-to-end — concept, design system, development.",
    status: "Ongoing",
    completion: 85,
    image: "/assets/projects/portfolio.jpg",
    video: "/assets/projects/portfolio.mp4",
    href: "/projects/portfolio",
  },
];

type Project = (typeof PROJECTS)[number];

/* ─── EXPO easing ─── */
const EXPO = [0.19, 1, 0.22, 1] as const;

/* ─── End Card ─── */
function EndCard() {
  return (
    <div
      style={{
        flexShrink: 0,
        width: "110vw", // Explicitly requested 110vw
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: "clamp(2rem, 20vw, 24vw)", // Offset for 110vw
        paddingRight: "var(--page-px)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
        <h2
          style={{
            fontSize: "clamp(3.5rem, 9vw, 11rem)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            color: "var(--color-text)",
          }}
        >
          More where that<br />came from?
        </h2>
        <Link
          href="/projects"
          style={{
            fontSize: "clamp(1.2rem, 2vw, 2rem)",
            letterSpacing: "0.02em",
            opacity: 0.8,
            marginTop: "clamp(2rem, 4vw, 4rem)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--color-text)",
            textDecoration: "none",
            transition: "opacity 0.3s ease, gap 0.4s cubic-bezier(0.19,1,0.22,1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            (e.currentTarget as HTMLAnchorElement).style.gap = "1rem";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
            (e.currentTarget as HTMLAnchorElement).style.gap = "0.5rem";
          }}
        >
          See all projects →
        </Link>
      </div>
    </div>
  );
}

/* ─── Project Card ─── */
interface CardProps {
  project: Project;
  onExpand: (id: string) => void;
}

function ProjectCard({ project, onExpand }: CardProps) {
  const [hovered, setHovered] = useState(false);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onExpand(project.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-card-id={project.id}
      aria-label={`View ${project.title} details`}
      onClick={() => onExpand(project.id)}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        flexShrink: 0,
        width: "clamp(75vw, 80vw, 85vw)",
        height: "100%",
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

export default function HorizontalProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = PROJECTS.find((p) => p.id === selectedId) ?? null;
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    if (!trackRef.current) return;
    const updateMax = () => {
      if (trackRef.current) {
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
      }
    };
    updateMax();
    const observer = new ResizeObserver(() => updateMax());
    observer.observe(trackRef.current);
    
    window.addEventListener("resize", updateMax);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMax);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const smoothX = useSpring(rawX, { stiffness: 120, damping: 25, restDelta: 0.5 });

  return (
    <>
      <section
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: `calc(100vh + ${scrollRange}px)`,
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div 
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-start"
        >
            {/* ── Section header bar (Only show if scrolled past Identity Statement maybe? Or keep static) ── */}
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                zIndex: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "clamp(1.2rem, 3vw, 2rem) var(--page-px)",
                borderBottom: "1px solid var(--color-border)",
                pointerEvents: "none",
                opacity: 0.35,
              }}
            >
              <p
                className="f-mono uppercase"
                style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.2em" }}
              >
                selected work
              </p>
              <p
                className="f-mono uppercase"
                style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.2em" }}
              >
                03 projects
              </p>
            </div>

            {/* ── Horizontal track ──────────────────────────────── */}
            <motion.div
              ref={trackRef}
              style={{
                x: smoothX,
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                height: "100%",
                willChange: "transform",
                // Remove paddingTop if we want IdentityStatement to be vertically centered properly, 
                // but we can let IdentityStatement handle its own centering.
              }}
            >
              {/* ── 1. Identity Statement (Starts here now) ── */}
              <div style={{ flexShrink: 0, width: "100vw", height: "100%" }}>
                <IdentityStatement />
              </div>

              {/* ── 2. Featured Projects label card ── */}
              <div
                style={{
                  flexShrink: 0,
                  width: "clamp(280px, 40vw, 560px)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingLeft: "var(--page-px)",
                  paddingRight: "clamp(2rem, 4vw, 4rem)",
                  borderRight: "1px solid var(--color-border)",
                  paddingTop: "clamp(3.5rem, 6vw, 5rem)",
                }}
              >
                <p
                  className="f-mono uppercase"
                  style={{
                    fontSize: "var(--text-2xs)",
                    letterSpacing: "0.2em",
                    opacity: 0.35,
                    marginBottom: "clamp(1rem, 2vw, 1.5rem)",
                  }}
                >
                  featured
                </p>
                <h2
                  className="f-display"
                  style={{
                    fontSize: "var(--text-3xl)",
                    fontWeight: 300,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  Selected<br />Work.
                </h2>
                <p
                  className="f-accent"
                  style={{
                    fontSize: "var(--text-sm)",
                    fontStyle: "italic",
                    opacity: 0.45,
                    marginTop: "clamp(1rem, 2vw, 1.5rem)",
                  }}
                >
                  Scroll right to explore →
                </p>
              </div>

              {/* ── 3 Project Cards ── */}
              {PROJECTS.map((project) => (
                <div key={project.id} style={{ paddingTop: "clamp(3.5rem, 6vw, 5rem)" }}>
                    <ProjectCard
                      project={project}
                      onExpand={() => setSelectedId(project.id)}
                    />
                </div>
              ))}

              {/* ── End card ── */}
              <div style={{ paddingTop: "clamp(3.5rem, 6vw, 5rem)" }}>
                  <EndCard />
              </div>
            </motion.div>
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
