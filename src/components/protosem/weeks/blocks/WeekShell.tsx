"use client";

// The chrome every week page shares: back link, status badge, title, subtitle,
// divider and the staggered content column. Previously duplicated verbatim in
// each week component, with the status badge hardcoded (so a completed week
// could still claim "In Progress").

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { PROTOSEM_WEEKS } from "@/data/protosem";
import { fadeUp, stagger, EASE } from "./motion";

const BADGE: Record<string, string> = {
  completed: "Completed",
  current: "In Progress",
  upcoming: "Upcoming",
};

const BADGE_ICON: Record<string, string> = {
  completed: "✅",
  current: "🔄",
  upcoming: "🕓",
};

export default function WeekShell({
  slug,
  subtitle,
  children,
}: {
  slug: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  const week = PROTOSEM_WEEKS.find((w) => w.slug === slug);
  const status = week?.status ?? "upcoming";

  return (
    <article className="w-full px-[var(--page-px)]">
      {/* Back link. Offset derived from the nav height rather than a magic pt-40. */}
      <motion.div
        className="max-w-4xl mx-auto pt-[calc(var(--nav-h)_+_4rem)] pb-6"
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
            minHeight: "44px",
          }}
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to ProtoSem
        </Link>
      </motion.div>

      <motion.header className="max-w-4xl mx-auto" initial="hidden" animate="visible" variants={stagger}>
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
          {BADGE_ICON[status]} Week {week?.id ?? ""} — {BADGE[status]}
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="f-display"
          style={{ fontSize: "clamp(2.25rem, 7vw, 5rem)", color: "var(--text-primary)" }}
        >
          {week?.heading ?? ""}
        </motion.h1>
        {subtitle && (
          <motion.p
            variants={fadeUp}
            className="f-accent mt-3"
            style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)", opacity: 0.75 }}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.header>

      <motion.div
        className="rule max-w-4xl mx-auto mt-8 mb-12"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        style={{ originX: 0 }}
      />

      <motion.div
        className="max-w-4xl mx-auto flex flex-col gap-16 pb-24"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {children}
      </motion.div>
    </article>
  );
}
