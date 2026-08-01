// src/app/protosem/[slug]/page.tsx
// Dynamic route for individual ProtoSem week pages.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROTOSEM_WEEKS } from "@/data/protosem";
import Week0Content from "@/components/protosem/weeks/Week0Content";
import Week1Content from "@/components/protosem/weeks/Week1Content";
import WeekNavigation from "@/components/protosem/WeekNavigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all known slugs
export async function generateStaticParams() {
  return PROTOSEM_WEEKS.filter((w) => w.status !== "upcoming").map((w) => ({
    slug: w.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const week = PROTOSEM_WEEKS.find((w) => w.slug === slug);
  if (!week) return { title: "Week not found" };
  return {
    title: week.title,
    description: week.excerpt,
  };
}

// Map slugs to content components
const WEEK_CONTENT: Record<string, React.ComponentType> = {
  "week-0": Week0Content,
  "week-1": Week1Content,
};

export default async function WeekPage({ params }: PageProps) {
  const { slug } = await params;
  const week = PROTOSEM_WEEKS.find((w) => w.slug === slug);

  if (!week || week.status === "upcoming") {
    notFound();
  }

  const ContentComponent = WEEK_CONTENT[slug];
  if (!ContentComponent) {
    notFound();
  }

  return (
    <main className="bg-base-bg min-h-screen w-full">
      <ContentComponent />
      <WeekNavigation currentSlug={slug} />
    </main>
  );
}
