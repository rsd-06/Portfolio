"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const CAROUSEL_ITEMS = [
    {
        id: "01",
        title: "01 — How I Build",
        content: (
            <div className="flex flex-col gap-6 w-full">
                <p>I build for clarity. I build for performance. I build with intention.</p>
                <p className="text-text-primary">React. Next.js. TypeScript. Tailwind. Motion.<br />Node. APIs. Databases. Systems that make sense.</p>
                <p>Not just code that runs — but systems that hold.</p>
            </div>
        )
    },
    {
        id: "02",
        title: "02 — What I’m Exploring",
        content: (
            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-wrap gap-3">
                    {["Machine Learning", "System Design", "Agentic AI", "Optimization"].map(skill => (
                        <span
                            key={skill}
                            className="px-4 py-1.5 rounded-full border border-border-subtle text-text-primary f-mono text-[0.75rem] tracking-wide"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <p>Not because it’s trending — but because I want to understand how intelligence is structured.</p>
                <p>Patterns. Trade-offs. Optimization.<br />The mechanics behind decisions.</p>
                <p className="text-text-primary">And the numerous solutions it enables me to provide.</p>
            </div>
        )
    },
    {
        id: "03",
        title: "03 — Engineering Philosophy",
        content: (
            <div className="flex flex-col gap-6 w-full">
                <p>Clean architecture over clever hacks. Readable code over ego code. Understanding over memorizing.</p>
                <div>
                    <p className="mb-2">I care about:</p>
                    <p className="text-text-primary">Why it scales. Why it breaks. Why it feels smooth.</p>
                </div>
            </div>
        )
    },
    {
        id: "04",
        title: "04 — Foundations",
        content: (
            <div className="flex flex-col gap-6 w-full">
                <p>Alongside building products, I’m strengthening my foundations in:</p>
                <div className="flex flex-wrap gap-3 mt-2">
                    {["Data Structures", "Algorithms", "Operating Systems", "Networks", "System Design"].map(fw => (
                        <span
                            key={fw}
                            className="px-4 py-1.5 rounded-full border border-border-subtle text-text-primary f-mono text-[0.75rem] tracking-wide"
                        >
                            {fw}
                        </span>
                    ))}
                </div>
            </div>
        )
    }
];

const SWIPE_CONFIDENCE_THRESHOLD = 50;

export default function ContentCarousel() {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isPaused, setIsPaused] = useState(false);

    const activeIndex = Math.abs(page % CAROUSEL_ITEMS.length);

    const paginate = useCallback((newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    }, [page]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 5000);

        return () => clearInterval(timer);
    }, [paginate, isPaused]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        })
    };

    const handleDragEnd = (e: any, { offset, velocity }: any) => {
        const swipe = Math.abs(offset.x) * velocity.x;
        if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
            paginate(1);
        } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
            paginate(-1);
        }
    };

    return (
        <section className="w-full min-h-screen py-24 flex flex-col justify-center px-[var(--page-px)] bg-base-bg overflow-hidden relative">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.35 }}
                viewport={{ once: true }}
                className="absolute top-16 md:top-24 left-[var(--page-px)] f-mono text-2xs tracking-widest uppercase"
            >
                current focus
            </motion.div>

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center relative mb-16 lg:mb-32">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.4 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={handleDragEnd}
                        className="w-full flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 cursor-grab active:cursor-grabbing items-start justify-center"
                        role="region"
                        aria-label="About content carousel"
                        aria-live="polite"
                    >
                        {/* Title Section */}
                        <div className="lg:w-1/3 shrink-0">
                            <h3 className="f-mono text-xs tracking-widest opacity-50 uppercase">
                                {CAROUSEL_ITEMS[activeIndex].title}
                            </h3>
                        </div>

                        {/* Content Section */}
                        <div className="lg:w-2/3 w-full f-display text-[clamp(1.5rem,3vw,2.5rem)] leading-tight text-text-muted">
                            {CAROUSEL_ITEMS[activeIndex].content}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                    <div className="flex items-center gap-6 px-6 py-2.5 rounded-full border border-border-subtle bg-base-surface/80 backdrop-blur-md shadow-sm">
                        <button 
                            onClick={() => paginate(-1)}
                            className="text-text-secondary hover:text-text-primary transition-colors p-1"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={18} strokeWidth={2} />
                        </button>
                        
                        <button 
                            onClick={() => setIsPaused(!isPaused)}
                            className="text-text-secondary hover:text-text-primary transition-colors p-1 flex items-center justify-center w-[18px] h-[18px]"
                            aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                        >
                            {isPaused ? <Play size={14} strokeWidth={2} className="ml-0.5" /> : <Pause size={14} strokeWidth={2} />}
                        </button>

                        <button 
                            onClick={() => paginate(1)}
                            className="text-text-secondary hover:text-text-primary transition-colors p-1"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={18} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
