"use client";

// Text-level primitives shared by week pages.

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "./motion";

/** A body paragraph. Replaces the inline style object repeated ~15x per week. */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={className}
      style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", lineHeight: 1.8 }}
    >
      {children}
    </p>
  );
}

/** Emphasised inline term. */
export function Term({ children }: { children: ReactNode }) {
  return (
    <strong
      style={{
        color: "var(--accent-main)",
        fontWeight: 600,
        backgroundColor: "color-mix(in srgb, var(--accent-main) 15%, transparent)",
        padding: "0.1em 0.3em",
        borderRadius: "0.25rem",
      }}
    >
      {children}
    </strong>
  );
}

/** One numbered activity section with an eyebrow label. */
export function WeekSection({
  eyebrow,
  id,
  title,
  children,
}: {
  eyebrow: string;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.section variants={fadeUp} aria-labelledby={`${id}-heading`}>
      <span
        className="f-mono block mb-3"
        style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.12em" }}
      >
        {eyebrow}
      </span>
      <h2
        id={`${id}-heading`}
        className="f-display mb-4"
        style={{ fontSize: "var(--text-2xl)", color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

/** Boxed list with arrow markers. */
export function ArrowList({ label, items }: { label?: string; items: ReactNode[] }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-6 p-5 rounded-xl"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
    >
      {label && (
        <p
          className="f-mono"
          style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", letterSpacing: "0.08em" }}
        >
          {label}
        </p>
      )}
      <ul
        className={label ? "mt-3 flex flex-col gap-2" : "flex flex-col gap-2"}
        style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7 }}
      >
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span style={{ color: "var(--accent-main)", flexShrink: 0 }}>→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/** Left-accent callout, e.g. a reflection. */
export function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-8 p-5 rounded-xl"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderLeft: "3px solid var(--accent-main)",
      }}
    >
      <p
        className="f-mono mb-2"
        style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
      >
        {label}
      </p>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.8 }}>
        {children}
      </div>
    </motion.div>
  );
}

export type Card = { icon?: ReactNode; title: string; subtitle?: string; body: ReactNode };

/** Responsive card grid. Single column on phones by design. */
export function CardGrid({ items, columns = 3 }: { items: Card[]; columns?: 2 | 3 }) {
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`mt-8 grid grid-cols-1 ${cols} gap-4`}>
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="rounded-xl p-5 flex flex-col gap-2"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            {item.icon && <span style={{ fontSize: "1.35rem", lineHeight: 1 }}>{item.icon}</span>}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {item.title}
              </p>
              {item.subtitle && (
                <p className="f-mono" style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.65 }}>
            {item.body}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** Small labelled chips, e.g. tech used. */
export function ChipRow({ items }: { items: { icon?: ReactNode; label: string; description?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((chip, i) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
        >
          {chip.icon && <span style={{ fontSize: "1.1rem" }}>{chip.icon}</span>}
          <div>
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              {chip.label}
            </p>
            {chip.description && (
              <p className="f-accent" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                {chip.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
