"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";

export default function LocationSection() {
    return (
        <div className="w-full pt-32 pb-32">
            <section className="min-h-[60vh] w-full flex flex-col items-center justify-center relative px-[var(--page-px)] overflow-hidden bg-base-bg rounded-xl" style={{ transform: "translateZ(0)" }}>
                <div 
                    className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" 
                    style={{ 
                        contentVisibility: "auto",
                        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)"
                    }}
                >
                    <Image 
                        src="/assets/aboutPageImages/coimbatoreNorthMap.svg"
                        alt="Map of Coimbatore" 
                        fill
                        priority
                        className="object-cover"
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

                <p className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-text-primary">
                    <MapPin size={13} strokeWidth={1.5} aria-hidden="true" className="opacity-60" />
                    <span className="f-accent italic text-base opacity-70">studying at</span>
                    <a
                        href="https://kct.ac.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Kumaraguru College of Technology (opens in new tab)"
                        className="group inline-flex items-center gap-1 f-mono text-xs uppercase tracking-[0.14em] font-medium underline decoration-[color-mix(in_srgb,var(--color-text)_25%,transparent)] underline-offset-4 hover:decoration-current transition-colors"
                    >
                        Kumaraguru College of Technology
                        <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                </p>
            </motion.div>
            </section>
        </div>
    );
}
