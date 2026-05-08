"use client";

import { useRepoActivity } from "@/hooks/useRepoActivity";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SiGithub } from "react-icons/si";

function countToGreen(count: number): string {
  if (count === 0) return "rgba(17,17,17,0.06)"; // #ebedf0 equivalent for cream background
  if (count === 1) return "#9be9a8";
  if (count <= 3)  return "#40c463";
  if (count <= 6)  return "#30a14e";
  return "#216e39";
}

export default function RepoActivityGrid({ repoUrl, boxSize = 14 }: { repoUrl: string; boxSize?: number }) {
  const { data, loading, error } = useRepoActivity(repoUrl);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const squares = loading
    ? Array.from({ length: 30 }, (_, i) => ({ date: "", count: 0 }))
    : (data?.days ?? []);

  // derive month range label
  const label = (() => {
    if (!data?.days?.length) return "Last 30 days";
    const first = new Date(data.days[0].date + "T12:00:00");
    const last  = new Date(data.days[data.days.length - 1].date + "T12:00:00");
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(first)} – ${fmt(last)}`;
  })();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col gap-3 max-w-[52ch]"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="f-mono text-xs opacity-40 uppercase tracking-widest">
          Repo Activity · {label}
        </span>
        {!loading && data && (
          <span className="f-mono text-xs opacity-50">
            {data.total} commit{data.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {error ? (
        <p className="f-mono text-xs opacity-40">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-[3px]">
          {squares.map((day, i) => (
            <motion.div
              key={day.date || i}
              className="rounded-[3px] relative group/sq"
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: loading ? "rgba(34,197,94,0.07)" : countToGreen(day.count),
              }}
              animate={inView && !loading ? { opacity: 1 } : { opacity: loading ? 0.5 : 0 }}
              transition={{ delay: inView ? i * 0.015 : 0, duration: 0.35 }}
            >
              {/* Tooltip */}
              {day.date && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/sq:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap px-2 py-1 rounded text-[9px]"
                  style={{ fontFamily: "var(--font-dm-mono)", backgroundColor: "#111", color: "#f5f4f0" }}>
                  {day.count} commit{day.count !== 1 ? "s" : ""} · {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
