// src/lib/llms.ts
// Builds /llms.txt (a linked summary, per llmstxt.org) and /llms-full.txt (the
// same plus full project write-ups and post bodies) from the data the site
// renders, so what LLMs read can never drift from what visitors see.

import { PROJECTS } from "@/data/projects";
import { DOCUMENTED, PROGRAM_META } from "@/data/protosem";
import { CONTACT_EMAIL, SOCIAL } from "@/data/socials";
import { getAllBlogs } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/seo";

export function buildLlmsTxt({ full }: { full: boolean }): string {
  const blogs = getAllBlogs();
  const out: string[] = [];

  out.push(
    "# Sudharshan R (rsd.exe)",
    "",
    "> Portfolio of Sudharshan R — Electronics and Instrumentation Engineering student at Kumaraguru College of Technology (KCT), Coimbatore, India. Builds full-stack products, machine-learning pipelines, reinforcement-learning environments and developer tools, and documents a 20-week ASADI apprenticeship at Forge Innovation and Ventures (ProtoSem).",
    "",
    `Contact: ${CONTACT_EMAIL}. Profiles: ${Object.values(SOCIAL)
      .map((s) => `${s.label} ${s.href}`)
      .join(" · ")}.`,
    "",
    "## Pages",
    `- [Home](${absoluteUrl("/")}): featured work and the reel`,
    `- [About](${absoluteUrl("/about")}): background, philosophy, hobbies and tech stack`,
    `- [Projects](${absoluteUrl("/projects")}): all projects with GitHub activity`,
    `- [Blogs](${absoluteUrl("/blogs")}): writing`,
    `- [ProtoSem](${absoluteUrl("/protosem")}): ${PROGRAM_META.paradigm} apprenticeship log at ${PROGRAM_META.company}`,
    `- [Contact](${absoluteUrl("/contact")})`,
    "",
    "## Projects"
  );

  for (const p of PROJECTS) {
    out.push(
      `- [${p.title}](${absoluteUrl(`/projects/${p.slug}`)}): ${p.summary} (${p.category}, ${p.year}, ${p.status}${p.repoUrl ? `; code: ${p.repoUrl}` : ""}${p.liveUrl ? `; live: ${p.liveUrl}` : ""})`
    );
  }

  out.push("", "## Writing");
  for (const b of blogs) {
    out.push(`- [${b.title}](${absoluteUrl(`/blogs/${b.slug}`)}): ${b.excerpt} (${b.date})`);
  }

  out.push("", "## ProtoSem weeks");
  for (const w of DOCUMENTED) {
    out.push(`- [${w.title}](${absoluteUrl(`/protosem/${w.slug}`)}): ${w.excerpt}`);
  }

  if (full) {
    out.push("", "---", "", "# Project details");
    for (const p of PROJECTS) {
      out.push(
        "",
        `## ${p.title}`,
        `URL: ${absoluteUrl(`/projects/${p.slug}`)}`,
        `Tagline: ${p.tagline}`,
        `Problem: ${p.problem}`,
        `Objective: ${p.objective}`,
        `Approach: ${p.approach}`,
        `Solution: ${p.solution}`,
        `Outcome: ${p.achievement}`,
        `Stack: ${p.techStack.map((t) => `${t.category}: ${t.items.join(", ")}`).join("; ")}`
      );
    }
    out.push("", "---", "", "# Posts");
    for (const b of blogs) {
      out.push("", `## ${b.title}`, `URL: ${absoluteUrl(`/blogs/${b.slug}`)} · ${b.date} · ${b.category}`, "", b.content.trim());
    }
  }

  return out.join("\n") + "\n";
}

export function llmsResponse(full: boolean) {
  return new Response(buildLlmsTxt({ full }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
