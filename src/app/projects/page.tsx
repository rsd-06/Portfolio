import ProjectsView from "@/components/projects/ProjectsView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/projects",
  title: "Projects",
  description:
    "Projects by Sudharshan R — machine learning pipelines, reinforcement learning environments, developer tools, real-time collaborative apps and full-stack platforms.",
  eyebrow: "projects",
});

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] relative">
      <ProjectsView />
    </main>
  );
}
