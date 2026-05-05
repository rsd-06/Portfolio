"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
    return (
        <section className="pt-48 pb-12 w-full flex flex-col px-[var(--page-px)] relative bg-base-bg">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="absolute top-32 left-[var(--page-px)]"
            >
                <h1 className="f-display text-7xl">About</h1>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-end max-w-7xl mx-auto w-full gap-8">
                <div className="md:mb-4">
                    <motion.p
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                        className="f-accent text-xl md:text-2xl opacity-60"
                        style={{ opacity: 0.55 }}
                    >
                        Hello, nice to meet you.
                    </motion.p>
                </div>
            </div>

            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="w-full max-w-7xl mx-auto h-[1px] bg-border-subtle mt-8 md:mt-12 origin-left"
            />


        </section>
    );
}
