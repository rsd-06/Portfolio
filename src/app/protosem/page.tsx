// src/app/protosem/page.tsx
// ProtoSem — Main hub for the 20-week ASADI apprenticeship at Forge Innovation and Ventures.
// Temporary section (approx. 6 months). Lives on main — ProtosemDev is stale.

import ProtoSemHero from "@/components/protosem/ProtoSemHero";
import ProtoSemTimeline from "@/components/protosem/ProtoSemTimeline";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/protosem",
  title: "ProtoSem — ASADI Apprenticeship at Forge",
  eyebrow: "protosem",
  description:
    "Documenting my 20-week ASADI apprenticeship at Forge Innovation and Ventures, KCT Tech Park, Coimbatore — a Project Based Learning program at Kumaraguru College of Technology (KCT). Focus: AI Agents, Multi-modal Reasoning, LLMs, and building real products.",
  keywords: [
    "ProtoSem", "ASADI", "apprenticeship", "20-week program",
    "Forge", "Forge Innovation and Ventures", "KCT Tech Park",
    "KCT", "Kumaraguru College of Technology", "Coimbatore",
    "PBL", "Project Based Learning", "Project Based Learner",
    "AI Agents", "LLM", "Multi-modal AI", "Machine Learning",
    "Sudharshan R", "rsd.exe", "EIE", "student developer",
  ],
});

export default function ProtoSemPage() {
  return (
    <main className="bg-base-bg min-h-screen w-full relative">
      <ProtoSemHero />
      <ProtoSemTimeline />
    </main>
  );
}
