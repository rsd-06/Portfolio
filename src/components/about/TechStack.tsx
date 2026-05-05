"use client";

import { motion } from "framer-motion";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiMongodb, SiSupabase, SiGithub, SiFramer } from 'react-icons/si';
import LogoLoop from '@/components/LogoLoop';
import { useMediaQuery } from "@/hooks/useMediaQuery";

const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
    { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
    { node: <SiMongodb />, title: "MongoDB", href: "https://mongodb.com" },
    { node: <SiSupabase />, title: "Supabase", href: "https://supabase.com" },
    { node: <SiFramer />, title: "Framer Motion", href: "https://framer.com/motion" },
    { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
];

export default function TechStack() {
    const isMobile = useMediaQuery("(max-width: 767px)");

    return (
        <section className="w-full py-[clamp(4rem,8vw,6rem)] px-[var(--page-px)] bg-base-bg overflow-hidden flex flex-col justify-center min-h-[50dvh]">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-[clamp(2rem,5vw,4rem)]">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], staggerChildren: 0.1 }}
                >
                    <motion.div className="f-mono text-2xs tracking-widest opacity-35 uppercase mb-[1rem]">
                        tools & stack
                    </motion.div>
                    <motion.h2 className="f-display text-xl md:text-3xl font-light text-text-primary">
                        Tools & Tech Stack I Use
                    </motion.h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    className="relative w-full"
                >
                    <LogoLoop
                        logos={techLogos}
                        speed={80}
                        direction="left"
                        logoHeight={isMobile ? 36 : 52}
                        gap={60}
                        hoverSpeed={20}
                        scaleOnHover={true}
                        fadeOut={false}
                        aria-label="Technology stack logos"
                    />
                </motion.div>
            </div>
        </section>
    );
}
