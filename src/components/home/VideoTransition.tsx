// src/components/home/VideoTransition.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

import BackgroundVideo from "next-video/background-video";
import heroVideo from "../../../videos/get-started.mp4.json";

export default function VideoTransition() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const photoWidth = useTransform(scrollYProgress, [0, 0.8], [isMobile ? "85vw" : "38vw", "100vw"]);
  const photoHeight = useTransform(scrollYProgress, [0, 0.8], [isMobile ? "60vh" : "70vh", "100dvh"]);
  const photoBorderRadius = useTransform(scrollYProgress, [0, 0.8], ["12px", "0px"]);
  const photoOpacity = useTransform(scrollYProgress, [0.5, 0.8], [1, 0]);
  const videoOpacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);

  return (
    <section ref={containerRef} style={{ height: isMobile ? "200vh" : "250vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        
        {/* Photo */}
        <motion.div 
          style={{ 
            width: photoWidth, 
            height: photoHeight, 
            borderRadius: photoBorderRadius, 
            opacity: photoOpacity,
            position: "absolute",
            willChange: "transform, opacity"
          }}
          className="overflow-hidden"
        >
          <img src="/assets/hero.jpg" alt="Hero Transition" className="w-full h-full object-cover" />
        </motion.div>

        {/* Video */}
        <motion.div 
          style={{ 
            opacity: videoOpacity, 
            position: "absolute", 
            inset: 0,
            willChange: "opacity"
          }}
        >
          <BackgroundVideo 
            src={heroVideo as any} 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="video-container w-full h-full object-cover"
            aria-label="Background ambient video"
          />
        </motion.div>

      </div>
    </section>
  );
}
