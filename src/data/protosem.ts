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
  title: string;       // Full title, e.g. "Week 0 — Orientation"
  heading: string;     // Bare headline used in cards and page H1
  excerpt: string;     // One-liner shown on the main timeline
  status: WeekStatus;
  tags?: string[];
}

// Weeks that have a written page. Everything else is generated as a placeholder
// below, so a real week can never collide with a generated one.
const DOCUMENTED_WEEKS: ProtoSemWeek[] = [
  {
    id: 0,
    slug: "week-0",
    title: "Week 0 — Orientation & Reflection",
    heading: "Orientation & Reflection",
    excerpt: "16 Personalities test (INFJ-A · Advocate), Zen Pencils narration & icebreakers.",
    status: "completed",
    tags: ["Personality", "Reflection", "Icebreakers"],
  },
  {
    id: 1,
    slug: "week-1",
    title: "Week 1 — Tech-Talk & 5S",
    heading: "Tech-Talk & 5S",
    excerpt: "Kicked off Tech-Talk series and spent 3 days running 5S across all Forge departments.",
    status: "completed",
    tags: ["5S", "Tech-Talk", "Cross-department"],
  },
  {
    id: 7,
    slug: "week-7",
    title: "Week 7 — IoT & Embedded Systems",
    heading: "IoT & Embedded Systems",
    excerpt:
      "Built a smart-home stack on the ESP32 — local HTTP control, MQTT over the cloud, voice triggers, then a sensor-driven Firebase dashboard.",
    status: "completed",
    tags: ["ESP32", "MQTT", "Firebase", "Embedded"],
  },
];

function makePlaceholder(id: number): ProtoSemWeek {
  return {
    id,
    slug: `week-${id}`,
    title: `Week ${id} — Coming Soon`,
    heading: "Coming Soon",
    excerpt: "Details will be added as the program progresses.",
    status: "upcoming",
    tags: [],
  };
}

export const PROGRAM_META = {
  company: "Forge Innovation and Ventures",
  location: "KCT Tech Park, Coimbatore",
  website: "https://www.forge-iv.co/",
  paradigm: "ASADI — Agentic Systems for Autonomous Decision Intelligence",
  focus: ["AI Agents", "Multi-modal Reasoning", "LLMs"],
  totalWeeks: 20,
  semester: "5th Semester",
  startYear: 2026,
  // Which week the program is actually in right now (0-indexed). Kept separate
  // from `status` so "where I am" does not depend on which weeks are written up.
  currentWeekId: 10,
};

export const PROTOSEM_WEEKS: ProtoSemWeek[] = [
  ...DOCUMENTED_WEEKS,
  ...Array.from({ length: PROGRAM_META.totalWeeks }, (_, i) => i)
    .filter((id) => !DOCUMENTED_WEEKS.some((w) => w.id === id))
    .map(makePlaceholder),
].sort((a, b) => a.id - b.id);

/**
 * A week that has a real page behind it. Every "is this clickable / routable"
 * check must go through this, or a week without content becomes a 404 link.
 */
export const isDocumented = (w: ProtoSemWeek) => w.status !== "upcoming";

/** Weeks with written pages, in order. */
export const DOCUMENTED = PROTOSEM_WEEKS.filter(isDocumented);

/** Weeks elapsed so far, 1-based (week id 10 means 11 weeks in). */
export const PROGRESS_WEEKS = PROGRAM_META.currentWeekId + 1;

export const PROGRESS_PCT = Math.round(
  (PROGRESS_WEEKS / PROGRAM_META.totalWeeks) * 100
);
