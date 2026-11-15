"use client";

// src/components/protosem/weeks/week7/TaskNav.tsx
// Floating task switcher for the Week 7 page: a frosted pill fixed to the bottom of the
// viewport that jumps between the five tasks and highlights the one being read.
// It only appears once the reader has scrolled past the hero, and it scrolls through Lenis
// (which owns window scroll) with a native fallback when Lenis is off (reduced motion).

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/components/providers/LenisProvider";

export const TASK_NAV = [
  { id: "overview", n: "◎", label: "Overview" },
  { id: "task-1", n: "01", label: "Web server" },
  { id: "task-2", n: "02", label: "MQTT" },
  { id: "task-3", n: "03", label: "IFTTT" },
  { id: "task-4", n: "04", label: "Firebase" },
  { id: "task-5", n: "05", label: "Logging" },
  { id: "wrap-up", n: "✓", label: "Wrap-up" },
] as const;

const OFFSET = 96; // clears the fixed navbar

export default function TaskNav() {
  const lenis = useLenis();
  const [active, setActive] = useState<string>(TASK_NAV[0].id);
  const [visible, setVisible] = useState(false);

  // Show after the hero; hide again at the very top so it does not sit on the title.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section = the one crossing the band just under the navbar.
  useEffect(() => {
    const els = TASK_NAV.map((t) => document.getElementById(`${t.id}-heading`)?.closest("section")).filter(
      (el): el is HTMLElement => !!el,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = TASK_NAV.find((t) => e.target.querySelector(`#${t.id}-heading`))?.id;
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Keep the active chip in view when the pill is scrolled sideways (phones).
  useEffect(() => {
    document
      .querySelector<HTMLElement>(`nav[aria-label="IoT tasks"] button[aria-current]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active, visible]);

  const go = (id: string) => {
    const el = document.getElementById(`${id}-heading`)?.closest("section");
    if (!el) return;
    setActive(id);
    if (lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: -OFFSET });
    } else {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET, behavior: "auto" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="IoT tasks"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="fixed left-1/2 z-[90] -translate-x-1/2"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))", maxWidth: "calc(100vw - 1.5rem)" }}
        >
          <ul
            className="flex items-center gap-1 p-1.5 rounded-full overflow-x-auto"
            style={{
              background: "color-mix(in srgb, var(--bg-base) 92%, transparent)",
              backdropFilter: "blur(14px) saturate(1.4)",
              WebkitBackdropFilter: "blur(14px) saturate(1.4)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              scrollbarWidth: "none",
            }}
          >
            {TASK_NAV.map((t) => {
              const on = active === t.id;
              return (
                <li key={t.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(t.id)}
                    aria-current={on ? "true" : undefined}
                    aria-label={`${t.n === "◎" || t.n === "✓" ? "" : `Task ${t.n}: `}${t.label}`}
                    className="f-mono flex items-center gap-2 rounded-full transition-colors"
                    style={{
                      minHeight: "44px",
                      minWidth: "44px",
                      padding: on ? "0 0.95rem" : "0 0.7rem",
                      justifyContent: "center",
                      fontSize: "var(--text-2xs)",
                      letterSpacing: "0.06em",
                      background: on ? "var(--accent-main)" : "transparent",
                      color: on ? "#fff" : "var(--text-secondary)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span>{t.n}</span>
                    {/* Label only on the active chip below 640px, on every chip above it. */}
                    <span className={on ? "inline" : "hidden sm:inline"}>{t.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
