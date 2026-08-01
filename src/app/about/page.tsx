// src/app/about/page.tsx
import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutIdentity from "@/components/about/AboutIdentity";
import AboutPhilosophy from "@/components/about/AboutPhilosophy";
import ContentCarousel from "@/components/about/ContentCarousel";
import HobbiesSection from "@/components/about/HobbiesSection";
import TechStack from "@/components/about/TechStack";
import LocationSection from "@/components/about/LocationSection";
import ScrollProgressTracker from "@/components/about/ScrollProgressTracker";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Sudharshan R — 3rd year Electronics and Instrumentation Engineering (EIE) student at Kumaraguru College of Technology (KCT), Coimbatore. Full-stack developer, ML enthusiast, Project Based Learner, and apprentice at Forge Innovation & Ventures (KCT Tech Park).",
  keywords: [
    "Sudharshan R", "About Sudharshan", "rsd.exe",
    "KCT", "Kumaraguru College of Technology", "Coimbatore", "Tamil Nadu", "India",
    "EIE", "Electronics and Instrumentation Engineering", "3rd year",
    "PBL", "Project Based Learning", "Project Based Learner",
    "ProtoSem", "Forge", "Forge Innovation and Ventures", "KCT Tech Park", "ASADI",
    "Full-Stack Developer", "MERN Stack", "React", "Next.js", "Machine Learning",
    "AI", "student developer", "engineering student",
  ],
  alternates: {
    canonical: "https://rsd.exe/about",
  },
  openGraph: {
    title: "About — rsd.exe | Sudharshan R",
    description:
      "Meet Sudharshan R — EIE student at KCT Coimbatore, full-stack developer, ML enthusiast, and Project Based Learner at ProtoSem (Forge Innovation & Ventures).",
    type: "profile",
    locale: "en_IN",
    siteName: "rsd.exe",
    url: "https://rsd.exe/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — rsd.exe | Sudharshan R",
    description:
      "Meet Sudharshan R — EIE student at KCT Coimbatore, full-stack developer and Project Based Learner at ProtoSem (Forge Innovation & Ventures).",
    creator: "@rsd_2006",
  },
};

// This is a Server Component — client-side interactivity is handled by
// individual child components that have their own "use client" directives.
export default function AboutPage() {
  return (
    <main className="bg-base-bg min-h-screen w-full relative">
      <ScrollProgressTracker />

      <AboutHero />
      <AboutIdentity />
      <AboutPhilosophy />
      <ContentCarousel />
      <HobbiesSection />
      <TechStack />

      <LocationSection />
    </main>
  );
}