// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

// ── Rotating words data ────────────────────────────────────────
const WORDS = ["SDE Aspirant.", "Developer.", "Learner.", "Engineer."]; // TODO: Add Entrepreneur. when I start something of my own.

// ── Navbar component ───────────────────────────────────────────
export default function Navbar() {
  const pathname    = usePathname();
  const isDarkPage  = pathname === "/contact";
  const [menuOpen,  setMenuOpen] = useState(false);
  const [wordIdx,   setWordIdx]  = useState(0);

  // Rotating words timer
  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        body.is-loading .nav-global,
        body.is-loading .footer-global {
          display: none !important;
        }
      `}</style>
      {/* ── Main Navbar ── */}
      <header
        className={`nav-global${isDarkPage ? " nav-dark" : ""}`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="nav-logo" aria-label="rsd.exe home">
          rsd.exe
        </Link>

        {/* Desktop links */}
        <nav className="nav-links" aria-label="Primary links">
          {[
            { href: "/projects", label: "Projects" },
            { href: "/about",    label: "About" },
            { href: "/contact",  label: "Contact" },
            { href: "/Sudharshan_R_Resume.pdf", label: "Resume" },
          ].map(({ href, label }) => (
            <motion.div
              key={href}
              className="relative flex flex-col items-center"
              whileHover="hovered"
              initial="rest"
              animate="rest"
              style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}
            >
              <Link
                href={href}
                className="nav-link flex flex-col items-center"
                style={pathname === href ? { opacity: 1, fontWeight: 500 } : {}}
                {...(href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <motion.span
                  variants={{ rest: { y: 0, scale: 1 }, hovered: { y: -6, scale: 1.12 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{ display: "block" }}
                >
                  {label}
                </motion.span>
                {/* Animated underline — inside Link so it's always clickable */}
                <motion.span
                  style={{ height: "1px", background: "var(--text-primary)", display: "block", borderRadius: "2px", marginTop: "2px" }}
                  variants={{ rest: { width: "0%", opacity: 0 }, hovered: { width: "100%", opacity: 0.6 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop right — rotating words */}
        <div className="hidden md:flex items-center">
          {/* Rotating descriptor */}
          <div
            className="rotating-words-wrap"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                className="f-accent absolute left-3 right-3 text-center"
                style={{
                  fontSize: "var(--text-base)",
                  letterSpacing: "0.04em",
                  color: isDarkPage ? "var(--color-text-inv)" : "var(--text-primary)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
              >
                {WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile — hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <motion.span
            animate={menuOpen
              ? { rotate: 45, y: 6, opacity: 1 }
              : { rotate: 0,  y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={menuOpen
              ? { rotate: -45, y: -6, opacity: 1 }
              : { rotate: 0,   y: 0,  opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </header>

      {/* ── Mobile full-screen overlay menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="nav-mobile-overlay"
            aria-label="Mobile navigation"
            style={isDarkPage ? { background: "#111111", color: "#F5F4F0" } : {}}
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{    opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Staggered link reveals */}
            {[
              { href: "/",         label: "Home" },
              { href: "/projects", label: "Projects" },
              { href: "/about",    label: "About" },
              { href: "/contact",  label: "Contact" },
              { href: "/Sudharshan_R_Resume.pdf", label: "Resume" },
            ].map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <Link
                  href={href}
                  className="nav-mobile-link"
                  onClick={() => setMenuOpen(false)}
                  style={{ opacity: pathname === href ? 1 : 0.6, fontWeight: pathname === href ? 500 : 400 }}
                  {...(href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {label}
                </Link>
              </motion.div>
            ))}

            {/* Location tag at bottom */}
            <motion.p
              className="f-accent absolute bottom-8"
              style={{ fontSize: "var(--text-xs)", opacity: 0.4 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
            >
              Coimbatore, India
            </motion.p>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
