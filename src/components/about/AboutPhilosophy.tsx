"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const STATEMENTS = [
    { text: "I like knowing how things work.", muted: false },
    { text: "Code. Systems. People. Worlds.", muted: true },
    { text: "I'm still exploring all of them.", muted: false },
];

export default function AboutPhilosophy() {
    const [hoveredLine, setHoveredLine] = useState<number | null>(null);

    return (
        <section className="min-h-[60vh] py-32 w-full flex flex-col justify-center px-[var(--page-px)] relative bg-base-bg">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.35 }}
                viewport={{ once: true }}
                className="absolute top-[var(--nav-h,120px)] left-[var(--page-px)] f-mono text-2xs tracking-widest uppercase"
            >
                philosophy
            </motion.div>

            <div className="flex flex-col gap-[clamp(1rem,3vw,2.5rem)] text-center max-w-7xl mx-auto w-full mt-[12vh]">
                {STATEMENTS.map((stmt, i) => (
                    <div
                        key={i}
                        className="f-display text-[clamp(2rem,6vw,8rem)] font-light tracking-tight leading-[1.1] text-text-primary flex flex-wrap justify-center"
                    >
                        <motion.div
                            className="flex flex-wrap justify-center cursor-default"
                            onMouseEnter={() => setHoveredLine(i)}
                            onMouseLeave={() => setHoveredLine(null)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: stmt.muted ? 0.35 : 1 },
                                visible: { 
                                    opacity: hoveredLine === null ? (stmt.muted ? 0.35 : 1) : (hoveredLine === i ? 1 : 0.35),
                                    transition: { 
                                        opacity: { duration: 0.5, ease: "easeInOut" },
                                        staggerChildren: 0.04, 
                                        delayChildren: i * 0.2 
                                    }
                                }
                            }}
                        >
                            {stmt.text.split(" ").map((word, wIndex) => (
                                <motion.span 
                                    key={wIndex} 
                                    className="inline-block mr-[0.25em] last:mr-0 whitespace-nowrap"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { 
                                            opacity: 1, 
                                            y: 0, 
                                            transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] } 
                                        }
                                    }}
                                >
                                    {word.split("").map((char, cIndex) => (
                                        <motion.span 
                                            key={cIndex} 
                                            whileHover={{ 
                                                scale: 1.3, 
                                                y: -4,
                                                zIndex: 10,
                                                color: "var(--color-text-primary)",
                                                transition: { type: "spring", stiffness: 300, damping: 20 }
                                            }}
                                            className="inline-block relative origin-bottom"
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </motion.span>
                            ))}
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}
