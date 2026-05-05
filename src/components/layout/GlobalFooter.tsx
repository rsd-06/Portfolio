// src/components/layout/GlobalFooter.tsx
// rsd.exe — Global Footer
// Curved top, dark background, editorial words, social links.
// Rendered in root layout — present on EVERY page.

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// ── Social links ───────────────────────────────────────────────
const SOCIALS = [
  { label: "GitHub",   href: "https://github.com/rsd-exe" },     // update
  { label: "LinkedIn", href: "https://linkedin.com/in/rsd-exe" }, // update
  { label: "Twitter",  href: "https://x.com/rsd_exe" },           // update
  { label: "Instagram",href: "https://instagram.com/rsd.exe" },   // update
];

const BIG_WORDS = ["Growth.", "Code.", "Build."];

// ── Stagger container variants ─────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const wordVariants = {
  hidden:  { opacity: 0, y: 60, skewY: 2 },
  visible: {
    opacity: 1, y: 0, skewY: 0,
    transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] as const },
  },
};

// ── Component ──────────────────────────────────────────────────
export default function GlobalFooter() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer ref={ref} className="footer-global" aria-label="Site footer">

      {/* ── Big editorial words ── */}
      <motion.div
        className="footer-words"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        aria-label="Footer tagline"
      >
        {BIG_WORDS.map((word) => (
          <motion.span
            key={word}
            className="footer-word"
            variants={wordVariants}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

      {/* ── Connect link ── */}
      <motion.div
        className="footer-connect-line"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <Link
          href="mailto:sudharshan@example.com"   /* update */
          className="footer-connect"
          aria-label="Send me an email"
        >
          Let&apos;s connect →
        </Link>
      </motion.div>

      {/* ── Bottom bar: copyright + socials ── */}
      <motion.div
        className="footer-bottom-bar"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.65, duration: 0.6, ease: "easeOut" }}
      >
        {/* Copyright */}
        <p className="footer-copy" aria-label="Copyright">
          © {new Date().getFullYear()} Sudharshan R — rsd.exe
        </p>

        {/* Social links */}
        <nav className="footer-social-row" aria-label="Social media links">
          {SOCIALS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label={`${label} — opens in new tab`}
            >
              {label}
            </a>
          ))}
        </nav>
      </motion.div>

    </footer>
  );
}
