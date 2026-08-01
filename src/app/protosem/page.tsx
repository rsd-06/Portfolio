// src/app/protosem/page.tsx
// ProtoSem — Main hub for the 20-week ASADI apprenticeship at Forge Innovation and Ventures.
// Temporary section (approx. 6 months). Branch: ProtosemDev

import type { Metadata } from "next";
import ProtoSemHero from "@/components/protosem/ProtoSemHero";
import ProtoSemTimeline from "@/components/protosem/ProtoSemTimeline";

export const metadata: Metadata = {
  title: "ProtoSem — ASADI Apprenticeship at Forge",
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
  alternates: {
    canonical: "https://rsd.exe/protosem",
  },
  openGraph: {
    title: "ProtoSem — ASADI Apprenticeship at Forge | rsd.exe",
    description:
      "Documenting my 20-week Project Based Learning apprenticeship (ASADI) at Forge Innovation and Ventures, KCT Tech Park, Coimbatore. Building AI Agents, LLMs, and real products.",
    type: "website",
    locale: "en_IN",
    siteName: "rsd.exe",
    url: "https://rsd.exe/protosem",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProtoSem — ASADI at Forge Innovation | rsd.exe",
    description:
      "Documenting my 20-week PBL apprenticeship at Forge Innovation and Ventures (KCT Tech Park, Coimbatore) — AI Agents, LLMs, multi-modal reasoning.",
    creator: "@rsd_2006",
  },
};

export default function ProtoSemPage() {
  return (
    <main className="bg-base-bg min-h-screen w-full relative">
      <ProtoSemHero />
      <ProtoSemTimeline />
    </main>
  );
}
