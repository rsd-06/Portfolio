"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const roles = [
    "Student",
    "SDE Aspirer",
    "Athlete",
    "Entrepreneur"
];

export default function RoleSwitcher() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % roles.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <span className="inline-block min-w-fit text-right text-text-primary font-extrabold font-tangerine text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl">
        <AnimatePresence mode="wait">
            <motion.span
                key={roles[index]}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-block"
            >
                {roles[index]}
            </motion.span>
        </AnimatePresence>
        </span>
    );
};