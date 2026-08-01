"use client";

// src/components/protosem/weeks/Week0Content.tsx
// Week 0 — Orientation & Reflection
// Activities: 16 Personalities Test (INFJ-A), Zen Pencils narration, Icebreakers

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

const EASE = [0.19, 1, 0.22, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

export default function Week0Content() {
  return (
    <article className="w-full px-[var(--page-px)]">
      {/* Back link */}
      <motion.div
        className="pt-40 pb-6"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/protosem"
          className="inline-flex items-center gap-2 group"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to ProtoSem
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        className="max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.span
          variants={fadeUp}
          className="f-mono px-3 py-1 rounded-full border inline-block mb-4"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--accent-main)",
            borderColor: "var(--accent-soft)",
            background: "rgba(82,39,255,0.06)",
          }}
        >
          ✅ Week 0 — Completed
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="f-display"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "var(--text-primary)" }}
        >
          Orientation &amp; Reflection
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="f-accent mt-3"
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--text-secondary)",
            opacity: 0.75,
          }}
        >
          Getting to know ourselves and each other before diving into the real work.
        </motion.p>
      </motion.header>

      {/* Divider */}
      <motion.div
        className="rule max-w-4xl mt-8 mb-12"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        style={{ originX: 0 }}
      />

      {/* Content sections */}
      <motion.div
        className="max-w-4xl flex flex-col gap-16 pb-24"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* ── 16 Personalities Test ── */}
        <motion.section variants={fadeUp} aria-labelledby="personality-heading">
          <span
            className="f-mono block mb-3"
            style={{
              fontSize: "var(--text-2xs)",
              color: "var(--text-muted)",
              letterSpacing: "0.12em",
            }}
          >
            ACTIVITY 01
          </span>
          <h2
            id="personality-heading"
            className="f-display mb-4"
            style={{ fontSize: "var(--text-2xl)", color: "var(--text-primary)" }}
          >
            The 16 Personalities Test
          </h2>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            On the very first day, each member of the cohort took the{" "}
            <a
              href="https://www.16personalities.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-main)", fontWeight: 500, textDecoration: "none" }}
            >
              16 Personalities test
            </a>
            , a widely used psychometric framework based on the Myers-Briggs Type Indicator. The
            idea was to understand our own cognitive styles and how we each approach problems,
            communication, and creativity — setting the foundation for a collaborative journey.
          </p>

          {/* Personality result highlight */}
          <div
            className="mt-6 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
            style={{
              background: "linear-gradient(135deg, rgba(82,39,255,0.06) 0%, rgba(82,39,255,0.03) 100%)",
              border: "1px solid rgba(82,39,255,0.15)",
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
                <span
                  className="f-mono"
                  style={{ fontSize: "var(--text-base)", color: "var(--accent-soft)" }}
                >
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
              <a
                href="https://www.16personalities.com/infj-personality"
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
                Learn more about INFJ-A
                <ExternalLink size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
            {/* Personality image */}
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
        </motion.section>

        {/* ── Zen Pencils ── */}
        <motion.section variants={fadeUp} aria-labelledby="zen-heading">
          <span
            className="f-mono block mb-3"
            style={{
              fontSize: "var(--text-2xs)",
              color: "var(--text-muted)",
              letterSpacing: "0.12em",
            }}
          >
            ACTIVITY 02
          </span>
          <h2
            id="zen-heading"
            className="f-display mb-4"
            style={{ fontSize: "var(--text-2xl)", color: "var(--text-primary)" }}
          >
            Zen Pencils — Mark Twain: No Regrets
          </h2>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            We were asked to browse{" "}
            <a
              href="https://www.zenpencils.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-main)", fontWeight: 500, textDecoration: "none" }}
            >
              Zen Pencils
            </a>
            , a brilliant webcomic series by Gavin Aung Than that adapts inspirational quotes
            into illustrated narratives, and pick the comic that resonated with us the most.
            We then narrated our choice and explained why it connected with us personally.
          </p>
          <p
            className="mt-4"
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            I chose{" "}
            <a
              href="https://www.zenpencils.com/comic/mark-twain-no-regrets/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-main)", fontWeight: 500, textDecoration: "none" }}
            >
              Mark Twain: No Regrets
            </a>
            .
          </p>

          {/* Quote callout */}
          <blockquote
            className="my-6 pl-5 border-l-2"
            style={{ borderColor: "var(--accent-main)" }}
          >
            <p
              className="f-quote"
              style={{
                fontSize: "var(--text-xl)",
                color: "var(--text-primary)",
                lineHeight: 1.55,
              }}
            >
              &ldquo;Twenty years from now you will be more disappointed by the things you
              didn&rsquo;t do than by the ones you did do. So throw off the bowlines.&rdquo;
            </p>
            <cite
              className="f-mono block mt-2"
              style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
            >
              — Mark Twain
            </cite>
          </blockquote>

          {/* Comic image */}
          <div
            className="relative rounded-2xl overflow-hidden my-6"
            style={{ maxWidth: "600px", aspectRatio: "4/3" }}
          >
            <Image
              src="/assets/protoSemPage/zenComic.png"
              alt="Zen Pencils comic — Mark Twain No Regrets"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          {/* Narration */}
          <h3
            className="mt-6 mb-3 font-medium"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "var(--text-base)",
              color: "var(--text-primary)",
            }}
          >
            Why this comic spoke to me
          </h3>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            The comic depicts a man trapped in a dead-end job, paralyzed by comfort and
            fear, only to imagine his future self — filled with regret over all the risks
            he never took. It ends with that visceral Twain quote: throw off the bowlines.
            Sail away from the safe harbour.
          </p>
          <p
            className="mt-4"
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            As someone who tends to over-think and plan before acting — very INFJ of me —
            this hit differently. It reminded me that this apprenticeship itself is me
            throwing off the bowlines: stepping into AI and agentic systems without a
            guaranteed map, just a direction and a drive to learn. The discomfort is the
            point. The experiments that don&rsquo;t work are part of the story. Twenty years
            from now, I want to look back and say I tried, not that I waited until the
            conditions were perfect.
          </p>
          <a
            href="https://www.zenpencils.com/comic/mark-twain-no-regrets/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 group"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--accent-main)",
              textDecoration: "none",
            }}
          >
            Read the comic
            <ExternalLink size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.section>

        {/* ── Icebreakers ── */}
        <motion.section variants={fadeUp} aria-labelledby="ice-heading">
          <span
            className="f-mono block mb-3"
            style={{
              fontSize: "var(--text-2xs)",
              color: "var(--text-muted)",
              letterSpacing: "0.12em",
            }}
          >
            ACTIVITY 03
          </span>
          <h2
            id="ice-heading"
            className="f-display mb-4"
            style={{ fontSize: "var(--text-2xl)", color: "var(--text-primary)" }}
          >
            Ice-Breaking Sessions
          </h2>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            The week wrapped up with structured ice-breaking sessions designed to build
            comfort and trust within the cohort before we dive into technical work. Getting
            to know the people you&rsquo;ll be working with — their strengths, quirks, and
            backgrounds — is just as important as any technical skill. A great team is
            built on relationships, not just competencies.
          </p>
          <p
            className="mt-4"
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            Meeting people from electrical, mechanical, and embedded systems backgrounds
            reminded me that Forge is intentionally cross-disciplinary. The ASADI paradigm
            is not just software — it&rsquo;s about building intelligent systems that interact
            with the real, physical world.
          </p>
        </motion.section>
      </motion.div>
    </article>
  );
}
