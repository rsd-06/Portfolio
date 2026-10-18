"use client";

// src/components/protosem/weeks/Week0Content.tsx
// Week 0 — Orientation & Reflection
// Activities: 16 Personalities Test (INFJ-A), Zen Pencils narration, Icebreakers

import Image from "next/image";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { WeekShell, WeekSection, Prose } from "./blocks";

/** Accent-coloured inline link that opens in a new tab. */
function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "var(--accent-main)", fontWeight: 500, textDecoration: "none" }}
    >
      {children}
    </a>
  );
}

/** Small mono "read more ↗" link placed under a block. */
function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex items-center gap-1.5 group"
      style={{
        fontFamily: "var(--font-dm-mono)",
        fontSize: "var(--text-xs)",
        color: "var(--accent-main)",
        textDecoration: "none",
      }}
    >
      {children}
      <ExternalLink size={11} className="group-hover:translate-x-0.5 transition-transform" />
    </a>
  );
}

export default function Week0Content() {
  return (
    <WeekShell
      slug="week-0"
      subtitle="Getting to know ourselves and each other before diving into the real work."
    >
      <WeekSection eyebrow="ACTIVITY 01" id="personality" title="The 16 Personalities Test">
        <Prose>
          On the very first day, each member of the cohort took the{" "}
          <InlineLink href="https://www.16personalities.com/">16 Personalities test</InlineLink>
          , a widely used psychometric framework based on the Myers-Briggs Type Indicator. The
          idea was to understand our own cognitive styles and how we each approach problems,
          communication, and creativity — setting the foundation for a collaborative journey.
        </Prose>

        {/* Personality result highlight */}
        <div
          className="mt-6 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--accent-main) 6%, transparent) 0%, color-mix(in srgb, var(--accent-main) 3%, transparent) 100%)",
            border: "1px solid color-mix(in srgb, var(--accent-main) 15%, transparent)",
          }}
        >
          <div className="flex-1">
            <span
              className="f-mono block mb-1"
              style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "0.1em" }}
            >
              MY RESULT
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="f-display"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--accent-main)" }}
              >
                Advocate
              </span>
              <span className="f-mono" style={{ fontSize: "var(--text-base)", color: "var(--accent-soft)" }}>
                INFJ-A
              </span>
            </div>
            <p
              className="mt-2"
              style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7 }}
            >
              INFJs are the rarest personality type — idealistic, empathetic, and deeply
              driven by a sense of purpose. The Assertive variant (INFJ-A) means I tend to
              stay calm under pressure and am less prone to self-doubt. This result resonated
              strongly: I often find myself thinking long-term, caring deeply about the people
              around me, and driven by the desire to create things that genuinely matter.
            </p>
            <MoreLink href="https://www.16personalities.com/infj-personality">
              Learn more about INFJ-A
            </MoreLink>
          </div>
          <div
            className="relative rounded-xl overflow-hidden flex-shrink-0"
            style={{ width: "clamp(160px, 25%, 220px)", aspectRatio: "4/3" }}
          >
            <Image
              src="/assets/protoSemPage/personalityTest.png"
              alt="16 Personalities INFJ-A Advocate result screenshot"
              fill
              className="object-cover"
              sizes="220px"
            />
          </div>
        </div>
      </WeekSection>

      <WeekSection eyebrow="ACTIVITY 02" id="zen" title="Zen Pencils — Mark Twain: No Regrets">
        <Prose>
          We were asked to browse{" "}
          <InlineLink href="https://www.zenpencils.com">Zen Pencils</InlineLink>
          , a brilliant webcomic series by Gavin Aung Than that adapts inspirational quotes
          into illustrated narratives, and pick the comic that resonated with us the most.
          We then narrated our choice and explained why it connected with us personally.
        </Prose>
        <Prose className="mt-4">
          I chose{" "}
          <InlineLink href="https://www.zenpencils.com/comic/mark-twain-no-regrets/">
            Mark Twain: No Regrets
          </InlineLink>
          .
        </Prose>

        <blockquote className="my-6 pl-5 border-l-2" style={{ borderColor: "var(--accent-main)" }}>
          <p className="f-quote" style={{ fontSize: "var(--text-xl)", color: "var(--text-primary)", lineHeight: 1.55 }}>
            &ldquo;Twenty years from now you will be more disappointed by the things you
            didn&rsquo;t do than by the ones you did do. So throw off the bowlines.&rdquo;
          </p>
          <cite className="f-mono block mt-2" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            — Mark Twain
          </cite>
        </blockquote>

        <div className="relative rounded-2xl overflow-hidden my-6" style={{ maxWidth: "600px", aspectRatio: "4/3" }}>
          <Image
            src="/assets/protoSemPage/zenComic.png"
            alt="Zen Pencils comic — Mark Twain No Regrets"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>

        <h3
          className="mt-6 mb-3 font-medium"
          style={{ fontFamily: "var(--font-dm-mono)", fontSize: "var(--text-base)", color: "var(--text-primary)" }}
        >
          Why this comic spoke to me
        </h3>
        <Prose>
          The comic depicts a man trapped in a dead-end job, paralyzed by comfort and
          fear, only to imagine his future self — filled with regret over all the risks
          he never took. It ends with that visceral Twain quote: throw off the bowlines.
          Sail away from the safe harbour.
        </Prose>
        <Prose className="mt-4">
          As someone who tends to over-think and plan before acting — very INFJ of me —
          this hit differently. It reminded me that this apprenticeship itself is me
          throwing off the bowlines: stepping into AI and agentic systems without a
          guaranteed map, just a direction and a drive to learn. The discomfort is the
          point. The experiments that don&rsquo;t work are part of the story. Twenty years
          from now, I want to look back and say I tried, not that I waited until the
          conditions were perfect.
        </Prose>
        <MoreLink href="https://www.zenpencils.com/comic/mark-twain-no-regrets/">Read the comic</MoreLink>
      </WeekSection>

      <WeekSection eyebrow="ACTIVITY 03" id="ice" title="Ice-Breaking Sessions">
        <Prose>
          The week wrapped up with structured ice-breaking sessions designed to build
          comfort and trust within the cohort before we dive into technical work. Getting
          to know the people you&rsquo;ll be working with — their strengths, quirks, and
          backgrounds — is just as important as any technical skill. A great team is
          built on relationships, not just competencies.
        </Prose>
        <Prose className="mt-4">
          Meeting people from electrical, mechanical, and embedded systems backgrounds
          reminded me that Forge is intentionally cross-disciplinary. The ASADI paradigm
          is not just software — it&rsquo;s about building intelligent systems that interact
          with the real, physical world.
        </Prose>
      </WeekSection>
    </WeekShell>
  );
}
