"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Easing
───────────────────────────────────────────────────────────── */
const EXPO = [0.19, 1, 0.22, 1] as const;

/* ─────────────────────────────────────────────────────────────
   Variant factories
   All animate TO their resting opacity — never to 1 unless
   the element's resting state actually is 1.
───────────────────────────────────────────────────────────── */

/** "sudharshan r." — fade only, lands at 0.35 */
const labelVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 0.35,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/** Headline lines — y drop + opacity, lands at opacity 1 */
const makeHeadlineVariant = (delay: number, reduced: boolean) => ({
  hidden:  { opacity: 0, y: reduced ? 0 : 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EXPO, delay },
  },
});

/** Horizontal rule — pen-stroke scaleX draw */
const makeRuleVariant = (delay: number, reduced: boolean) => ({
  hidden: {
    scaleX:  reduced ? 1 : 0,
    opacity: reduced ? 0 : 1,
  },
  visible: {
    scaleX:  1,
    opacity: 1,
    transition: { duration: 0.8, ease: EXPO, delay },
  },
});

/** Body italic lines — y + opacity, lands at 0.58 */
const makeBodyVariant = (delay: number, reduced: boolean) => ({
  hidden:  { opacity: 0, y: reduced ? 0 : 20 },
  visible: {
    opacity: 0.58,
    y: 0,
    transition: { duration: 0.7, ease: EXPO, delay },
  },
});

/** "This is some of it. →" — y + opacity, lands at 0.82 */
const makeCornerVariant = (delay: number, reduced: boolean) => ({
  hidden:  { opacity: 0, y: reduced ? 0 : 16 },
  visible: {
    opacity: 0.82,
    y: 0,
    transition: { duration: 0.8, ease: EXPO, delay },
  },
});

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export default function IdentityStatement() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const vp = { once: true, margin: "-100px" } as const;

  /*
    Animation timeline (from section entering viewport):
      0.00s  — label fades in
      0.05s  — headline line 1
      0.17s  — headline line 2   (+0.12s)
      0.38s  — rule draws        (starts while line 2 is still moving)
      0.52s  — body line 1
      0.66s  — body line 2       (+0.14s)
      0.80s  — body line 3       (+0.14s)
      1.10s  — corner text       (+0.30s after last body)
  */
  const line1Delay  = 0.05;
  const line2Delay  = 0.17;
  const ruleDelay   = 0.38;
  const body1Delay  = 0.52;
  const body2Delay  = 0.66;
  const body3Delay  = 0.80;
  const cornerDelay = 1.10;

  return (
    <section
      className="relative flex flex-col justify-center"
      style={{
        minHeight:    "100dvh",
        paddingLeft:  "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
      aria-label="About identity statement"
    >
      {/* ── Top-left label ──────────────────────────────────── */}
      <motion.p
        aria-hidden="true"
        className="absolute f-mono uppercase"
        style={{
          top:           "clamp(1.5rem, 4vw, 2.5rem)",
          left:          "var(--page-px)",
          fontSize:      "var(--text-2xs)",
          letterSpacing: "0.2em",
          color:         "var(--text-primary)",
        }}
        variants={labelVariants}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
      >
        sudharshan .r
      </motion.p>

      {/* ── Main content block ──────────────────────────────── */}
      <div
        className="flex flex-col"
        style={{ maxWidth: "clamp(280px, 60%, 720px)" }}
      >
        {/* Headline — two motion.divs, staggered, same mechanism as body lines */}
        <h2
          role="heading"
          aria-level={2}
          className="f-display"
          style={{
            fontSize:      "clamp(2.5rem, 7.5vw, 6.5rem)",
            fontWeight:    300,
            letterSpacing: "-0.03em",
            lineHeight:    1.05,
            color:         "var(--text-primary)",
          }}
        >
          <motion.div
            variants={makeHeadlineVariant(line1Delay, reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            Currently figuring
          </motion.div>

          <motion.div
            variants={makeHeadlineVariant(line2Delay, reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            things out —
          </motion.div>
        </h2>

        {/* Horizontal rule — pen-stroke draw */}
        <motion.div
          style={{
            height:          "1px",
            width:           "clamp(80px, 8vw, 120px)",
            background:      "var(--border-subtle)",
            marginTop:       "clamp(1.2rem, 2.5vw, 2rem)",
            marginBottom:    "clamp(1.2rem, 2.5vw, 2rem)",
            transformOrigin: "left center",
          }}
          variants={makeRuleVariant(ruleDelay, reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        />

        {/* Body lines — land at opacity 0.58, not 1 */}
        {[
          { text: "building software that solves real problems,", delay: body1Delay },
          { text: "learning what makes systems actually hold,",    delay: body2Delay },
          { text: "and trying to make work worth showing.",        delay: body3Delay },
        ].map(({ text, delay }, i) => (
          <motion.p
            key={i}
            className="f-accent"
            style={{
              fontSize:  "clamp(1.2rem, 4vw, 2rem)",
              lineHeight: 1.55,
              color:      "var(--text-primary)",
              fontStyle:  "italic",
              /* opacity intentionally omitted — variant owns it to prevent snap-back */
            }}
            variants={makeBodyVariant(delay, reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {text}
          </motion.p>
        ))}
      </div>

      {/* ── Bottom-right corner — lands at opacity 0.82 ──────── */}
      <motion.p
        className="absolute f-display"
        style={{
          bottom:        "clamp(2rem, 5vw, 3.5rem)",
          right:         "var(--page-px)",
          fontSize:      "clamp(1.75rem, 5.5vw, 3.5rem)",
          fontWeight:    300,
          letterSpacing: "-0.02em",
          color:         "var(--text-primary)",
          textAlign:     "right",
          cursor:        "default",
          userSelect:    "none",
        }}
        variants={makeCornerVariant(cornerDelay, reduced)}
        initial="hidden"
        whileInView="visible"
        whileHover={{ opacity: 1 }}
        viewport={vp}
      >
        This is some of it.{" "}
        <motion.span
          aria-hidden="true"
          className="f-mono inline-block"
          style={{ fontSize: "0.55em" }}
          whileHover={{ x: 6, opacity: 1 }}
          transition={{ duration: 0.35, ease: EXPO }}
        >
          →
        </motion.span>
      </motion.p>
    </section>
  );
}
