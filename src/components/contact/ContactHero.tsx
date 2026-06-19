// src/components/contact/ContactHero.tsx
// rsd.exe — Contact page dark hero.
// Two-column main area:
//   LEFT  — "Nice to meet you" top | "Have a vision?" + availability bottom
//   RIGHT — "( LET'S TALK ↗ )" vertically centred

"use client";

import { motion } from "framer-motion";
import ContactClock from "./ContactClock";
import ContactReveal from "./ContactReveal";

const EASE = [0.19, 1, 0.22, 1] as const;

export default function ContactHero() {
  return (
    <section
      className="flex flex-col pb-12 md:pb-6"
      style={{
        height: "100%",
        paddingTop: "var(--nav-h, 5rem)",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
      aria-label="Contact section"
    >

      {/* ── TOP ROW: Contact + clock ── */}
      <motion.div
        className="flex items-end justify-between"
        style={{ paddingTop: "0.5rem", paddingBottom: "1rem", flexShrink: 0 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <h1
          className="f-display"
          style={{
            fontSize: "4.5rem",
            fontWeight: 300,
            lineHeight: 1,
            color: "var(--color-text-inv)",
            opacity: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          Contact
        </h1>
        <ContactClock />
      </motion.div>

      {/* ── White divider ── */}
      <motion.div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "1px",
          background: "rgba(245,244,240,0.65)",
          originX: 0,
          flexShrink: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      />

      {/* ── TWO-COLUMN MAIN — flex-1 ── */}
      <div
        className="flex flex-col md:flex-row flex-1"
        style={{ minHeight: 0, gap: "var(--page-px)" }}
      >

        {/* LEFT column — Nice to meet you (top) + vision/availability (bottom) */}
        <div
          className="flex flex-col flex-1 justify-between pb-[clamp(100px,20vh,160px)] md:pb-6 lg:pb-8"
          style={{
            paddingTop: "clamp(1.5rem, 3vh, 2.5rem)",
          }}
        >
          {/* "Nice to meet you" — pinned to top of left col */}
          <motion.p
            className="f-display"
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              opacity: 0.9,
              color: "var(--color-text-inv)",
              paddingTop: "1rem",
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.2 }}
          >
            Nice to meet you<br />(virtually).
          </motion.p>

          {/* "Have a vision?" + availability — pinned to bottom of left col */}
          <div className="flex flex-col" style={{ gap: "clamp(0.6rem, 1.2vh, 1rem)" }}>

            <motion.p
              className="f-accent"
              style={{
                fontSize: "var(--text-xl)",
                fontStyle: "italic",
                opacity: 0.55,
                color: "var(--color-text-inv)",
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 0.55, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.38 }}
            >
              Have a vision?<br />Let&apos;s bring it to life.
            </motion.p>

            {/* Availability — Inter font, no heading label */}
            <motion.p
              style={{
                fontFamily: "var(--font-inter, 'Inter', system-ui, sans-serif)",
                fontSize: "var(--text-md)",
                fontWeight: 300,
                opacity: 0.4,
                lineHeight: 1.75,
                letterSpacing: "0.01em",
                color: "var(--color-text-inv)",
                maxWidth: "clamp(260px, 50%, 480px)",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.5 }}
            >
              Open to meaningful collaborations;<br />
              Internships, Research Projects<br />
              and Building Things Worth Building.
            </motion.p>

          </div>
        </div>

        {/* RIGHT column — Let's Talk vertically centred */}
        <div
          className="flex items-center justify-end md:pr-16 lg:pr-32 xl:pr-48 pb-6 md:pb-0"
          style={{ flexShrink: 0 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <ContactReveal />
          </motion.div>
        </div>

      </div>

    </section>
  );
}
