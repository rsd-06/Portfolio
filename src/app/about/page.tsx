"use client";

import { useRef } from "react";
import AboutHero from "@/components/about/AboutHero";
import AboutIdentity from "@/components/about/AboutIdentity";
import AboutPhilosophy from "@/components/about/AboutPhilosophy";
import ContentCarousel from "@/components/about/ContentCarousel";
import TechStack from "@/components/about/TechStack";
import DepthGallery from "@/components/about/DepthGallery";
import LocationSection from "@/components/about/LocationSection";
import ScrollProgressTracker from "@/components/about/ScrollProgressTracker";

export default function AboutPage() {
    const galleryRef = useRef<HTMLElement>(null);

    return (
        <main className="bg-base-bg min-h-screen w-full relative">
            <ScrollProgressTracker galleryRef={galleryRef} />
            
            <AboutHero />
            <AboutIdentity />
            <AboutPhilosophy />
            <ContentCarousel />
            <TechStack />
            <DepthGallery ref={galleryRef} />
            <LocationSection />
        </main>
    );
}