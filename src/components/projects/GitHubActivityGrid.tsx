"use client";

import { useGitHubContributions } from "@/hooks/useGitHubContributions";
import { motion, useSpring, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SiGithub } from "react-icons/si";

// Map contribution count → monochrome opacity level
function countToOpacity(count: number): number {
  if (count === 0) return 0.07;
  if (count <= 2)  return 0.22;
  if (count <= 5)  return 0.45;
  if (count <= 9)  return 0.68;
  return 0.90;
}

function AnimatedStat({ label, value, duration = 1500 }: { label: string; value: number; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const spring = useSpring(0, { bounce: 0, duration });
  const [display, setDisplay] = useState(0);

  useEffect(() => { if (inView) spring.set(value); }, [inView, value, spring]);
  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring]);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="f-mono text-[10px] opacity-45 uppercase tracking-wider">{label}</span>
      <span className="f-display text-2xl">{display}</span>
    </div>
  );
}

export default function GitHubActivityGrid() {
  const { data, loading, error } = useGitHubContributions();
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-50px" });

  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const renderSquares = () => {
    const days = data?.days ?? [];
    const source = days.length ? days : Array.from({ length: 364 }, (_, i) => ({
      date: "", count: 0, color: ""
    }));

    // Show last 52 weeks (364 days)
    const recent = source.slice(-364);

    return recent.map((day, i) => {
      const opacity = loading ? 0.07 : countToOpacity(day.count);
      return (
        <div
          key={day.date || i}
          className="w-[8px] h-[8px] md:w-[11px] md:h-[11px] rounded-[2px] cursor-default transition-opacity"
          style={{ 
            backgroundColor: "var(--color-text)", 
            opacity: inView ? opacity : 0,
            transitionDuration: "0.3s",
            transitionDelay: inView ? `${i * 1.5}ms` : "0ms"
          }}
          onMouseEnter={(e) => {
            if (!day.date) return;
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const gridRect = gridRef.current?.getBoundingClientRect();
            if (gridRect) {
              setTooltip({ date: day.date, count: day.count, x: rect.left - gridRect.left + 5, y: rect.top - gridRect.top - 10 });
            }
          }}
          onMouseLeave={() => setTooltip(null)}
        />
      );
    });
  };

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <p className="f-mono text-xs opacity-35">{error}</p>
        <p className="f-mono text-[10px] opacity-25">
          Add <code className="bg-[var(--color-border)] px-1 rounded">GITHUB_TOKEN</code> to <code className="bg-[var(--color-border)] px-1 rounded">.env.local</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 relative" ref={gridRef}>
      {/* Stats row */}
      <div className="flex gap-8 md:gap-14 flex-wrap">
        <AnimatedStat label="This Year" value={data?.thisYearTotal ?? 0} />
        <AnimatedStat label="Last 90 Days" value={data?.last90Total ?? 0} duration={1200} />
        <AnimatedStat label="Streak (days)" value={data?.streak ?? 0} duration={1000} />
      </div>

      {/* Grid */}
      <div className="relative">
        <div
          className="grid grid-flow-col overflow-x-auto py-1"
          style={{ gridTemplateRows: "repeat(7, 1fr)", gap: "3px", scrollbarWidth: "none" }}
          role="img"
          aria-label="GitHub contribution activity for rsd-06"
        >
          {renderSquares()}
        </div>

        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full px-2 py-1 rounded text-[10px] whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y, fontFamily: "var(--font-dm-mono)", backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}
          >
            {tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""} on {new Date(tooltip.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        )}
      </div>

      {/* Footer */}
      <a
        href="https://github.com/rsd-06"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 f-mono text-xs opacity-45 hover:opacity-100 transition-opacity w-fit"
      >
        <SiGithub /> github.com/rsd-06 →
      </a>
    </div>
  );
}
