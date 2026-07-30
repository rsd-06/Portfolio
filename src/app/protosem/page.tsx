// src/app/protosem/page.tsx
// ProtoSem — Main hub for the 20-week ASADI apprenticeship at Forge Innovation and Ventures.
// Temporary section (approx. 6 months). Branch: ProtosemDev

import type { Metadata } from "next";
import ProtoSemHero from "@/components/protosem/ProtoSemHero";
import ProtoSemTimeline from "@/components/protosem/ProtoSemTimeline";

export const metadata: Metadata = {
  title: "ProtoSem",
  description:
    "Documenting my 20-week ASADI apprenticeship at Forge Innovation and Ventures, KCT Tech Park, Coimbatore. Focus: AI Agents, Multi-modal Reasoning, LLMs.",
};

export default function ProtoSemPage() {
  return (
    <main className="bg-base-bg min-h-screen w-full relative">
      <ProtoSemHero />
      <ProtoSemTimeline />
    </main>
  );
}
