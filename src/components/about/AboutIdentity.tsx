"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const ELABORATIONS = [
    "Progressive in design.",
    "Photographer of small moments.",
    "Movie Buff. Music Lover. Life Enthusiast.",
    "Love Debating, Queen Blundering & Strava Logging",
    "Believer in curiosity."
];

export default function AboutIdentity() {
    const [index, setIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(true); // SSR-safe default
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    // Parallax only on desktop — skip on mobile to avoid live scroll listener overhead
    const rawTextY = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const textY = isMobile ? 0 : rawTextY;

    useEffect(() => {
        setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % ELABORATIONS.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={containerRef} className="relative w-full flex flex-col justify-center px-[var(--page-px)] pt-12 pb-20 bg-base-bg">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-20 items-center">
                
                {/* LEFT: Photo Composition */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.9, delay: 1.0, ease: [0.19, 1, 0.22, 1] }}
                    className="relative w-[80vw] md:w-full max-w-[480px] aspect-[4/5] mx-auto md:mx-0 rounded-xl overflow-hidden shadow-2xl"
                >
                    <Image
                        src="/hero.jpg"
                        alt="Background glow"
                        fill
                        className="object-cover opacity-25 blur-[2px]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-[85%] h-[85%] rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                src="/hero.jpg"
                                alt="Sudharshan"
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: Elaborations and Paragraph */}
                <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.9, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    style={{ y: textY }}
                    className="flex flex-col h-full justify-center md:justify-end pb-[clamp(2rem,5vw,4rem)]"
                >
                    <div className="md:self-start flex flex-col items-start w-full">
                        <div className="max-w-[48ch] h-[180px] md:h-[240px] flex flex-col justify-center pb-8 md:pb-16">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={index}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                    className="f-display text-4xl md:text-6xl font-medium tracking-[-0.03em] text-text-primary"
                                >
                                    {ELABORATIONS[index]}
                                </motion.h2>
                            </AnimatePresence>
                        </div>

                        <motion.p 
                            initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
                            whileInView={{ opacity: 0.8, filter: "blur(0px)", y: 0 }}
                            viewport={{ once: true, margin: "-20px" }}
                            transition={{ duration: 0.6, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                            className="max-w-[50ch] font-inter font-light text-xl md:text-2xl text-text-primary leading-relaxed"
                        >
                            If I'm not working, I'm probably out taking photos, catching up on movies, exploring new music or having fun with people. 
                            I believe curiosity doesn't stop at code; it extends to everything around us.
                        </motion.p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
