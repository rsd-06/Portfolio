"use client";

import { Fugaz_One } from "next/font/google";
import { useState, useEffect } from "react";
import { useLenis } from "lenis/react";

import Silk from "../../../components/Silk";
import CountUp from "../../../components/CountUp";

const fugazOne = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function IntroOverlay() {
    const [isLoaded, setIsLoaded] = useState(false);
    const lenis = useLenis();

    useEffect(() => {
        if (!isLoaded) {
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            // Ensure we are physically at top unconditionally
            window.scrollTo(0, 0);
            if (lenis) {
                lenis.stop();
            }
        } else {
            // Nullify any stray native scroll right before starting Lenis
            window.scrollTo(0, 0);
            if (lenis) {
                lenis.scrollTo(0, { immediate: true });
                lenis.start();

                // Programmatically smooth scroll to the next section (100vh down)
                lenis.scrollTo(window.innerHeight, {
                    duration: 5.0, // Extremely slow and smooth cinematic descent
                    lock: true,    // Prevent user from interrupting the entry scroll
                });
            }
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }

        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [isLoaded, lenis]);

    return (
        <section
            className="relative w-screen h-screen min-h-screen bg-base-bg select-none"
        >
            <Silk
                speed={1.5}
                scale={0.75}
                color="#7B7481"
                noiseIntensity={1.5}
                rotation={0}
            />
            <div className="absolute inset-0 top-0 z-50 bg-transparent h-full p-3.5 flex flex-col min-h-screen">

                {/* Top Bar */}
                <div className="w-full grow flex items-start justify-between font-semibold gap-x-px font-inter text-base-soft bg-transparent select-none">
                    <div className="flex flex-col gap-[0.25cqw] text-left min-w-fit p-1">
                        <span className="p-0.5 sm:text-[2cqw] md:text-[2.5cqw] lg:text-[1.25cqw]">Portfolio</span>
                        <span className="p-0.5 sm:text-[2cqw] md:text-[2.5cqw] lg:text-[1.25cqw]">Buidling through SDE</span>
                    </div>
                    <div className="gap-[0.25cqw] text-center hidden md:flex flex-col p-1">
                        <span className="p-0.5 sm:text-[2cqw] md:text-[2.5cqw] lg:text-[1.25cqw]">Coimbatore</span>
                        <span className="p-0.5 sm:text-[2cqw] md:text-[2.5cqw] lg:text-[1.25cqw]">India</span>
                    </div>
                    <div className="flex flex-col gap-[0.25cqw] text-left min-w-fit p-1">
                        <span className="p-0.5 sm:text-[2cqw] md:text-[2.5cqw] lg:text-[1.25cqw]">Loading</span>
                        <CountUp
                            to={100}
                            duration={1}
                            delay={0}
                            separator=","
                            className="p-0.5 sm:text-[2cqw] md:text-[2.5cqw] lg:text-[1.25cqw] font-bold bg-linear-to-r from-[#e4ddeb] to-[#8f03fa] bg-clip-text text-transparent"
                            onStart={() => {

                            }}
                            onEnd={() => {
                                setTimeout(() => {
                                    setIsLoaded(true);
                                }, 2500);
                            }}
                        />
                    </div>
                </div>

                {/* Middle Bar */}
                <div className="grow @container mx-auto w-full bg-transparent flex items-center px-0.5">
                    <h1 className={`${fugazOne.className} w-full text-base-surface text-center font-black text-[20cqw] @3xs:text-[20cqw] @2xs:text-[20cqw] @xs:text-[20cqw] @sm:text-[20cqw] @md:text-[18cqw] @lg:text-[18cqw] @xl:text-[16cqw] @2xl:text-[14cqw] @3xl:text-[12cqw] @4xl:text-[10cqw]`}>rsd.exe</h1>
                </div>

                {/* Bottom Bar */}
                <div className="grow @container mx-auto w-full text-xl bg-transparent px-1">
                    <p className="w-full text-text-muted text-center font-inter font-black @3xs:text-[3.5cqw] @2xs:text-[4cqw] @xs:text-[3.5cqw] @sm:text-[3.5cqw] @md:text-[3cqw] @lg:text-[3cqw] @xl:text-[3cqw] @2xl:text-[2.5cqw] @3xl:text-[2cqw] @4xl:text-[2cqw] italic">
                        Hallo, amigos<br />I’m Sudharshan, a web developer and engineer.<br />Welcome to my portfolio!
                    </p>
                </div>
            </div>
        </section>
    );
};