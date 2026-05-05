"use client";

import { useGitHubContributions, computeStreak } from "@/hooks/useGitHubContributions";
import { motion, useSpring, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { SiGithub } from "react-icons/si";

export default function GitHubActivityGrid() {
  const { data, loading, error } = useGitHubContributions("rsd-exe");
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-50px" });

  const [hoveredSquare, setHoveredSquare] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Animated counters
  const totalCommitsSpring = useSpring(0, { bounce: 0, duration: 2000 });
  const streakSpring = useSpring(0, { bounce: 0, duration: 1500 });
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayStreak, setDisplayStreak] = useState(0);

  useEffect(() => {
    if (isInView && data) {
      // The API returns total as { "2024": 312, "2025": 87, lastYear: 312 } OR just keyed by year
      // Sum up all numeric year values as fallback
      const yearTotal =
        (data.total as Record<string, number>).lastYear ??
        Object.values(data.total).reduce((sum: number, v) => sum + (typeof v === "number" ? v : 0), 0);

      const currentStreak = computeStreak(data.contributions);
      totalCommitsSpring.set(yearTotal);
      streakSpring.set(currentStreak);
    }
  }, [isInView, data, totalCommitsSpring, streakSpring]);

  useEffect(() => totalCommitsSpring.on("change", (v) => setDisplayTotal(Math.round(v))), [totalCommitsSpring]);
  useEffect(() => streakSpring.on("change", (v) => setDisplayStreak(Math.round(v))), [streakSpring]);

  // Level → opacity of --color-text (monochrome, visible on cream bg)
  const getSquareStyle = (level: number): React.CSSProperties => {
    const opacities: Record<number, number> = { 0: 0.08, 1: 0.2, 2: 0.42, 3: 0.65, 4: 0.9 };
    const opacity = opacities[level] ?? 0.08;
    return {
      backgroundColor: `var(--color-text)`,
      opacity,
    };
  };

  const renderSquares = () => {
    if (loading || !data) {
      return Array.from({ length: 52 * 7 }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 md:w-[11px] md:h-[11px] rounded-[2px]"
          style={{ backgroundColor: "var(--color-text)", opacity: 0.07 }}
        />
      ));
    }

    // Use last 364 days (52 weeks × 7 days)
    const recent = data.contributions.slice(-364);

    return recent.map((day, i) => (
      <motion.div
        key={day.date}
        initial={{ opacity: 0 }}
        animate={isInView ? getSquareStyle(day.level) : { opacity: 0 }}
        transition={{ delay: i * 0.002, duration: 0.3 }}
        className="w-2 h-2 md:w-[11px] md:h-[11px] rounded-[2px] cursor-default"
        style={isInView ? getSquareStyle(day.level) : { opacity: 0 }}
        onMouseEnter={(e) => {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const gridRect = gridRef.current?.getBoundingClientRect();
          if (gridRect) {
            setHoveredSquare({
              date: day.date,
              count: day.count,
              x: rect.left - gridRect.left + rect.width / 2,
              y: rect.top - gridRect.top - 10,
            });
          }
        }}
        onMouseLeave={() => setHoveredSquare(null)}
      />
    ));
  };

  if (error) {
    return (
      <p className="f-mono text-xs opacity-35">{error}</p>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative" ref={gridRef}>
      <div className="relative">
        {/* Contribution squares */}
        <div
          className="grid grid-flow-col overflow-x-auto py-1"
          style={{
            gridTemplateRows: "repeat(7, 1fr)",
            gap: "3px",
            scrollbarWidth: "none",
          }}
          role="img"
          aria-label="GitHub contribution activity for rsd-exe"
        >
          {renderSquares()}
        </div>

        {/* Hover tooltip */}
        {hoveredSquare && (
          <div
            className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full px-2 py-1 rounded text-[10px]"
            style={{
              left: hoveredSquare.x,
              top: hoveredSquare.y,
              fontFamily: "var(--font-dm-mono)",
              backgroundColor: "var(--color-text)",
              color: "var(--color-bg)",
            }}
          >
            {hoveredSquare.count} contribution{hoveredSquare.count !== 1 ? "s" : ""} on{" "}
            {new Date(hoveredSquare.date + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
      </div>

      {/* Stats + link row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-8 f-mono text-xs">
          <div className="flex flex-col gap-1">
            <span className="opacity-45">Contributions this year</span>
            <span className="opacity-85">{loading ? "—" : `${displayTotal} commits`}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="opacity-45">Current streak</span>
            <span className="opacity-85">{loading ? "—" : `${displayStreak} days`}</span>
          </div>
        </div>

        <a
          href="https://github.com/rsd-exe"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 f-mono text-xs opacity-55 hover:opacity-100 transition-opacity"
        >
          <SiGithub /> github.com/rsd-exe →
        </a>
      </div>
    </div>
  );
}
