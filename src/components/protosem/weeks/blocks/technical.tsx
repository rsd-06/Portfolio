"use client";

// Blocks for technical write-ups: code, hardware lists, pipelines, stats.

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

/**
 * Fenced code with an optional filename bar.
 *
 * No syntax-highlighting dependency — not worth the bundle for a handful of
 * snippets. The overflow handling is the important part: a <pre> without
 * max-width is the single most common cause of horizontal page scroll on
 * phones, and a scrollable region needs to be keyboard-reachable (tabIndex).
 */
export function CodeBlock({
  filename,
  language,
  children,
}: {
  filename?: string;
  language?: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the code is still selectable */
    }
  };

  return (
    <div
      className="mt-6 rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border-subtle)", background: "#0a0a0a", maxWidth: "100%" }}
    >
      {(filename || language) && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-2"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <span
            className="f-mono truncate"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.06em" }}
          >
            {filename ?? language}
          </span>
          <button
            type="button"
            onClick={copy}
            className="f-mono shrink-0"
            style={{
              fontSize: "var(--text-2xs)",
              color: copied ? "var(--accent-main)" : "var(--text-muted)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              minHeight: "44px",
              paddingInline: "0.25rem",
            }}
          >
            {copied ? "copied" : "copy"}
          </button>
        </div>
      )}
      <pre
        tabIndex={0}
        className="f-mono"
        style={{
          margin: 0,
          padding: "1rem",
          maxWidth: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          fontSize: "var(--text-2xs)",
          lineHeight: 1.7,
          color: "#ffffff",
        }}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

export type Spec = { name: string; qty?: string; role?: string };

/**
 * Hardware / components list. Deliberately a <ul> rather than a <table>:
 * tables are the classic source of horizontal overflow on narrow screens.
 */
export function SpecList({ items }: { items: Spec[] }) {
  return (
    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px rounded-xl overflow-hidden"
        style={{ background: "var(--border-subtle)", border: "1px solid var(--border-subtle)" }}>
      {items.map((s) => (
        <li key={s.name} className="flex flex-col gap-0.5 p-4" style={{ background: "var(--bg-surface)" }}>
          <div className="flex items-baseline justify-between gap-2">
            <span
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              {s.name}
            </span>
            {s.qty && (
              <span className="f-mono shrink-0" style={{ fontSize: "var(--text-2xs)", color: "var(--accent-main)" }}>
                {s.qty}
              </span>
            )}
          </div>
          {s.role && (
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {s.role}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export type Step = { title: string; body: ReactNode; meta?: string };

/**
 * Vertical step-by-step flow. Always vertical — a horizontal pipeline is
 * unreadable on a phone. Reuses the timeline's dot-and-rail language so it
 * reads as part of the same system.
 */
export function Pipeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-6 flex flex-col">
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          {/* rail */}
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute top-7 bottom-0"
              style={{ left: "0.6875rem", width: "1px", background: "var(--border-subtle)" }}
            />
          )}
          <span
            aria-hidden
            className="relative z-10 shrink-0 rounded-full flex items-center justify-center f-mono"
            style={{
              width: "1.375rem",
              height: "1.375rem",
              marginTop: "0.2rem",
              background: "var(--accent-main)",
              color: "#fff",
              fontSize: "0.625rem",
            }}
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              {step.title}
            </p>
            {step.meta && (
              <p className="f-mono mt-0.5" style={{ fontSize: "var(--text-2xs)", color: "var(--accent-main)" }}>
                {step.meta}
              </p>
            )}
            <div
              className="mt-1"
              style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7 }}
            >
              {step.body}
            </div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

/** Small headline metrics row. */
export function StatRow({ items }: { items: { value: string; label: string }[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden"
      style={{ background: "var(--border-subtle)", border: "1px solid var(--border-subtle)" }}
    >
      {items.map((s) => (
        <div key={s.label} className="flex flex-col gap-1 p-4" style={{ background: "var(--bg-surface)" }}>
          <span
            className="f-display"
            style={{ fontSize: "var(--text-xl)", color: "var(--accent-main)", lineHeight: 1 }}
          >
            {s.value}
          </span>
          <span
            className="f-mono"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.06em" }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
