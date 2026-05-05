"use client";

interface ViewToggleProps {
  viewMode: "grid" | "marquee";
  setViewMode: (mode: "grid" | "marquee") => void;
}

export default function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex justify-end px-[var(--page-px)] mb-8">
      <div className="flex gap-4">
        <button
          onClick={() => setViewMode("grid")}
          className={`font-mono text-xs transition-opacity duration-200 ${
            viewMode === "grid" ? "opacity-100 underline underline-offset-4" : "opacity-35 hover:opacity-70"
          }`}
          aria-pressed={viewMode === "grid"}
          aria-label="Switch to grid view"
        >
          [Grid]
        </button>
        <button
          onClick={() => setViewMode("marquee")}
          className={`font-mono text-xs transition-opacity duration-200 ${
            viewMode === "marquee" ? "opacity-100 underline underline-offset-4" : "opacity-35 hover:opacity-70"
          }`}
          aria-pressed={viewMode === "marquee"}
          aria-label="Switch to marquee view"
        >
          [Marquee]
        </button>
      </div>
    </div>
  );
}
