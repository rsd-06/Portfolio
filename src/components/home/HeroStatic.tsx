// src/components/home/HeroStatic.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const SOCIALS = [
  { label: "LinkedIn",  icon: "/assets/socialMediaIcons/linkedin_icon.png",  href: "https://www.linkedin.com/in/sudharshan-r-b0a8b0254/" },
  { label: "GitHub",    icon: "/assets/socialMediaIcons/github_icon.png",    href: "https://github.com/rsd-06" },
  { label: "Instagram", icon: "/assets/socialMediaIcons/instagram_icon.png", href: "https://www.instagram.com/rsd_exe/" },
  { label: "Twitter",   icon: "/assets/socialMediaIcons/twitter_icon.png",   href: "https://x.com/rsd_2006" },
];

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
          className="hidden md:flex flex-col gap-4 absolute right-[100%] mr-8 lg:mr-16 top-1/2 -translate-y-1/2 mt-8 w-56 lg:w-64 f-mono text-2xs tracking-wide text-[var(--color-text-primary)] text-right"
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
            <p>Electronics student.</p>
            <p>Full-stack builder.</p>
            <p>ML enthusiast.</p>
          </div>
          
          <div className="w-full h-[1px] bg-[var(--color-text-primary)] opacity-10" />
          
          <div className="flex flex-col gap-1 opacity-65">
            <p>MERN Stack &middot; ML/AI</p>
          </div>

          <div className="w-full h-[1px] bg-[var(--color-text-primary)] opacity-10" />

          <div className="flex items-center justify-end gap-3 pt-1 pointer-events-auto">
            <ArrowUpRight className="w-[18px] h-[18px] flex-shrink-0 mr-5" />
            {SOCIALS.map((social, idx) => (
                <div key={social.label} className="flex items-center gap-3">
                    <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        className="opacity-60 hover:opacity-100 transition-opacity duration-200 hover:scale-110 transform"
                    >
                        <Image
                            src={social.icon}
                            alt={social.label}
                            width={18}
                            height={18}
                            className="object-contain"
                            style={{ filter: "var(--icon-filter, none)" }}
                        />
                    </a>
                    {idx < SOCIALS.length - 1 && <span className="opacity-20 text-xs">|</span>}
                </div>
            ))}
          </div>
        </motion.div>

        {/* Portrait Photo */}
        <motion.div 
          className="hero-photo-wrap w-[75vw] md:w-[38vw] aspect-[3/4] md:aspect-auto md:h-[60vh] rounded-[8px] md:rounded-[12px] overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.9, ease: [0.19, 1, 0.22, 1] }} // Starts after loader exit (1s)
        >
          <Image 
            src="/hero.jpg" 
            alt="Sudharshan R" 
            fill 
            priority
            sizes="(max-width: 768px) 75vw, 38vw"
            className="hero-photo object-cover" 
          />
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
            <p>Figuring, building and learning things out,</p>
            <p>one commit at a time.</p>
          </div>
          
          <div className="leading-tight">
            <p>Engineering student by morning.</p>
            <p>Developer by night.</p>
            {/* <p>Entrepreneur by necessity.</p> */}
          </div>
        </motion.div>

      </div>
      </div>

    </section>
  );
}
