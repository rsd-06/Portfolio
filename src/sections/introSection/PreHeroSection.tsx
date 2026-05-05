import { Fugaz_One } from "next/font/google";

import { useMediaQuery } from "../../hooks/useMediaQuery";

import Silk from "@/components/Silk";
import Header from "@/components/header/Header";
import DesktopMain from "@/components/preHeroSection/DesktopMain";
import MobileMain from "@/components/preHeroSection/MobileMain";
import { motion, AnimatePresence } from "motion/react";

const fugazOne = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function PreHeroSection({ heroState }: { heroState: 'pre' | 'hero' | 'section3' }) {

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const isHero = heroState === 'hero';

    return (
        <section className="h-screen w-full flex flex-col overflow-hidden bg-base-bg relative">
            <motion.div
                initial={false}
                animate={isHero ? { opacity: 0, height: 0, overflow: 'hidden' } : { opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full flex-none flex flex-col relative z-20"
            >
                <div className="relative flex-1 max-h-[25vh] min-h-[25vh]">
                    <Silk
                        speed={1.5}
                        scale={0.75}
                        color="#7B7481"
                        noiseIntensity={1.5}
                        rotation={0}
                    />
                    <div className="absolute inset-0 z-50 @container mx-auto w-full bg-transparent flex items-center justify-center select-none">
                        <h1 className={`${fugazOne.className} text-base-surface text-center font-black text-[20cqw] @3xs:text-[16cqw] @2xs:text-[16cqw] @xs:text-[18cqw] @sm:text-[18cqw] @md:text-[18cqw] @lg:text-[18cqw] @xl:text-[16cqw] @2xl:text-[14cqw] @3xl:text-[12cqw] @4xl:text-[10cqw]`}>rsd.exe</h1>
                    </div>
                </div>
            </motion.div>

            <motion.div
                layout
                transition={{ layout: { duration: isDesktop ? 2.5 : 3.0, ease: [0.22, 1, 0.36, 1] } }}
                className="transition-all z-30 min-h-[65vh] h-full w-full flex-1 relative bg-base-bg"
            >
                {
                    isDesktop ? <DesktopMain heroState={heroState} /> : <MobileMain heroState={heroState} />
                }
            </motion.div>
        </section>
    );
};