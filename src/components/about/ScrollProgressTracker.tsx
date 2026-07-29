"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, RefObject } from "react";

export default function ScrollProgressTracker() {
    const { scrollYProgress } = useScroll();
    const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    
    return (
        <motion.div
            className="fixed z-[9999] hidden sm:block pointer-events-none"
            style={{
                right: "clamp(1rem, 3vw, 2rem)",
                top: "var(--nav-h, 120px)",
                bottom: "2rem",
                width: "1px",
                backgroundColor: "var(--border-subtle)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            aria-hidden="true"
        >
            <motion.div
                className="absolute top-0 w-full bg-text-primary"
                style={{ height: fillHeight }}
            />
            <motion.div
                className="absolute w-[3px] h-[3px] rounded-full bg-text-primary -left-[1px]"
                style={{ top: fillHeight }}
            />
        </motion.div>
    );
}
