"use client";

import BackgroundVideo from "next-video/background-video";
import mobileHero from "../../../videos/mobile-hero.mp4.json";
import { motion } from "motion/react";

export default function MobileHeroSection() {
    return (
        <section className="h-screen w-screen min-h-screen md:hidden overflow-hidden relative">
            <motion.div layoutId="hero-video" className="h-full w-full absolute inset-0 z-0">
                {/* @ts-ignore */}
                <BackgroundVideo src={mobileHero} autoPlay={true} muted={true} loop={true} className="video-container h-full w-full object-cover" />
            </motion.div>
            <div className="absolute p-20 lg:p-24 xl:p-28 2xl:p-32 mt-(--header-height) inset-0 z-50 @container mx-auto w-full bg-transparent flex flex-col select-none justify-center items-center pointer-events-none">
                <h2 className="text-black text-shadow-2xs text-shadow-accent-glow flex-1 min-w-fit md:min-w-3xs lg:min-w-2xs xl:min-w-xs 2xl:min-w-sm self-start font-extrabold font-inter text-left text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl">
                    What if<br />I fall ?<br /><br />Oh,<br />but my darling,<br />what if<br />you fly ?
                </h2>
            </div>
        </section>
    );
};