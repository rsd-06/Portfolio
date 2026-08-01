"use client";

// src/components/protosem/ProtoSemHero.tsx
// Hero section for the ProtoSem page with animated intro and program details.

import { motion } from "framer-motion";
import { PROGRAM_META } from "@/data/protosem";
import { ExternalLink } from "lucide-react";

const FOCUS_AREAS = PROGRAM_META.focus;

export default function ProtoSemHero() {
  return (
    <section
      className="pt-48 pb-20 w-full px-[var(--page-px)] relative bg-base-bg"
      aria-label="ProtoSem Introduction"
    >
      {/* Background accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-0 right-0 flex justify-center"
      >
        <div
          style={{
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(82,39,255,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Temporary badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 inline-flex items-center gap-2"
      >
        <span
          className="f-mono px-3 py-1 rounded-full border"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--accent-main)",
            borderColor: "var(--accent-soft)",
            background: "rgba(82,39,255,0.06)",
            letterSpacing: "0.08em",
          }}
        >
          ⚡ Temporary — ~6 months · 20 weeks
        </span>
      </motion.div>

      {/* Page title */}
      <motion.h1
        className="f-display"
        style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", color: "var(--text-primary)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
      >
        ProtoSem
      </motion.h1>

      {/* Sub-label */}
      <motion.p
        className="f-accent mt-2"
        style={{
          fontSize: "var(--text-xl)",
          color: "var(--text-secondary)",
          opacity: 0.75,
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 0.75, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
      >
        Prototyping Semester — ASADI Paradigm
      </motion.p>

      {/* Divider */}
      <motion.div
        className="rule mt-8 mb-10 max-w-7xl"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
        style={{ originX: 0 }}
      />

      {/* Info grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
        }}
      >
        {/* Company */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col gap-1"
        >
          <span
            className="f-mono"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            COMPANY
          </span>
          <a
            href={PROGRAM_META.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 group"
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-medium"
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "var(--text-sm)",
                color: "var(--text-primary)",
              }}
            >
              {PROGRAM_META.company}
            </span>
            <ExternalLink
              size={12}
              className="opacity-0 group-hover:opacity-60 transition-opacity"
              style={{ color: "var(--accent-main)" }}
            />
          </a>
          <span
            className="f-accent"
            style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
          >
            {PROGRAM_META.location}
          </span>
        </motion.div>

        {/* Paradigm */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col gap-1"
        >
          <span
            className="f-mono"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            PARADIGM
          </span>
          <span
            className="font-medium leading-snug"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "var(--text-sm)",
              color: "var(--text-primary)",
            }}
          >
            {PROGRAM_META.paradigm}
          </span>
        </motion.div>

        {/* Focus areas */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col gap-2"
        >
          <span
            className="f-mono"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            FOCUS AREAS
          </span>
          <div className="flex flex-wrap gap-2">
            {FOCUS_AREAS.map((area) => (
              <span
                key={area}
                className="f-mono px-2.5 py-1 rounded-lg"
                style={{
                  fontSize: "var(--text-xs)",
                  background: "rgba(82,39,255,0.1)",
                  color: "var(--accent-text)",
                  border: "1px solid rgba(82,39,255,0.2)",
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Program stats */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col gap-1"
        >
          <span
            className="f-mono"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            PROGRAM
          </span>
          <span
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "var(--text-sm)",
              color: "var(--text-primary)",
            }}
          >
            {PROGRAM_META.totalWeeks}-week apprenticeship
          </span>
          <span
            className="f-accent"
            style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
          >
            {PROGRAM_META.semester} · {PROGRAM_META.startYear}
          </span>
        </motion.div>

        {/* Deliverable */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col gap-1"
        >
          <span
            className="f-mono"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            END GOAL
          </span>
          <span
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "var(--text-sm)",
              color: "var(--text-primary)",
            }}
          >
            Deployed AI Project
          </span>
          <span
            className="f-accent"
            style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
          >
            Submitted at week 20 completion
          </span>
        </motion.div>

        {/* Progress pill */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col gap-2"
        >
          <span
            className="f-mono"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            PROGRESS
          </span>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: "6px", background: "var(--bg-soft)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--accent-main)" }}
                initial={{ width: 0 }}
                animate={{ width: "10%" }} // 2/20 weeks = 10%
                transition={{ duration: 1.2, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
              />
            </div>
            <span
              className="f-mono"
              style={{ fontSize: "var(--text-xs)", color: "var(--accent-main)", minWidth: "3rem" }}
            >
              2 / 20
            </span>
          </div>
          <span
            className="f-accent"
            style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
          >
            Weeks completed so far
          </span>
        </motion.div>
      </motion.div>

      {/* Intro paragraph */}
      <motion.div
        className="mt-12 max-w-2xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <p
          style={{
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
          }}
        >
          <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>ProtoSem</strong>{" "}
          is my Prototyping Semester — a structured 20-week apprenticeship under the{" "}
          <em>ASADI paradigm</em> at{" "}
          <a
            href={PROGRAM_META.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-main)", textDecoration: "none", fontWeight: 500 }}
          >
            Forge Innovation and Ventures
          </a>
          , KCT Tech Park, Coimbatore. As a 5th-semester student, I am deeply immersed in the
          domains of AI agents, multi-modal reasoning, and large language models — culminating
          in a deployed project at the end of the program. This page is a living journal of
          that journey, week by week.
        </p>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="mt-10 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <span className="scroll-hint">scroll to explore weeks</span>
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ fontSize: "0.8rem" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
