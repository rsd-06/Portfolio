"use client";

// src/components/projects/ProjectsView.tsx
// The interactive body of /projects (grid ⇄ marquee toggle). Split out of the
// route so the page itself can stay a Server Component and export metadata.

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import ProjectsHero from "./ProjectsHero";
import ViewToggle from "./ViewToggle";
import ProjectsGrid from "./ProjectsGrid";
import MarqueeProjects from "./MarqueeProjects";
import ScrollProgressTracker from "@/components/about/ScrollProgressTracker";

export default function ProjectsView() {
  const [viewMode, setViewMode] = useState<"grid" | "marquee">("grid");

  return (
    <>
      <ScrollProgressTracker />
      <ProjectsHero />
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <ProjectsGrid key="grid" projects={PROJECTS} />
        ) : (
          <MarqueeProjects key="marquee" projects={PROJECTS} />
        )}
      </AnimatePresence>
    </>
  );
}
