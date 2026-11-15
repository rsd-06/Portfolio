"use client";

// src/components/protosem/weeks/week7/blocks.tsx
// Week 7 only: the few primitives the five-task write-up needs that the shared
// week blocks do not provide (sub-headings, zoomable diagrams, problem/solution
// pairs, collapsible long code, repo file links). Built from the same tokens.

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";
import { CodeBlock } from "../blocks";
import { REPO } from "./media";

/** Checklist-aligned sub-heading inside a task (h3 under the task's h2). */
export function Sub({ children }: { children: ReactNode }) {
  return (
    <h3
      className="f-mono mt-14 mb-3 pb-2"
      style={{
        fontSize: "var(--text-xs)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--accent-main)",
        fontWeight: 500,
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {children}
    </h3>
  );
}

/** Full-width diagram that opens in the shared lightbox. */
export function Diagram({
  src,
  alt,
  caption,
  aspect,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.figure
        className="mt-6"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge: ${alt}`}
          className="relative w-full rounded-xl overflow-hidden block"
          style={{
            aspectRatio: aspect,
            background: "var(--bg-base)",
            border: "1px solid var(--border-subtle)",
            cursor: "zoom-in",
            padding: 0,
          }}
        >
          <Image src={src} alt={alt} fill sizes="(max-width: 896px) 100vw, 896px" style={{ objectFit: "contain" }} />
        </button>
        {caption && (
          <figcaption className="f-accent mt-2" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            {caption}
          </figcaption>
        )}
      </motion.figure>
      <AnimatePresence>{open && <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

/** Problem → fix pairs. A list, not a table, so it never forces horizontal scroll. */
export function ProblemList({ items }: { items: { problem: ReactNode; solution: ReactNode }[] }) {
  return (
    <ol className="mt-4 flex flex-col gap-3">
      {items.map((it, i) => (
        <li
          key={i}
          className="rounded-xl p-4 grid gap-2"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
        >
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", lineHeight: 1.65 }}>
            <span className="f-mono" style={{ fontSize: "var(--text-2xs)", color: "var(--accent-main)", letterSpacing: "0.1em" }}>
              PROBLEM {String(i + 1).padStart(2, "0")} ·{" "}
            </span>
            {it.problem}
          </p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.65 }}>
            <span className="f-mono" style={{ fontSize: "var(--text-2xs)", color: "#1E8E5A", letterSpacing: "0.1em" }}>
              FIX ·{" "}
            </span>
            {it.solution}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Long code behind a disclosure — still in the DOM, still searchable, but it does not bury the page. */
export function CollapsibleCode({
  summary,
  filename,
  children,
}: {
  summary: string;
  filename: string;
  children: string;
}) {
  return (
    <details className="mt-6 group">
      <summary
        className="f-mono cursor-pointer rounded-xl px-4 py-3 select-none"
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--accent-main)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          minHeight: "44px",
          listStyle: "none",
        }}
      >
        ▸ {summary}
      </summary>
      <CodeBlock filename={filename}>{children}</CodeBlock>
    </details>
  );
}

/** Link row into this task's folder in the Forge_IOT repository. */
export function RepoFiles({ folder, files }: { folder: string; files: { name: string; note: string; path?: string }[] }) {
  return (
    <ul
      className="mt-4 rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border-subtle)", background: "var(--border-subtle)", display: "grid", gap: "1px" }}
    >
      {files.map((f) => (
        <li key={f.name} style={{ background: "var(--bg-surface)" }}>
          <a
            href={`${REPO}/${f.path ?? `tree/main/${folder}`}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 px-4 py-3"
            style={{ textDecoration: "none", minHeight: "44px" }}
          >
            <span className="f-mono" style={{ fontSize: "var(--text-xs)", color: "var(--accent-main)" }}>
              {folder}/{f.name} ↗
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{f.note}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Simple label/value table rendered as a definition list (phone-safe). */
export function PinTable({ rows, head = ["Component pin", "ESP32 pin", "Purpose"] }: { rows: [string, string, string][]; head?: string[] }) {
  return (
    <div
      className="mt-6 rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border-subtle)", background: "var(--border-subtle)", display: "grid", gap: "1px" }}
    >
      <div className="grid grid-cols-3 gap-px" style={{ background: "var(--border-subtle)" }}>
        {head.map((h) => (
          <span key={h} className="f-mono px-3 py-2" style={{ background: "var(--bg-soft)", fontSize: "var(--text-2xs)", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            {h.toUpperCase()}
          </span>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.join("|")} className="grid grid-cols-3 gap-px" style={{ background: "var(--border-subtle)" }}>
          {r.map((c, i) => (
            <span
              key={i}
              className={i < 2 ? "f-mono px-3 py-2" : "px-3 py-2"}
              style={{
                background: "var(--bg-surface)",
                fontSize: "var(--text-xs)",
                color: i === 1 ? "var(--accent-main)" : "var(--text-secondary)",
                lineHeight: 1.55,
                overflowWrap: "anywhere",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
