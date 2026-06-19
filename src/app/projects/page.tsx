"use client";

import { PROJECTS } from "@/data/projects";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ViewToggle from "@/components/projects/ViewToggle";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import MarqueeProjects from "@/components/projects/MarqueeProjects";
import ScrollProgressTracker from "@/components/about/ScrollProgressTracker";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "marquee">("grid");

  return (
    <main className="min-h-screen bg-[var(--color-bg)] relative">
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
    </main>
  );
}
