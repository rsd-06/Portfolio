// src/app/page.tsx
import LoaderScreen from "@/components/home/LoaderScreen";
import HeroStatic from "@/components/home/HeroStatic";
import MacMonitorSection from "@/components/home/MacMonitorSection";
import IdentityStatement from "@/components/home/IdentityStatement";
import HorizontalProjectsSection from "@/components/home/HorizontalProjectsSection";

export default function Home() {
  return (
    <main>
      <LoaderScreen />
      <HeroStatic />
      <MacMonitorSection />
      <IdentityStatement />
      <HorizontalProjectsSection />
    </main>
  );
}