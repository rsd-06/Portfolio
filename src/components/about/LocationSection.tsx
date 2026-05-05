"use client";

import { motion } from "framer-motion";

export default function LocationSection() {
    return (
        <div className="w-full pt-32 pb-32">
            <section className="min-h-[60vh] w-full flex flex-col items-center justify-center relative px-[var(--page-px)] overflow-hidden bg-base-bg rounded-xl" style={{ transform: "translateZ(0)" }}>
                <div 
                    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" 
                    style={{ 
                        contentVisibility: "auto",
                        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)"
                    }}
                >
                    <img 
                        src="/assets/aboutPageImages/coimbatoreNorthMap.svg"
                        alt="Map of Coimbatore" 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        style={{ transform: "translateZ(0)", willChange: "transform" }}
                    />
                </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                className="relative z-10 flex flex-col items-center text-center"
            >
                <h2 className="f-display text-3xl font-light text-text-primary">
                    Based in <span className="f-accent italic text-text-primary">Coimbatore</span>
                </h2>

                <p className="font-inter font-light text-lg md:text-xl text-text-primary opacity-85 max-w-[45ch] mt-6 leading-relaxed mx-auto">
                    Building global digital experiences from South India.<br />
                    Coimbatore, Tamil Nadu — the textile city.
                </p>
            </motion.div>
            </section>
        </div>
    );
}
