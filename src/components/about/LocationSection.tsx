"use client";

import { motion } from "framer-motion";

export default function LocationSection() {
    return (
        <section className="min-h-[60vh] w-full flex flex-col items-center justify-center relative px-[var(--page-px)] overflow-hidden bg-base-bg">
            <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                <img 
                    src="/assets/map.svg" 
                    alt="Map of Coimbatore" 
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Gradient Overlays */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-base-bg to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-base-bg to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-base-bg to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-base-bg to-transparent pointer-events-none" />

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                className="relative z-10 flex flex-col items-center text-center"
            >
                <div className="f-mono text-2xs tracking-widest opacity-35 uppercase mb-[2rem]">
                    location
                </div>

                <h2 className="f-display text-3xl font-light text-text-primary">
                    Based in <span className="f-accent italic text-text-primary">Coimbatore</span>
                </h2>

                <p className="f-mono text-sm opacity-55 max-w-[45ch] mt-6 leading-relaxed">
                    Building global digital experiences from South India.<br />
                    Coimbatore, Tamil Nadu — the textile city.
                </p>
            </motion.div>
        </section>
    );
}
