"use client";

import { useEffect, useRef, useState } from "react";

type Heading = {
  level: number;
  text: string;
  id: string;
};

export default function BlogTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>(
    headings.length > 0 ? headings[0].id : ""
  );
  // Which headings are currently inside the detection band. Kept in a ref so the
  // observer callback never needs to re-subscribe.
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (headings.length === 0) return;

    const order = headings.map((h) => h.id);
    const elements = order
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // One observer for all headings, not one each. With an observer per heading
    // the active item was whichever happened to fire last, which is not the same
    // as the topmost visible heading — it read wrong when scrolling up, and when
    // two headings were on screen at once.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = visibleRef.current;

        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }

        if (visible.size > 0) {
          // Earliest in document order wins, so the highlight tracks the section
          // you are actually reading rather than the last one to cross the line.
          const topmost = order.find((id) => visible.has(id));
          if (topmost) setActiveId(topmost);
          return;
        }

        // Nothing in the band — typically mid-section, where the heading has
        // scrolled above it. Fall back to the last heading above the viewport so
        // the highlight holds instead of flickering off.
        const above = elements.filter((el) => el.getBoundingClientRect().top < 0);
        if (above.length > 0) {
          setActiveId(above[above.length - 1].id);
        } else {
          setActiveId(order[0]);
        }
      },
      // Band across the upper part of the viewport: a heading becomes active as
      // it reaches roughly the top third.
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      visibleRef.current.clear();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      className="sticky top-32 flex flex-col items-end max-h-[calc(100dvh_-_10rem)] overflow-y-auto w-full"
      aria-label="Table of contents"
    >
      <ul className="flex flex-col items-end gap-4 font-sans text-sm tracking-widest uppercase">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          // h3s are sub-headings of the h2 above them; indent and shrink so the
          // document's structure is legible. `level` was parsed but never used.
          const isSub = h.level >= 3;

          return (
            <li
              key={h.id}
              className={`transition-all duration-300 ${
                isActive
                  ? "text-text-primary font-medium"
                  : "text-text-primary/50 hover:text-text-primary/80 font-light"
              } ${isSub ? "pr-3 text-[0.8em]" : ""}`}
            >
              <a
                href={`#${h.id}`}
                aria-current={isActive ? "location" : undefined}
                className="flex items-center gap-3"
              >
                <span
                  className={`h-[1px] bg-current transition-all duration-300 ${
                    isActive ? "w-8 opacity-100" : isSub ? "w-3 opacity-30" : "w-5 opacity-40"
                  }`}
                />
                <span>{h.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
