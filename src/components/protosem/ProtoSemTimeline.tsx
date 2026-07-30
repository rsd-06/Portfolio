"use client";

// src/components/protosem/ProtoSemTimeline.tsx
// Interactive vertical timeline with a Linux Tux mascot that travels
// week-by-week as the user scrolls.

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PROTOSEM_WEEKS, type ProtoSemWeek } from "@/data/protosem";

/* ── Tux SVG (inline, no external dep) ─────────────────────────── */
function TuxIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Body */}
      <ellipse cx="50" cy="80" rx="28" ry="35" fill="#1a1a1a" />
      {/* White belly */}
      <ellipse cx="50" cy="85" rx="18" ry="26" fill="#f5f4f0" />
      {/* Head */}
      <ellipse cx="50" cy="38" rx="22" ry="24" fill="#1a1a1a" />
      {/* Face white patch */}
      <ellipse cx="50" cy="43" rx="14" ry="16" fill="#f5f4f0" />
      {/* Eyes */}
      <circle cx="43" cy="36" r="4" fill="white" />
      <circle cx="57" cy="36" r="4" fill="white" />
      <circle cx="44" cy="36" r="2.5" fill="#111" />
      <circle cx="58" cy="36" r="2.5" fill="#111" />
      {/* Eye shine */}
      <circle cx="45" cy="35" r="1" fill="white" />
      <circle cx="59" cy="35" r="1" fill="white" />
      {/* Beak */}
      <path d="M44 48 Q50 55 56 48 Q53 44 50 43 Q47 44 44 48Z" fill="#f5a623" />
      {/* Feet */}
      <ellipse cx="38" cy="112" rx="11" ry="5" fill="#f5a623" />
      <ellipse cx="62" cy="112" rx="11" ry="5" fill="#f5a623" />
      {/* Wings */}
      <path d="M22 70 Q10 85 18 100 Q24 88 28 75Z" fill="#1a1a1a" />
      <path d="M78 70 Q90 85 82 100 Q76 88 72 75Z" fill="#1a1a1a" />
    </svg>
  );
}

/* ── Status badge ───────────────────────────────────────────────── */
function StatusBadge({ status }: { status: ProtoSemWeek["status"] }) {
  const config = {
    completed: { label: "Completed", bg: "rgba(82,39,255,0.12)", text: "var(--accent-text)" },
    current:   { label: "In Progress", bg: "rgba(82,39,255,0.22)", text: "var(--accent-main)" },
    upcoming:  { label: "Upcoming", bg: "rgba(0,0,0,0.06)", text: "var(--text-muted)" },
  }[status];

  return (
    <span
      className="f-mono text-[0.65rem] px-2 py-0.5 rounded-full"
      style={{ background: config.bg, color: config.text, letterSpacing: "0.06em" }}
    >
      {config.label}
    </span>
  );
}

/* ── Individual week card ───────────────────────────────────────── */
function WeekCard({
  week,
  index,
  isActive,
  onClick,
}: {
  week: ProtoSemWeek;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const isClickable = week.status !== "upcoming";
  const Tag = isClickable ? Link : "div";
  const tagProps = isClickable
    ? { href: `/protosem/${week.slug}` }
    : { onClick };

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.19, 1, 0.22, 1] }}
      className="relative flex items-start gap-4"
      style={{ flexDirection: index % 2 === 0 ? "row" : "row-reverse" }}
      id={`week-${week.id}`}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center" style={{ minWidth: "2rem" }}>
        <motion.div
          className="rounded-full border-2 flex items-center justify-center"
          style={{
            width: "2rem",
            height: "2rem",
            borderColor: week.status === "upcoming" ? "var(--border-subtle)" : "var(--accent-main)",
            background: week.status === "completed"
              ? "var(--accent-main)"
              : week.status === "current"
              ? "var(--accent-soft)"
              : "var(--bg-surface)",
          }}
          animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 1.5 }}
        >
          <span
            className="f-mono font-bold"
            style={{
              fontSize: "0.6rem",
              color: week.status === "completed" ? "#fff" : "var(--text-muted)",
            }}
          >
            {week.id}
          </span>
        </motion.div>
        {index < PROTOSEM_WEEKS.length - 1 && (
          <div
            className="mt-1"
            style={{
              width: "1px",
              flexGrow: 1,
              background:
                week.status === "completed"
                  ? "var(--accent-main)"
                  : "var(--border-subtle)",
              minHeight: "3rem",
            }}
          />
        )}
      </div>

      {/* Card */}
      {/* @ts-expect-error – polymorphic tag */}
      <Tag
        {...tagProps}
        className={`group relative mb-6 flex-1 rounded-xl border p-4 transition-all duration-300 ${
          isClickable
            ? "cursor-pointer hover:border-[var(--accent-main)] hover:shadow-lg"
            : "cursor-default opacity-50"
        }`}
        style={{
          background: "var(--bg-surface)",
          borderColor: isActive
            ? "var(--accent-main)"
            : "var(--border-subtle)",
          boxShadow: isActive ? "0 0 20px rgba(82,39,255,0.15)" : "none",
          textDecoration: "none",
          display: "block",
        }}
      >
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <span
            className="f-mono"
            style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
          >
            Week {week.id}
          </span>
          <StatusBadge status={week.status} />
        </div>
        <h3
          className="mt-1 font-medium leading-snug"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "var(--text-sm)",
            color: "var(--text-primary)",
          }}
        >
          {week.title.replace(`Week ${week.id} — `, "")}
        </h3>
        <p
          className="mt-1.5"
          style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.6 }}
        >
          {week.excerpt}
        </p>
        {week.tags && week.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {week.tags.map((tag) => (
              <span
                key={tag}
                className="f-mono rounded-md px-1.5 py-0.5"
                style={{
                  fontSize: "0.6rem",
                  background: "var(--bg-soft)",
                  color: "var(--text-muted)",
                  letterSpacing: "0.05em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {isClickable && (
          <div
            className="mt-3 flex items-center gap-1 transition-all duration-200 group-hover:gap-2"
            style={{ fontSize: "var(--text-xs)", color: "var(--accent-main)" }}
          >
            <span className="f-mono">View week</span>
            <span>→</span>
          </div>
        )}
      </Tag>
    </motion.div>
  );
}

/* ── Main Timeline ──────────────────────────────────────────────── */
export default function ProtoSemTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWeek, setActiveWeek] = useState(1); // currently in week 1

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tux Y position travels along the timeline
  const tuxY = useTransform(scrollYProgress, [0, 1], ["0%", "92%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full px-[var(--page-px)] pb-24"
      aria-label="ProtoSem Weekly Timeline"
    >
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="mb-12 max-w-7xl mx-auto"
      >
        <h2
          className="f-display"
          style={{ fontSize: "var(--text-3xl)", color: "var(--text-primary)" }}
        >
          The Journey — 20 Weeks
        </h2>
        <p
          className="mt-2 f-accent"
          style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)" }}
        >
          Click any completed or in-progress week to read more.
        </p>
      </motion.div>

      {/* Two-column layout: Tux left rail + cards right */}
      <div className="relative max-w-7xl mx-auto">
        {/* Tux traveler — hidden on very small screens, shown md+ */}
        <div
          className="hidden lg:block absolute -left-16 top-0 bottom-0 pointer-events-none"
          style={{ width: "4rem" }}
        >
          <motion.div
            style={{ y: tuxY, position: "absolute", top: 0, left: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <TuxIcon className="w-14 h-auto drop-shadow-lg" />
            </motion.div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="flex flex-col">
          {PROTOSEM_WEEKS.map((week, i) => (
            <WeekCard
              key={week.id}
              week={week}
              index={i}
              isActive={week.id === activeWeek}
              onClick={() => setActiveWeek(week.id)}
            />
          ))}
        </div>

        {/* Finish flag */}
        <motion.div
          className="flex items-center gap-3 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: "2rem",
              height: "2rem",
              background: "var(--bg-soft)",
              border: "2px dashed var(--border-subtle)",
            }}
          >
            <span style={{ fontSize: "1rem" }}>🎓</span>
          </div>
          <span
            className="f-accent"
            style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}
          >
            End of 20 weeks — Deployed Project Submission
          </span>
        </motion.div>
      </div>
    </section>
  );
}
