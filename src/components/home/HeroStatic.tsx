// src/components/home/HeroStatic.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroStatic() {
  const { scrollY } = useScroll();
  const leftLabelY = useTransform(scrollY, [0, 200], [0, -20]);
  const rightLabelY = useTransform(scrollY, [0, 200], [0, -20]);
  const hintOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <section className="section-full flex flex-col items-center justify-center px-page pt-20">
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Massive Title Bar at the top */}
        <div className="hero-title-bar mt-12 md:mt-24 mb-10 overflow-hidden w-full text-center">
          <motion.h1 
            className="f-display text-[20vw] md:text-[14vw] tracking-[-0.04em] font-black leading-none"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            rsd.exe
          </motion.h1>
        </div>

      {/* Main Content Area (Photo + Text) */}
      <div className="relative flex justify-center items-center">
        
        {/* Left Side Metadata Block */}
        <motion.div 
          className="hidden md:flex flex-col gap-4 absolute right-[100%] mr-8 lg:mr-16 top-1/2 -translate-y-1/2 mt-8 w-56 lg:w-64 f-mono text-2xs tracking-wide text-[var(--color-text-primary)] pointer-events-none text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{ y: leftLabelY }}
        >
          <div className="flex flex-col gap-1 opacity-65">
            <p>2nd Year &middot; EIE</p>
            <p>KCT, Coimbatore</p>
          </div>
          
          <div className="w-full h-[1px] bg-[var(--color-text-primary)] opacity-10" />
          
          <div className="flex flex-col gap-1 opacity-90">
            <p>SkillSync &rarr; KCT Incubator</p>
            <p>Meta PyTorch Hack &rarr; Finalist</p>
            <p className="opacity-60 pt-1">31,000+ registrations</p>
          </div>
          
          <div className="w-full h-[1px] bg-[var(--color-text-primary)] opacity-10" />
          
          <div className="flex flex-col gap-1 opacity-65">
            <p>MERN Stack &middot; Next.js</p>
            <p>Docker &middot; ML / AI</p>
          </div>
        </motion.div>

        {/* Portrait Photo */}
        <motion.div 
          className="hero-photo-wrap w-[75vw] md:w-[38vw] aspect-[3/4] md:aspect-auto md:h-[60vh] rounded-[8px] md:rounded-[12px] overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.9, ease: [0.19, 1, 0.22, 1] }} // Starts after loader exit (1s)
        >
          <img src="/assets/hero.jpg" alt="Sudharshan R" className="hero-photo w-full h-full object-cover" />
        </motion.div>

        {/* Right Side Cinematic Para */}
        <motion.div 
          className="hidden md:flex flex-col gap-6 absolute left-[100%] ml-8 lg:ml-16 top-1/2 -translate-y-1/2 mt-8 w-72 lg:w-80 text-left f-display italic text-2xl !font-medium text-[var(--color-text-primary)] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          style={{ y: rightLabelY }}
        >
          <div className="leading-tight">
            <p>Builds things that shouldn't</p>
            <p>exist yet. Breaks them.</p>
            <p>Rebuilds them better.</p>
          </div>
          
          <div className="leading-tight">
            <p>Engineering student by morning.</p>
            <p>Developer by night.</p>
            <p>Entrepreneur by necessity.</p>
          </div>
        </motion.div>

      </div>
      </div>

    </section>
  );
}
