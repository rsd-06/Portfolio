"use client";

import { motion } from "framer-motion";

const STATEMENTS = [
    { text: "I like knowing how things work.", muted: false },
    { text: "Code. Systems. People. Worlds.", muted: true },
    { text: "I'm still exploring all of them.", muted: false },
];

export default function AboutPhilosophy() {
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
                    <motion.div
                        key={i}
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: stmt.muted ? 0.45 : 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.18, ease: [0.19, 1, 0.22, 1] }}
                        className="f-display text-[clamp(2rem,6vw,8rem)] font-light tracking-[-0.04em] leading-none text-text-primary"
                    >
                        {stmt.text}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
