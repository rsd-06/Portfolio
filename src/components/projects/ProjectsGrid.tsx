"use client";

import { Project } from "@/data/projects";
import dynamic from "next/dynamic";

const ProjectCard = dynamic(() => import("./ProjectCard"), { ssr: false });

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="px-[var(--page-px)] pb-32">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[10px] tracking-widest opacity-35 uppercase">all projects</span>
          <div className="w-full h-[1px] bg-[var(--color-border)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[clamp(3rem,5vw,5rem)] gap-x-[clamp(2rem,3vw,3rem)]">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
