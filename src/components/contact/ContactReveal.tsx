// src/components/contact/ContactReveal.tsx
// rsd.exe — The single moment of delight on the Contact page.
// Button reads "( Let's talk ↗ )" — click reveals contact card
// with Email + Instagram only. Close button collapses back.

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONTACTS = [
  {
    label: "Email",
    display: "hello.rsd06@gmail.com",
    href: "mailto:hello.rsd06@gmail.com",
    isExternal: false,
    ariaLabel: "Send an email to hello.rsd06@gmail.com",
  },
  {
    label: "Instagram",
    display: "@rsd_exe",
    href: "https://www.instagram.com/rsd_exe/",
    isExternal: true,
    ariaLabel: "Follow rsd_exe on Instagram — opens in new tab",
  },
];

export default function ContactReveal() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{ position: "relative", minWidth: "clamp(220px, 30vw, 340px)" }}>
      <AnimatePresence mode="wait">

        {/* ── Button (default state) ── */}
        {!revealed && (
          <motion.button
            key="reveal-btn"
            onClick={() => setRevealed(true)}
            className="f-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              fontSize: "var(--text-md)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--color-text-inv)",
              minHeight: "44px",
              padding: "0.5rem 0",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0, y: -8 }}
            whileHover={{
              opacity: 1,
              y: -4,
              scale: 1.05,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            whileTap={{ y: 0, opacity: 0.8 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            aria-label="Reveal contact details"
            aria-expanded={false}
          >
            <span style={{ opacity: 0.4, fontWeight: 300 }}>(</span>
            <span>Let&apos;s talk</span>
            <span style={{ fontSize: "0.85em", opacity: 0.7 }}>↗</span>
            <span style={{ opacity: 0.4, fontWeight: 300 }}>)</span>
          </motion.button>
        )}

        {/* ── Revealed contact card ── */}
        {revealed && (
          <motion.div
            key="contact-card"
            role="region"
            aria-label="Contact information"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
            style={{
              border: "1px solid rgba(245,244,240,0.12)",
              borderRadius: "clamp(8px, 1.5vw, 14px)",
              padding: "clamp(1.5rem, 3vw, 2rem)",
              backgroundColor: "rgba(245,244,240,0.04)",
              backdropFilter: "blur(8px)",
              position: "relative",
              minWidth: "clamp(220px, 28vw, 320px)",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setRevealed(false)}
              className="f-mono"
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                fontSize: "var(--text-2xs)",
                opacity: 0.35,
                minHeight: "32px",
                minWidth: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.2s ease",
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "var(--color-text-inv)",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.35")}
              aria-label="Close contact card"
            >
              ✕
            </button>

            {/* Card header */}
            <p
              className="f-mono"
              style={{
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.18em",
                opacity: 0.3,
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                color: "var(--color-text-inv)",
              }}
            >
              get in touch
            </p>

            {/* Contact items */}
            {CONTACTS.map(({ label, href, display, isExternal, ariaLabel }, i) => (
              <motion.a
                key={label}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={ariaLabel}
                className="f-mono"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: i < CONTACTS.length - 1 ? "1.25rem" : 0,
                  opacity: 0.75,
                  transition: "opacity 0.25s ease",
                  minHeight: "44px",
                  justifyContent: "center",
                  textDecoration: "none",
                  color: "var(--color-text-inv)",
                }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 0.75, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.08,
                  ease: [0.19, 1, 0.22, 1],
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
              >
                <span
                  style={{
                    fontSize: "var(--text-2xs)",
                    letterSpacing: "0.14em",
                    opacity: 0.4,
                    textTransform: "uppercase",
                    marginBottom: "0.2rem",
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: "var(--text-xs)", letterSpacing: "0.06em" }}>
                  {display}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
