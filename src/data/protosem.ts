// src/data/protosem.ts
// Central data store for the ProtoSem 20-week apprenticeship at
// Forge Innovation and Ventures, KCT Tech Park, Coimbatore.
// ASADI Paradigm — Agentic Systems for Autonomous Decision Intelligence
// Focus: AI Agents · Multi-modal Reasoning · LLMs
// Duration: 20 weeks (~6 months, temporary section)

export type WeekStatus = "completed" | "current" | "upcoming";

export interface ProtoSemWeek {
  id: number;          // 0-indexed week number
  slug: string;        // URL slug e.g. "week-0"
  title: string;       // Short headline
  excerpt: string;     // One-liner shown on the main timeline
  status: WeekStatus;
  tags?: string[];
}

export const PROTOSEM_WEEKS: ProtoSemWeek[] = [
  {
    id: 0,
    slug: "week-0",
    title: "Week 0 — Orientation & Reflection",
    excerpt: "16 Personalities test (INFJ-A · Advocate), Zen Pencils narration & icebreakers.",
    status: "completed",
    tags: ["Personality", "Reflection", "Icebreakers"],
  },
  {
    id: 1,
    slug: "week-1",
    title: "Week 1 — Tech-Talk & 5S",
    excerpt: "Kicked off Tech-Talk series and spent 3 days running 5S across all Forge departments.",
    status: "current",
    tags: ["5S", "Tech-Talk", "Cross-department"],
  },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: i + 2,
    slug: `week-${i + 2}`,
    title: `Week ${i + 2} — Coming Soon`,
    excerpt: "Details will be added as the program progresses.",
    status: "upcoming" as WeekStatus,
    tags: [],
  })),
];

export const PROGRAM_META = {
  company: "Forge Innovation and Ventures",
  location: "KCT Tech Park, Coimbatore",
  website: "https://www.forge-iv.co/",
  paradigm: "ASADI — Agentic Systems for Autonomous Decision Intelligence",
  focus: ["AI Agents", "Multi-modal Reasoning", "LLMs"],
  totalWeeks: 20,
  semester: "5th Semester",
  startYear: 2026,
};
