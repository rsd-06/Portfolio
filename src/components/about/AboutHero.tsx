"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const SOCIALS = [
    { label: "LinkedIn",  icon: "/assets/socialMediaIcons/linkedin_icon.png",  href: "https://www.linkedin.com/in/sudharshan-r-b0a8b0254/" },
    { label: "GitHub",    icon: "/assets/socialMediaIcons/github_icon.png",    href: "https://github.com/rsd-06" },
    { label: "Instagram", icon: "/assets/socialMediaIcons/instagram_icon.png", href: "https://www.instagram.com/rsd_exe/" },
    { label: "Twitter",   icon: "/assets/socialMediaIcons/twitter_icon.png",   href: "https://x.com/rsd_2006" },
];

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

            <div className="flex flex-col md:flex-row md:items-end md:justify-end max-w-7xl mx-auto w-full gap-8 mt-16 md:mt-0">
                <div className="md:mb-4 flex flex-col items-start md:items-end">
                    <motion.p
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                        className="f-accent text-xl md:text-2xl opacity-60"
                        style={{ opacity: 0.55 }}
                    >
                        Hello, nice to meet you.
                    </motion.p>
                    <motion.div
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        className="mt-4 flex flex-wrap items-center justify-start md:justify-end gap-3 md:pr-1"
                    >
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
                                        width={20}
                                        height={20}
                                        className="object-contain invert-on-light"
                                        style={{ filter: "var(--icon-filter, none)" }}
                                    />
                                </a>
                                {idx < SOCIALS.length - 1 && <span className="opacity-20 text-xs">|</span>}
                            </div>
                        ))}
                    </motion.div>
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
