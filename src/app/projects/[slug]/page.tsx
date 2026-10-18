import { PROJECTS } from "@/data/projects";
import { notFound } from "next/navigation";
import ProjectDetailHero from "@/components/projects/project-detail/ProjectDetailHero";
import ProjectDetailBody from "@/components/projects/project-detail/ProjectDetailBody";
import ProjectDetailNav from "@/components/projects/project-detail/ProjectDetailNav";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

// Generate static params at build time
export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

// Generate metadata for each project page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);
  
  if (!project) return {};

  return pageMetadata({
    path: `/projects/${project.slug}`,
    title: project.title,
    description: project.summary,
    eyebrow: project.category,
    keywords: project.tags,
  });
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: project.title,
          description: project.summary,
          url: absoluteUrl(`/projects/${project.slug}`),
          codeRepository: project.repoUrl,
          ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
          keywords: project.tags.join(", "),
          programmingLanguage: project.techStack.flatMap((t) => t.items),
          dateCreated: project.year,
          creativeWorkStatus: project.status,
          image: project.images.map((src) => absoluteUrl(src)),
          author: { "@id": `${absoluteUrl("/")}/#person` },
        }}
      />
      <ProjectDetailHero project={project} />
      <ProjectDetailBody project={project} />
      <ProjectDetailNav prev={prevProject} next={nextProject} />
    </main>
  );
}
