"use client";

// src/components/protosem/WeekNavigation.tsx
// Prev/Next navigation between completed week pages.

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PROTOSEM_WEEKS } from "@/data/protosem";

interface WeekNavigationProps {
  currentSlug: string;
}

export default function WeekNavigation({ currentSlug }: WeekNavigationProps) {
  const navigableWeeks = PROTOSEM_WEEKS.filter((w) => w.status !== "upcoming");
  const currentIdx = navigableWeeks.findIndex((w) => w.slug === currentSlug);
  const prev = currentIdx > 0 ? navigableWeeks[currentIdx - 1] : null;
  const next = currentIdx < navigableWeeks.length - 1 ? navigableWeeks[currentIdx + 1] : null;

  return (
    <motion.nav
      className="w-full px-[var(--page-px)] pb-20 max-w-4xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      aria-label="Week navigation"
    >
      <div
        className="w-full h-px mb-10"
        style={{ background: "var(--border-subtle)" }}
      />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {prev ? (
          <Link
            href={`/protosem/${prev.slug}`}
            className="group flex items-center gap-3 rounded-xl border px-5 py-3 transition-all duration-200 hover:border-[var(--accent-main)]"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft
              size={16}
              style={{ color: "var(--text-muted)" }}
              className="transition-transform group-hover:-translate-x-1"
            />
            <div>
              <p
                className="f-mono"
                style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.08em" }}
              >
                Previous
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-primary)",
                }}
              >
                Week {prev.id}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href="/protosem"
            className="group flex items-center gap-3 rounded-xl border px-5 py-3 transition-all duration-200 hover:border-[var(--accent-main)]"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft
              size={16}
              style={{ color: "var(--text-muted)" }}
              className="transition-transform group-hover:-translate-x-1"
            />
            <div>
              <p
                className="f-mono"
                style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.08em" }}
              >
                Back to
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-primary)",
                }}
              >
                ProtoSem
              </p>
            </div>
          </Link>
        )}

        {next && (
          <Link
            href={`/protosem/${next.slug}`}
            className="group flex items-center gap-3 rounded-xl border px-5 py-3 transition-all duration-200 hover:border-[var(--accent-main)]"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              textDecoration: "none",
            }}
          >
            <div className="text-right">
              <p
                className="f-mono"
                style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.08em" }}
              >
                Next
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-primary)",
                }}
              >
                Week {next.id}
              </p>
            </div>
            <ArrowRight
              size={16}
              style={{ color: "var(--text-muted)" }}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
