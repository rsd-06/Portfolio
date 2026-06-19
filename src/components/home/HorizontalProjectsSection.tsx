"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useSpring,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
} from "framer-motion";
import IdentityStatement from "./IdentityStatement";
import { useLenis } from "@/components/providers/LenisProvider";

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
    completion: 45,
    image: "/assets/projects/skillsync/01.png",
    video: "/assets/projects/skillsync/demo.mp4",
    href: "/projects/skillsync",
  },
  {
    id: "googledocsmini",
    index: "02",
    title: "Google Docs Mini",
    category: "Full Stack · Real-Time Platform",
    year: "2024",
    tagline: "Collaborative editing, instantly.",
    problem:
      "Building a performant, real-time rich text editor that seamlessly handles simultaneous multi-user collaboration and cursor tracking without merge conflicts.",
    objective:
      "Develop a fully functional document editor with real-time syncing, live cursors, authentication, and document management capabilities.",
    stack: ["Next.js", "Liveblocks", "Lexical", "Tailwind CSS", "Clerk"],
    achievement:
      "Implemented seamless real-time document sync with live presence indicators and robust rich-text formatting.",
    status: "Completed",
    completion: 100,
    image: "/assets/projects/googleDocsClone/01.png",
    video: "/assets/projects/googleDocsClone/demo.mp4",
    href: "/projects/googledocsmini",
  },
  {
    id: "gitpr-evaluation-env",
    index: "03",
    title: "PR Evaluation Env & Model Training",
    category: "AI · Reinforcement Learning",
    year: "2026",
    tagline: "PR descriptions describe the feature. Never the flaw.",
    problem:
      "Every day, developers merge Pull Requests that introduce accidental regressions — unintentional defects entirely unrelated to the feature being shipped.",
    objective:
      "Turn the real-world PR code review challenge into a rigorous RL benchmark. Build an environment where LLM agents must catch integration-level regressions.",
    stack: ["GRPO", "FastAPI", "Docker", "Qwen2.5-1.5B", "RLVR"],
    achievement:
      "Built and deployed at the Meta × Scaler OpenEnv Hackathon 2026. V2 GRPO model trained with Curriculum Learning improved Hard-tier performance by 2.3×.",
    status: "Completed",
    completion: 100,
    image: "/assets/projects/gitpr/01.png",
    video: undefined,
    href: "/projects/gitpr-evaluation-env",
  },
];

type Project = (typeof PROJECTS)[number];

/* ─── EXPO easing ─── */
const EXPO = [0.19, 1, 0.22, 1] as const;

/* ─── Save home scroll position before leaving ─── */
// Uses a window property (in-memory) so it resets on hard reload,
// consistent with the module-level loaderHasRun flag in LoaderScreen.
function saveHomeScroll() {
  (window as Window & { __rsd_restoreScrollY?: number }).__rsd_restoreScrollY =
    window.scrollY;
}

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
  const [clicked, setClicked]   = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Mouse position relative to image (0–1 range)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Tilt springs — smooth, no lag
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [1, -1]),  { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-1, 1]),  { stiffness: 200, damping: 25 });

  // Spotlight position (%)
  const spotX = useSpring(useTransform(mouseX, [0, 1], [20, 80]), { stiffness: 200, damping: 25 });
  const spotY = useSpring(useTransform(mouseY, [0, 1], [20, 80]), { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top)  / rect.height);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    // Gently snap back to center
    mouseX.set(0.5);
    mouseY.set(0.5);
    setHovered(false);
  }, [mouseX, mouseY]);

  const handleClick = () => {
    setClicked(true);
    // Brief flash, then open overlay
    setTimeout(() => {
      setClicked(false);
      onExpand(project.id);
    }, 120);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      data-card-id={project.id}
      aria-label={`View ${project.title} details`}
      onClick={handleClick}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      // Subtle whole-card press
      whileTap={{ scale: 0.985, transition: { duration: 0.1, ease: "easeOut" } }}
      animate={{
        backgroundColor: clicked ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.12 }}
      style={{
        position: "relative",
        flexShrink: 0,
        width: "clamp(75vw, 80vw, 85vw)",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        borderRight: "1.5px solid rgba(0,0,0,0.14)",
        borderLeft: hovered ? "1.5px solid rgba(0,0,0,0.14)" : "1.5px solid transparent",
        transition: "border-color 0.4s ease",
        outline: "none",
        paddingRight: "clamp(3rem, 5vw, 6rem)",
      }}
    >
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
        {/* Index above title */}
        <div>
          <p
            className="f-mono"
            style={{
              fontSize: "var(--text-2xs)",
              letterSpacing: "0.2em",
              opacity: 0.28,
              marginBottom: "0.3rem",
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
          onClick={(e) => { e.stopPropagation(); saveHomeScroll(); }}
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

      {/* ── Right column — 3D tilt image ── */}
      <div
        ref={imageRef}
        onMouseMove={handleMouseMove}
        style={{
          marginLeft: "auto",
          flexShrink: 0,
          maxWidth: "54%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "800px",
        }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
            lineHeight: 0,
          }}
          animate={{
            boxShadow: hovered
              ? "0 16px 56px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.1)"
              : "0 4px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)",
            scale: clicked ? 0.97 : 1,
          }}
          transition={{ duration: 0.35, ease: EXPO }}
        >
          {/* Cursor-following spotlight overlay */}
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              borderRadius: "10px",
              background: useTransform(
                [spotX, spotY],
                ([x, y]) =>
                  `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
              ),
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />

          <img
            src={project.image}
            alt={project.title}
            draggable={false}
            style={{
              display: "block",
              maxHeight: "70dvh",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
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
    </motion.div>
  );
}

/* ─── Expanded Overlay ─── */
interface OverlayProps {
  project: Project | null;
  onClose: () => void;
}

function ExpandedOverlay({ project, onClose }: OverlayProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  const lenis = useLenis();

  /* Stop Lenis (and lock body) while overlay is open — start again on close.
   * Lenis intercepts ALL wheel events at document level; overflow:hidden alone
   * does nothing against it. lenis.stop() is the only reliable fix. */
  useEffect(() => {
    if (!project) return;
    lenis?.stop();
    document.body.style.overflow = "hidden"; // fallback for touch
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [project, lenis]);

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
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
            style={{
              position: "fixed",
              zIndex: 9999,
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
              <button
                ref={closeRef}
                onClick={onClose}
                className="absolute f-mono"
                style={{
                  top: 0,
                  right: 0,
                  zIndex: 100,
                  fontSize: "var(--text-2xs)",
                  letterSpacing: "0.16em",
                  opacity: 0.5,
                  padding: "1.5rem",
                  minHeight: "64px",
                  minWidth: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text)",
                  pointerEvents: "auto",
                }}
                aria-label="Close project details"
              >
                ✕ close
              </button>

            {/* ── LEFT — scrollable text with hairline progress ── */}
            <OverlayTextPanel project={project} isMobile={isMobile} />

            {/* ── RIGHT — image, natural fit ── */}
            <div
              style={{
                flex: 1,
                height: isMobile ? "35%" : "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "clamp(1.5rem, 3vw, 2.5rem)",
                borderLeft: isMobile ? "none" : "1px solid var(--color-border)",
                borderTop: isMobile ? "1px solid var(--color-border)" : "none",
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "8px",
                  boxShadow: "0 8px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.07)",
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── Scrollable text panel with hairline scroll-progress tracker ── */
function OverlayTextPanel({ project, isMobile }: { project: Project; isMobile: boolean }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: panelRef });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotTop  = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Live percentage for the text label
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setPct(Math.round(v * 100)));
    return unsub;
  }, [scrollYProgress]);

  // Smooth lerp scroll engine — same feel as Lenis but contained in the panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let targetY  = panel.scrollTop;
    let rafId: ReturnType<typeof requestAnimationFrame> | null = null;

    const animate = () => {
      const current = panel.scrollTop;
      const delta   = targetY - current;
      if (Math.abs(delta) < 0.5) {
        panel.scrollTop = targetY;
        rafId = null;
        return;
      }
      panel.scrollTop += delta * 0.09; // lerp factor — matches Lenis feel
      rafId = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation(); // keep Lenis away
      e.preventDefault();  // no native jump — we drive scrollTop ourselves
      const max  = panel.scrollHeight - panel.clientHeight;
      targetY    = Math.max(0, Math.min(targetY + e.deltaY, max));
      if (!rafId) rafId = requestAnimationFrame(animate);
    };

    panel.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      panel.removeEventListener("wheel", onWheel);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      style={{
        width: isMobile ? "100%" : "42%",
        height: isMobile ? "65%" : "100%",
        display: "flex",
        flexDirection: "row",
        borderRight: isMobile ? "none" : "1px solid var(--color-border)",
        borderBottom: isMobile ? "1px solid var(--color-border)" : "none",
      }}
    >
      {/* ── Tracker column: percentage + dot + 1px line ── */}
      <div
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: "clamp(2.5rem, 4vw, 3.5rem)",
          marginTop: "clamp(3rem, 5vw, 4.5rem)",
          marginRight: "16px",
          marginBottom: "clamp(2rem, 4vw, 3.5rem)",
          marginLeft: "clamp(1.5rem, 3vw, 2.5rem)",
          position: "relative",
        }}
      >
        {/* Ghost track — right edge */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(0,0,0,0.08)", borderRadius: "1px" }} />

        {/* Progress fill */}
        <motion.div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "1px",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            scaleY,
            transformOrigin: "top",
            borderRadius: "1px",
          }}
        />

        {/* Dot + percentage — travel together */}
        <motion.div
          style={{
            position: "absolute",
            right: 0,
            top: dotTop,
            translateY: "-50%",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            pointerEvents: "none",
          }}
        >
          {/* Percentage to the left of the line */}
          <span
            className="f-mono"
            style={{
              fontSize: "8px",
              letterSpacing: "0.04em",
              color: "rgba(0,0,0,0.4)",
              lineHeight: 1,
              minWidth: "24px",
              textAlign: "right",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            {pct}%
          </span>

          {/* Dot sitting on the line */}
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.5)",
              flexShrink: 0,
              marginRight: "-2px",
            }}
          />
        </motion.div>
      </div>

      {/* ── Scrollable content ── */}
      <div
        ref={panelRef}
        style={{
          flex: 1,
          overflowY: "scroll",
          scrollbarWidth: "none" as const,
          overscrollBehavior: "contain",
          paddingRight: "clamp(2rem, 4vw, 3.5rem)",
          paddingTop: "clamp(3rem, 5vw, 4.5rem)",
          paddingBottom: "clamp(2rem, 4vw, 3.5rem)",
          display: "flex",
          flexDirection: "column" as const,
          gap: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        {/* Hide webkit scrollbar */}
        <style>{`
          .overlay-scroll-panel::-webkit-scrollbar { display: none; }
        `}</style>

        <p className="f-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.18em", opacity: 0.35, color: "var(--color-text)" }}>
          {project.index} / {project.category}
        </p>
        <h2 className="f-display" style={{ fontSize: "var(--text-xl)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05, color: "var(--color-text)" }}>
          {project.title}
        </h2>
        <p className="f-accent" style={{ fontSize: "var(--text-md)", fontStyle: "italic", opacity: 0.6, color: "var(--color-text)" }}>
          &ldquo;{project.tagline}&rdquo;
        </p>
        <div className="rule" />
        {[
          { label: "Problem",   body: project.problem },
          { label: "Objective", body: project.objective },
        ].map(({ label, body }) => (
          <div key={label}>
            <p className="f-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.16em", opacity: 0.35, textTransform: "uppercase", marginBottom: "0.6rem", color: "var(--color-text)" }}>{label}</p>
            <p className="f-mono" style={{ fontSize: "var(--text-sm)", opacity: 0.7, lineHeight: 1.7, color: "var(--color-text)" }}>{body}</p>
          </div>
        ))}
        <div>
          <p className="f-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.16em", opacity: 0.35, textTransform: "uppercase", marginBottom: "0.8rem", color: "var(--color-text)" }}>Stack</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {project.stack.map((tech) => (
              <span key={tech} className="f-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", padding: "4px 12px", border: "1px solid var(--color-border)", borderRadius: "100px", opacity: 0.75, color: "var(--color-text)" }}>{tech}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="f-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.16em", opacity: 0.35, textTransform: "uppercase", marginBottom: "0.6rem", color: "var(--color-text)" }}>Achievement</p>
          <p className="f-mono" style={{ fontSize: "var(--text-sm)", opacity: 0.7, lineHeight: 1.7, color: "var(--color-text)" }}>{project.achievement}</p>
        </div>
        <div className="rule" />
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <p className="f-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.14em", opacity: 0.35, textTransform: "uppercase", color: "var(--color-text)" }}>Completion</p>
            <p className="f-mono" style={{ fontSize: "var(--text-2xs)", opacity: 0.5, color: "var(--color-text)" }}>{project.completion}%</p>
          </div>
          <div style={{ width: "100%", height: "1px", background: "var(--color-border)", position: "relative" }}>
            <motion.div
              style={{ position: "absolute", top: 0, left: 0, height: "1px", background: "var(--color-text)", transformOrigin: "left", width: "100%" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: project.completion / 100 }}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
            />
          </div>
          <p className="f-mono" style={{ fontSize: "var(--text-2xs)", opacity: 0.3, marginTop: "0.5rem", color: "var(--color-text)" }}>{project.status}</p>
        </div>
        <Link
          href={project.href} className="f-mono" onClick={saveHomeScroll}
          style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", opacity: 0.55, display: "inline-flex", alignItems: "center", gap: "0.4rem", minHeight: "44px", color: "var(--color-text)", textDecoration: "none", transition: "opacity 0.25s ease, gap 0.4s cubic-bezier(0.19,1,0.22,1)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.gap = "0.8rem"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.55"; (e.currentTarget as HTMLAnchorElement).style.gap = "0.4rem"; }}
        >
          View full case study →
        </Link>
        <div style={{ height: "clamp(2rem, 4vw, 3rem)" }} />
      </div>
    </div>
  );
}

export default function HorizontalProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = PROJECTS.find((p) => p.id === selectedId) ?? null;
  const [scrollRange, setScrollRange] = useState(0);

  useLayoutEffect(() => {
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

  // Track scroll continuously while on the home page.
  // We don't use unmount because Next.js may reset scroll to 0 *before* unmount.
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        (window as Window & { __rsd_restoreScrollY?: number }).__rsd_restoreScrollY = window.scrollY;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
                  width: "50vw",
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
                <div 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "1rem", 
                    marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                    opacity: 0.35 
                  }}
                >
                  <p
                    className="f-mono uppercase"
                    style={{
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    featured
                  </p>
                  <p
                    className="f-mono uppercase"
                    style={{
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    &middot; 03 projects
                  </p>
                </div>
                
                <h2
                  className="f-display"
                  style={{
                    fontSize: "clamp(4.5rem, 8vw, 7rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.05,
                  }}
                >
                  Selected<br />Work.
                </h2>
                <p
                  className="f-accent"
                  style={{
                    fontSize: "var(--text-lg)",
                    fontStyle: "italic",
                    opacity: 0.45,
                    marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
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
