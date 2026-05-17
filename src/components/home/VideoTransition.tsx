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

  const mediaWidth = useTransform(scrollYProgress, [0, 0.8], [isMobile ? "85vw" : "38vw", "100vw"]);
  const mediaHeight = useTransform(scrollYProgress, [0, 0.8], [isMobile ? "60vh" : "70vh", "100dvh"]);
  const mediaBorderRadius = useTransform(scrollYProgress, [0, 0.8], ["12px", "0px"]);

  return (
    <section ref={containerRef} style={{ height: isMobile ? "200vh" : "250vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        
        {/* Video that zooms out smoothly */}
        <motion.div 
          style={{ 
            width: mediaWidth, 
            height: mediaHeight, 
            borderRadius: mediaBorderRadius,
            position: "absolute",
            willChange: "width, height, border-radius",
          }}
          className="overflow-hidden"
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
