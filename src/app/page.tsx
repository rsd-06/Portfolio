// src/app/page.tsx
import LoaderScreen from "@/components/home/LoaderScreen";
import HeroStatic from "@/components/home/HeroStatic";
import MacMonitorSection from "@/components/home/MacMonitorSection";
import HorizontalProjectsSection from "@/components/home/HorizontalProjectsSection";
import TechStack from "@/components/about/TechStack";

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