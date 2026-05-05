// src/components/home/VideoFullscreen.tsx
"use client";

import BackgroundVideo from "next-video/background-video";
import heroVideo from "../../../videos/get-started.mp4.json";

export default function VideoFullscreen() {
  return (
    <section className="relative w-full h-[100dvh] overflow-hidden">
      <BackgroundVideo 
        src={heroVideo as any} 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
        aria-label="Background ambient video"
      />
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ boxShadow: "inset 0 0 120px rgba(245,244,240,0.15)" }}
      />
      <div className="absolute bottom-6 right-6 z-20 f-mono text-[var(--text-2xs)] opacity-30">
        rsd.exe / 2025
      </div>
    </section>
  );
}
