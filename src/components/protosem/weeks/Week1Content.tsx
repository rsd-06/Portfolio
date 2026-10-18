"use client";

// src/components/protosem/weeks/Week1Content.tsx
// Week 1 — Tech-Talk & 5S
// Activities: Tech-Talk intro (like TED-Talk for technical topics), 5S across Forge departments

import {
  WeekShell,
  WeekSection,
  Prose,
  ArrowList,
  Callout,
  CardGrid,
  ChipRow,
} from "./blocks";

const DEPARTMENTS = [
  { icon: "⚡", label: "Electrical", description: "Wiring, power systems, and control boards." },
  { icon: "⚙️", label: "Mechanical", description: "Fabrication, machining, and structural components." },
  { icon: "🔌", label: "Cables & Wiring", description: "Cable management and connectivity infrastructure." },
  { icon: "🧩", label: "Microprocessors", description: "Embedded computing and controller modules." },
  { icon: "🔧", label: "Embedded Systems", description: "Firmware, PCBs, and hardware-software integration." },
];

const FIVE_S = [
  { word: "Sort", jp: "Seiri", desc: "Eliminate unnecessary items. Keep only what is needed for the current task." },
  { word: "Set in Order", jp: "Seiton", desc: "Organize the items that remain so they are easy to find, use, and return." },
  { word: "Shine", jp: "Seiso", desc: "Clean the workspace — and keep it clean. A tidy environment prevents errors." },
  { word: "Standardize", jp: "Seiketsu", desc: "Create consistent processes so the first three S's happen without thinking." },
  { word: "Sustain", jp: "Shitsuke", desc: "Make it a habit. Discipline turns good practices into permanent culture." },
];

const S_ICON = (
  <span className="f-display font-bold" style={{ fontSize: "2rem", color: "var(--accent-main)" }}>
    S
  </span>
);

export default function Week1Content() {
  return (
    <WeekShell
      slug="week-1"
      subtitle="Knowledge sharing meets kaizen — a week of talks and cross-departmental clean-ups."
    >
      <WeekSection eyebrow="ACTIVITY 01" id="techtalk" title="Tech-Talk">
        <Prose>
          Think of it as a TED-Talk, but exclusively for technical topics. Week 1 kicked
          off with the introduction of <strong style={{ color: "var(--text-primary)" }}>Tech-Talk</strong> —
          a recurring format at Forge where each participant picks a technical subject they
          care about, researches it deeply, and presents it to the cohort in an engaging,
          accessible way.
        </Prose>
        <Prose className="mt-4">
          The format is intentionally open: any topic that sits at the intersection of
          technology and curiosity qualifies. The goal is to build the habit of learning
          publicly — articulating complex ideas clearly, handling questions, and growing
          comfortable with intellectual discomfort. These skills are just as critical as
          writing code in the world of AI agents.
        </Prose>

        <ArrowList
          label="FORMAT"
          items={[
            <>Pick any technical topic you&rsquo;re curious about</>,
            "Research deeply, then distil into a 5–10 minute talk",
            "Present to the cohort — no slides required, just knowledge",
            "Open Q&A — the best part",
          ]}
        />
      </WeekSection>

      <WeekSection eyebrow="ACTIVITY 02" id="fives" title="5S — Workplace Organisation">
        <Prose>
          For the first three days of Week 1, the entire cohort was deployed across all
          departments at Forge to carry out <strong style={{ color: "var(--text-primary)" }}>5S</strong> — a
          lean manufacturing methodology originating from Toyota&rsquo;s Production System.
          The five S&rsquo;s stand for five Japanese principles of workplace organisation, each
          building on the last.
        </Prose>

        <CardGrid
          items={FIVE_S.map((s) => ({ icon: S_ICON, title: s.word, subtitle: s.jp, body: s.desc }))}
        />

        <h3
          className="mt-10 mb-4 font-medium"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "var(--text-base)",
            color: "var(--text-primary)",
          }}
        >
          Departments we worked in
        </h3>
        <ChipRow items={DEPARTMENTS} />

        <Callout label="REFLECTION">
          Working across departments — from soldering bays to embedded workstations —
          gave me a visceral understanding of what it means to operate in a
          multi-disciplinary hardware environment. 5S is deceptively simple, but the
          discipline it instills is profound. A tidy system — whether a workshop or a
          codebase — runs faster, fails safer, and scales better.
        </Callout>
      </WeekSection>
    </WeekShell>
  );
}
