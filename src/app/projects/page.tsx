import type { Metadata } from "next";
import ProjectsView from "@/components/projects/ProjectsView";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects by Sudharshan R — machine learning pipelines, reinforcement learning environments, real-time collaborative apps and full-stack platforms.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] relative">
      <ProjectsView />
    </main>
  );
}
