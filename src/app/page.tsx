// src/app/page.tsx
import LoaderScreen from "@/components/home/LoaderScreen";
import HeroStatic from "@/components/home/HeroStatic";
import MacMonitorSection from "@/components/home/MacMonitorSection";
import HorizontalProjectsSection from "@/components/home/HorizontalProjectsSection";
import TechStack from "@/components/about/TechStack";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  title: "rsd.exe — Sudharshan R | Full-Stack Developer & Builder",
  description:
    "Portfolio of Sudharshan R — aspiring software engineer and EIE student at Kumaraguru College of Technology (KCT), Coimbatore, building full-stack products, ML pipelines, RL environments and developer tools. Projects, writing and the ProtoSem apprenticeship log.",
  eyebrow: "portfolio",
});

export default function Home() {
  return (
    <main>
      <LoaderScreen />
      <HeroStatic />
      <MacMonitorSection />
      <HorizontalProjectsSection />
      <TechStack />
    </main>
  );
}