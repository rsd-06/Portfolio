"use client";

// src/components/blogs/ShareSheet.tsx
// Share a post: a live, animated version of its share card (the same artwork
// as its og:image) plus the ways to send it. `ShareButton` is the trigger used
// in the post header/footer and on each blog-list card.

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, Link2, Mail, Share2, X } from "lucide-react";
import { FaLinkedinIn, FaRedditAlien, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { artworkFor } from "@/lib/artwork";
import { SITE_URL } from "@/lib/site";
import { useScrollLock } from "@/hooks/useScrollLock";
import { renderArtwork } from "./renderArtwork";
import type { BlogSummary } from "@/lib/mdx";


type Target = { label: string; icon: IconType; href: (url: string, post: BlogSummary) => string };

const enc = encodeURIComponent;
const TARGETS: Target[] = [
  { label: "X", icon: FaXTwitter, href: (u, p) => `https://x.com/intent/post?text=${enc(p.title)}&url=${enc(u)}` },
  { label: "LinkedIn", icon: FaLinkedinIn, href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(u)}` },
  { label: "WhatsApp", icon: FaWhatsapp, href: (u, p) => `https://wa.me/?text=${enc(`${p.title} — ${u}`)}` },
  { label: "Reddit", icon: FaRedditAlien, href: (u, p) => `https://www.reddit.com/submit?url=${enc(u)}&title=${enc(p.title)}` },
  { label: "Email", icon: Mail as unknown as IconType, href: (u, p) => `mailto:?subject=${enc(p.title)}&body=${enc(`${p.excerpt}\n\n${u}`)}` },
];

const EASE = [0.19, 1, 0.22, 1] as const;

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** The on-site twin of app/og/blog/[slug]: same layout, artwork animated in. */
function ArticleCard({ post }: { post: BlogSummary }) {
  return (
    <div
      className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border bg-white"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
    >
      <div className="flex-1 flex flex-col justify-between gap-6 p-5 sm:p-7 min-w-0">
        <div className="flex flex-wrap items-center gap-2 f-mono text-2xs uppercase tracking-[0.18em]">
          <span style={{ color: "var(--text-muted)" }}>rsd.exe / blog</span>
          <span className="rounded-full px-2.5 py-0.5" style={{ color: "var(--accent-main)", border: "1px solid var(--accent-soft)" }}>
            {post.category}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <p className="f-display text-[clamp(1.6rem,4.5vw,2.4rem)] leading-[1.05] font-normal tracking-[-0.02em]">{post.title}</p>
          <p className="f-accent text-base leading-snug line-clamp-3" style={{ color: "var(--text-secondary)" }}>
            {post.excerpt}
          </p>
        </div>
        <p className="f-mono text-2xs uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
          Sudharshan R · {formatDate(post.date)} · {post.readTime}
        </p>
      </div>
      <div
        className="flex items-center justify-center p-5 sm:w-[42%] border-t sm:border-t-0 sm:border-l"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
      >
        <div className="art-float w-[min(220px,60vw)] sm:w-full max-w-[240px] aspect-square">
          {/* key on slug so reopening the sheet replays the animation */}
          <div key={post.slug} className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
            {renderArtwork(artworkFor(post.slug, post.category), { animated: true })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareSheet({ post, onClose }: { post: BlogSummary; onClose: () => void }) {
  useScrollLock(true);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  // The sheet only ever renders on the client (it opens on a click), so reading
  // navigator here can't cause a hydration mismatch.
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;
  const url = `${SITE_URL}/blogs/${post.slug}`;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the URL is still visible to select by hand */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: post.title, text: post.excerpt, url });
    } catch {
      /* dismissed */
    }
  };

  const pill =
    "f-mono text-xs uppercase tracking-widest inline-flex items-center gap-2 rounded-full border px-4 min-h-[44px] transition-colors hover:bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)]";

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{ background: "color-mix(in srgb, #111111 45%, transparent)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent
        className="w-full max-w-[720px] max-h-[92dvh] overflow-y-auto rounded-3xl p-4 sm:p-6 flex flex-col gap-5"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)", boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }}
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="f-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Share this post
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close share sheet"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)]"
          >
            <X size={18} />
          </button>
        </div>

        <ArticleCard post={post} />

        <div className="flex flex-wrap gap-2.5">
          {canNativeShare && (
            <button onClick={nativeShare} className={pill} style={{ background: "var(--text-primary)", color: "var(--bg-base)", borderColor: "var(--text-primary)" }}>
              <Share2 size={14} /> Share…
            </button>
          )}
          <button onClick={copy} className={pill} style={{ borderColor: "var(--border-subtle)" }} aria-live="polite">
            {copied ? <Check size={14} /> : <Link2 size={14} />} {copied ? "Copied" : "Copy link"}
          </button>
          {TARGETS.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href(url, post)}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
              style={{ borderColor: "var(--border-subtle)" }}
              aria-label={`Share on ${label} — opens in new tab`}
            >
              <Icon size={14} /> {label}
            </a>
          ))}
          <a
            href={`/og/blog/${post.slug}`}
            download={`${post.slug}.png`}
            className={pill}
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <Download size={14} /> Card
          </a>
        </div>

        <p className="f-mono text-2xs break-all" style={{ color: "var(--text-muted)" }}>
          {url}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function ShareButton({ post, variant = "pill" }: { post: BlogSummary; variant?: "pill" | "icon" }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const openSheet = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={openSheet}
          aria-label={`Share “${post.title}”`}
          className="inline-flex items-center justify-center w-11 h-11 rounded-full opacity-50 hover:opacity-100 hover:bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)] transition-opacity"
        >
          <Share2 size={16} />
        </button>
      ) : (
        <button
          onClick={openSheet}
          className="f-mono text-xs uppercase tracking-widest inline-flex items-center gap-2 rounded-full border px-4 min-h-[44px] transition-colors hover:bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)]"
          style={{ borderColor: "color-mix(in srgb, var(--color-text) 20%, transparent)" }}
        >
          <Share2 size={14} /> Share
        </button>
      )}
      {/* Portal only exists once opened, i.e. after a client-side click. */}
      {open && createPortal(<AnimatePresence>{<ShareSheet post={post} onClose={close} />}</AnimatePresence>, document.body)}
    </>
  );
}
