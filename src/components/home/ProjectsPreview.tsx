// src/components/home/ProjectsPreview.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const FEATURED_PROJECTS = [
  {
    title: "SkillSync",
    tag: "Full Stack · 2025",
    description: "Skill-based collaboration platform for engineering students.",
    image: "/assets/projects/skillsync.jpg",
    href: "/projects/skillsync",
  },
  {
    title: "Dengue Prediction",
    tag: "AI · Full Stack · 2024",
    description: "District-level dengue outbreak prediction for Indian Tier-2 cities.",
    image: "/assets/projects/dengue.jpg",
    href: "/projects/dengue-prediction",
  },
  {
    title: "Portfolio v1",
    tag: "Next.js · 2025",
    description: "This website — rsd.exe personal portfolio.",
    image: "/assets/projects/portfolio.jpg",
    href: "/projects/portfolio",
  },
];

export default function ProjectsPreview() {
  return (
    <section className="px-page py-20 bg-bg text-text">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <h2 className="f-display text-2xl tracking-tighter">Projects</h2>
        <span className="f-accent text-xs opacity-60 hidden md:block mb-2">Selected work</span>
      </div>
      <div className="rule mb-12" />

      {/* Projects List */}
      <div className="flex flex-col gap-12 md:gap-0">
        {FEATURED_PROJECTS.map((project, idx) => (
          <motion.div
            key={project.title}
            className="project-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="project-card-media">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="project-card-title">{project.title}</h3>
              <span className="project-card-meta">{project.tag}</span>
              <p className="mt-4 opacity-80 f-mono text-sm max-w-md">{project.description}</p>
              
              <Link href={project.href} className="project-card-arrow w-max">
                View Project <span>→</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-16 flex justify-end">
        <Link href="/projects" className="f-mono text-xs tracking-wide opacity-55 hover:opacity-100 transition-opacity min-h-[44px] inline-flex items-center group relative">
          View all projects →
          <span className="absolute bottom-2 left-0 w-full h-[1px] bg-current scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-expo duration-base" />
        </Link>
      </div>
    </section>
  );
}
