import { PROJECTS } from "@/data/projects";
import { notFound } from "next/navigation";
import ProjectDetailHero from "@/components/projects/project-detail/ProjectDetailHero";
import ProjectDetailBody from "@/components/projects/project-detail/ProjectDetailBody";
import ProjectDetailNav from "@/components/projects/project-detail/ProjectDetailNav";

// Generate static params at build time
export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

// Generate metadata for each project page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);
  
  if (!project) return {};
  
  return {
    title: `${project.title} — rsd.exe`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const currentIndex = PROJECTS.indexOf(project);
  const prevProject = PROJECTS[currentIndex - 1] ?? null;
  const nextProject = PROJECTS[currentIndex + 1] ?? null;

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <ProjectDetailHero project={project} />
      <ProjectDetailBody project={project} />
      <ProjectDetailNav prev={prevProject} next={nextProject} />
    </main>
  );
}
