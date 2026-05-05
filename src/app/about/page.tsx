"use client";

import { useRef } from "react";
import AboutHero from "@/components/about/AboutHero";
import AboutIdentity from "@/components/about/AboutIdentity";
import AboutPhilosophy from "@/components/about/AboutPhilosophy";
import ContentCarousel from "@/components/about/ContentCarousel";
import HobbiesSection from "@/components/about/HobbiesSection";
import TechStack from "@/components/about/TechStack";

import LocationSection from "@/components/about/LocationSection";
import ScrollProgressTracker from "@/components/about/ScrollProgressTracker";

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