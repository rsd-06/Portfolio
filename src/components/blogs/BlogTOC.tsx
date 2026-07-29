"use client";

import { useEffect, useState } from "react";

type Heading = {
  level: number;
  text: string;
  id: string;
};

export default function BlogTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>(headings.length > 0 ? headings[0].id : "");

  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>();
    
    // Set up intersection observers for each heading
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveId(heading.id);
              }
            });
          },
          { rootMargin: "-20% 0% -60% 0%" }
        );
        observer.observe(element);
        observers.set(heading.id, observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32 flex flex-col items-end max-h-[calc(100vh-10rem)] overflow-y-auto w-full">
      <ul className="flex flex-col items-end gap-4 font-sans text-sm tracking-widest uppercase">
        {headings.map((h, i) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={i}
              className={`transition-all duration-300 ${
                isActive 
                  ? "text-text-primary font-medium" 
                  : "text-text-primary/50 hover:text-text-primary/80 font-light"
              }`}
            >
              <a href={`#${h.id}`} className="flex items-center gap-3">
                <span className={`h-[1px] bg-current transition-all duration-300 ${isActive ? "w-8 opacity-100" : "w-5 opacity-40"}`} />
                <span>{h.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
