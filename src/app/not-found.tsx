"use client";

import { motion, useMotionValue, useSpring, useTransform, useAnimation } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();

  // Mouse follow for "404" bg text (desktop)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  const textDriftX = useTransform(smoothX, [0, 1], [-30, 30]);
  const textDriftY = useTransform(smoothY, [0, 1], [-15, 15]);

  const [isMobile, setIsMobile] = useState(false);
  const bgControls = useAnimation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const sequence = async () => {
      // 1. Initial entrance
      await bgControls.start({
        opacity: isMobile ? 0.04 : 0.05,
        scale: 1,
        transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] },
      });
      // 2. Continuous breathing
      bgControls.start({
        scale: [1, 1.015, 1],
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
      });
    };
    sequence();
  }, [bgControls, isMobile]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };

  const handleBack = () => {
    if (document.referrer?.includes(window.location.hostname)) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-[var(--bg-base)]"
      style={{ height: "100dvh", color: "var(--color-text)" }}
      onMouseMove={handleMouseMove}
    >
      {/* Ghost "404" background */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <motion.p
          className="f-display select-none"
          style={{
            x: isMobile ? 0 : textDriftX,
            y: isMobile ? 0 : textDriftY,
            fontSize: "clamp(24rem, 35vw, 45rem)",
            fontWeight: 300,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={bgControls}
          aria-hidden="true"
        >
          404
        </motion.p>
      </div>

      {/* Top-left label
      <motion.p
        className="f-mono absolute uppercase"
        style={{
          top: "clamp(5rem, 8vw, 8rem)",
          left: "var(--page-px)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.2em",
          zIndex: 1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        aria-hidden="true"
      >
        you found nothingness.
      </motion.p> */}

      {/* Centre block */}
      <div
        className="absolute top-1/2 left-1/2 flex flex-col text-left"
        style={{
          transform: "translate(-50%, -50%)",
          gap: "clamp(0.8rem, 1.5vw, 1.2rem)",
          zIndex: 1,
          width: "max-content",
          maxWidth: "85vw",
        }}
      >
        {/* Main headline — clip reveal */}
        <div>
          <motion.h1
            className="f-display"
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            This page doesn&apos;t exist.
          </motion.h1>
        </div>

        {/* Italic subline */}
        <motion.p
          className="f-accent"
          style={{
            fontSize: "var(--text-xl)",
            fontStyle: "italic",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.19, 1, 0.22, 1] }}
        >
          Or it did, and it&apos;s gone.
        </motion.p>

        {/* Caption */}
        <motion.p
          className="f-accent"
          style={{
            fontSize: "var(--text-xl)",
            fontStyle: "italic",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          Either way, nothing to see here .
        </motion.p>
      </div>

      {/* Bottom row (mobile: flex-row space-between, desktop: absolute positions) */}
      <div
        className="absolute w-full flex md:block justify-between items-end"
        style={{
          bottom: "clamp(2rem, 5vw, 3.5rem)",
          left: 0,
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          zIndex: 1,
        }}
      >
        {/* Bottom-left — back */}
        <motion.div
          className="flex items-center md:absolute"
          style={{
            left: "var(--page-px)",
            bottom: 0,
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <button
            onClick={handleBack}
            className="f-mono flex items-center cursor-pointer"
            aria-label="Go back to previous page"
            style={{
              fontSize: "var(--text-sm)",
              letterSpacing: "0.1em",
              minHeight: "44px",
              opacity: 0.55,
              transition: "all 0.35s cubic-bezier(0.19, 1, 0.22, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateX(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.55";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            ← back
          </button>
        </motion.div>

        {/* Bottom-right — navigation links */}
        <motion.div
          className="flex flex-col items-end md:absolute"
          style={{
            gap: "0.5rem",
            right: "var(--page-px)",
            bottom: 0,
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Link
            href="/"
            aria-label="Go to homepage"
            className="f-mono inline-flex items-center"
            style={{
              fontSize: "var(--text-sm)",
              letterSpacing: "0.1em",
              opacity: 0.55,
              minHeight: "44px",
              transition: "all 0.35s cubic-bezier(0.19, 1, 0.22, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.55";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            go home →
          </Link>
          <Link
            href="/projects"
            aria-label="See all projects"
            className="f-mono hidden md:inline-flex items-center"
            style={{
              fontSize: "var(--text-sm)",
              letterSpacing: "0.1em",
              opacity: 0.35,
              minHeight: "44px",
              transition: "all 0.35s cubic-bezier(0.19, 1, 0.22, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.35";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            see my work →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}