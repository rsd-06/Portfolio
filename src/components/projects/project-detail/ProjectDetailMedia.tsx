"use client";

import { motion, MotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProjectDetailMedia({
  images,
  video,
  scrollProgress,
}: {
  images: string[];
  video?: string;
  scrollProgress: MotionValue<number>;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine breakpoints based on total media items
  const totalMedia = images.length + (video ? 1 : 0);
  
  // Create breakpoints evenly spaced across scroll progress
  const breakpoints = Array.from({ length: totalMedia }).map((_, i) => (i + 1) / totalMedia);
  const values = Array.from({ length: totalMedia }).map((_, i) => i);

  const rawActiveIndex = useTransform(scrollProgress, [0, ...breakpoints], [0, ...values], { clamp: true });
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return rawActiveIndex.on("change", (latest) => {
      setActiveIndex(Math.round(latest));
    });
  }, [rawActiveIndex]);

  const imageScale = useTransform(scrollProgress, [0, 1], [1, 1.08]);

  if (isMobile) {
    // Mobile layout: static first image, then swipeable row
    return (
      <div className="flex flex-col gap-4 mb-16">
        <div className="w-full h-[40dvh] relative overflow-hidden bg-[var(--color-border)]">
          {video ? (
            <video src={video} poster={images[0]} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={images[0]} alt="Project feature" className="w-full h-full object-cover" />
          )}
        </div>
        
        {images.length > 1 && (
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-[var(--page-px)]">
            {images.slice(video ? 0 : 1).map((img, i) => (
              <div key={i} className="min-w-[85vw] h-[30dvh] snap-start relative overflow-hidden bg-[var(--color-border)]">
                <img src={img} alt={`Project detail ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop layout: sticky stacked images
  return (
    <div className="sticky top-[var(--nav-h)] h-[calc(100dvh-var(--nav-h))] w-full overflow-hidden bg-[var(--color-bg)]">
      <AnimatePresence mode="popLayout">
        {activeIndex < images.length ? (
          <motion.img
            key={`img-${activeIndex}`}
            src={images[activeIndex]}
            alt={`Project view ${activeIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: imageScale.get() }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0 w-full h-full object-cover origin-center"
            style={{ scale: imageScale }}
          />
        ) : video ? (
          <motion.video
            key="video-player"
            src={video}
            poster={images[images.length - 1]}
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: imageScale.get() }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0 w-full h-full object-cover origin-center"
            style={{ scale: imageScale }}
          />
        ) : null}
      </AnimatePresence>

      <div className="absolute bottom-8 left-8 z-10 mix-blend-difference text-white">
        <span className="font-mono text-[10px] opacity-45" aria-live="polite" aria-atomic="true">
          [{activeIndex + 1} / {totalMedia}]
        </span>
      </div>

      {activeIndex === images.length && video && (
        <div className="absolute bottom-8 right-8 z-10 mix-blend-difference text-white flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="font-mono text-[10px] opacity-45">playing</span>
        </div>
      )}
    </div>
  );
}
