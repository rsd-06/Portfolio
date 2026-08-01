"use client";

// src/components/protosem/weeks/Week1Content.tsx
// Week 1 — Tech-Talk & 5S
// Activities: Tech-Talk intro (like TED-Talk for technical topics), 5S across Forge departments

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const EASE = [0.19, 1, 0.22, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const DEPARTMENTS = [
  { name: "Electrical", icon: "⚡", description: "Wiring, power systems, and control boards." },
  { name: "Mechanical", icon: "⚙️", description: "Fabrication, machining, and structural components." },
  { name: "Cables & Wiring", icon: "🔌", description: "Cable management and connectivity infrastructure." },
  { name: "Microprocessors", icon: "🧩", description: "Embedded computing and controller modules." },
  { name: "Embedded Systems", icon: "🔧", description: "Firmware, PCBs, and hardware-software integration." },
];

const FIVE_S = [
  { letter: "S", word: "Sort", jp: "Seiri", desc: "Eliminate unnecessary items. Keep only what is needed for the current task." },
  { letter: "S", word: "Set in Order", jp: "Seiton", desc: "Organize the items that remain so they are easy to find, use, and return." },
  { letter: "S", word: "Shine", jp: "Seiso", desc: "Clean the workspace — and keep it clean. A tidy environment prevents errors." },
  { letter: "S", word: "Standardize", jp: "Seiketsu", desc: "Create consistent processes so the first three S's happen without thinking." },
  { letter: "S", word: "Sustain", jp: "Shitsuke", desc: "Make it a habit. Discipline turns good practices into permanent culture." },
];

export default function Week1Content() {
  return (
    <article className="w-full px-[var(--page-px)]">
      {/* Back link */}
      <motion.div
        className="pt-40 pb-6"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/protosem"
          className="inline-flex items-center gap-2 group"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to ProtoSem
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        className="max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.span
          variants={fadeUp}
          className="f-mono px-3 py-1 rounded-full border inline-block mb-4"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--accent-main)",
            borderColor: "var(--accent-soft)",
            background: "rgba(82,39,255,0.08)",
          }}
        >
          🔄 Week 1 — In Progress
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="f-display"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "var(--text-primary)" }}
        >
          Tech-Talk &amp; 5S
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="f-accent mt-3"
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--text-secondary)",
            opacity: 0.75,
          }}
        >
          Knowledge sharing meets kaizen — a week of talks and cross-departmental clean-ups.
        </motion.p>
      </motion.header>

      {/* Divider */}
      <motion.div
        className="rule max-w-4xl mt-8 mb-12"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        style={{ originX: 0 }}
      />

      {/* Content sections */}
      <motion.div
        className="max-w-4xl flex flex-col gap-16 pb-24"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* ── Tech-Talk ── */}
        <motion.section variants={fadeUp} aria-labelledby="techtalk-heading">
          <span
            className="f-mono block mb-3"
            style={{
              fontSize: "var(--text-2xs)",
              color: "var(--text-muted)",
              letterSpacing: "0.12em",
            }}
          >
            ACTIVITY 01
          </span>
          <h2
            id="techtalk-heading"
            className="f-display mb-4"
            style={{ fontSize: "var(--text-2xl)", color: "var(--text-primary)" }}
          >
            Tech-Talk
          </h2>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            Think of it as a TED-Talk, but exclusively for technical topics. Week 1 kicked
            off with the introduction of <strong style={{ color: "var(--text-primary)" }}>Tech-Talk</strong> —
            a recurring format at Forge where each participant picks a technical subject they
            care about, researches it deeply, and presents it to the cohort in an engaging,
            accessible way.
          </p>
          <p
            className="mt-4"
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            The format is intentionally open: any topic that sits at the intersection of
            technology and curiosity qualifies. The goal is to build the habit of learning
            publicly — articulating complex ideas clearly, handling questions, and growing
            comfortable with intellectual discomfort. These skills are just as critical as
            writing code in the world of AI agents.
          </p>

          <div
            className="mt-6 p-5 rounded-xl"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p
              className="f-mono"
              style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", letterSpacing: "0.08em" }}
            >
              FORMAT
            </p>
            <ul
              className="mt-3 flex flex-col gap-2"
              style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7 }}
            >
              <li className="flex items-start gap-2">
                <span style={{ color: "var(--accent-main)" }}>→</span>
                Pick any technical topic you&rsquo;re curious about
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "var(--accent-main)" }}>→</span>
                Research deeply, then distil into a 5–10 minute talk
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "var(--accent-main)" }}>→</span>
                Present to the cohort — no slides required, just knowledge
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "var(--accent-main)" }}>→</span>
                Open Q&amp;A — the best part
              </li>
            </ul>
          </div>
        </motion.section>

        {/* ── 5S ── */}
        <motion.section variants={fadeUp} aria-labelledby="fives-heading">
          <span
            className="f-mono block mb-3"
            style={{
              fontSize: "var(--text-2xs)",
              color: "var(--text-muted)",
              letterSpacing: "0.12em",
            }}
          >
            ACTIVITY 02
          </span>
          <h2
            id="fives-heading"
            className="f-display mb-4"
            style={{ fontSize: "var(--text-2xl)", color: "var(--text-primary)" }}
          >
            5S — Workplace Organisation
          </h2>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            For the first three days of Week 1, the entire cohort was deployed across all
            departments at Forge to carry out <strong style={{ color: "var(--text-primary)" }}>5S</strong> — a
            lean manufacturing methodology originating from Toyota&rsquo;s Production System.
            The five S&rsquo;s stand for five Japanese principles of workplace organisation, each
            building on the last.
          </p>

          {/* 5S Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIVE_S.map((s, i) => (
              <motion.div
                key={s.word}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl p-5 flex flex-col gap-2"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="f-display font-bold"
                    style={{
                      fontSize: "2rem",
                      color: "var(--accent-main)",
                      lineHeight: 1,
                    }}
                  >
                    {s.letter}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {s.word}
                    </p>
                    <p
                      className="f-mono"
                      style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}
                    >
                      {s.jp}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Departments */}
          <h3
            className="mt-10 mb-4 font-medium"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "var(--text-base)",
              color: "var(--text-primary)",
            }}
          >
            Departments we worked in
          </h3>
          <div className="flex flex-wrap gap-3">
            {DEPARTMENTS.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{dept.icon}</span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-mono)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {dept.name}
                  </p>
                  <p
                    className="f-accent"
                    style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}
                  >
                    {dept.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reflection */}
          <div
            className="mt-8 p-5 rounded-xl border-l-2"
            style={{
              borderColor: "var(--accent-main)",
              background: "var(--bg-surface)",
              borderLeftWidth: "3px",
              borderTopWidth: "1px",
              borderRightWidth: "1px",
              borderBottomWidth: "1px",
              borderStyle: "solid",
              borderTopColor: "var(--border-subtle)",
              borderRightColor: "var(--border-subtle)",
              borderBottomColor: "var(--border-subtle)",
            }}
          >
            <p
              className="f-mono mb-2"
              style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
            >
              REFLECTION
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}
            >
              Working across departments — from soldering bays to embedded workstations —
              gave me a visceral understanding of what it means to operate in a
              multi-disciplinary hardware environment. 5S is deceptively simple, but the
              discipline it instills is profound. A tidy system — whether a workshop or a
              codebase — runs faster, fails safer, and scales better.
            </p>
          </div>
        </motion.section>
      </motion.div>
    </article>
  );
}
