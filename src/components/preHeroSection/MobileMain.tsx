"use client";

import BackgroundVideo from "next-video/background-video";
import mobileHero from "../../../videos/mobile-hero.mp4.json";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";

export default function MobileMain({ heroState }: { heroState: 'pre' | 'hero' | 'section3' }) {
    const isHero = heroState === 'hero';
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            if (isHero) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        if (e.name !== "AbortError") {
                            console.error("Playback error", e);
                        }
                    });
                }
            } else {
                video.pause();
                video.currentTime = 0; // Ensures it stops explicitly at the poster frame
            }
        }
    }, [isHero]);

    return (
        <motion.div
            layout
            transition={{ layout: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }}
            className={`w-full h-full flex items-end justify-center ${isHero ? 'p-0' : 'px-8 pt-8 pb-0 md:px-16 md:pt-16 md:pb-0'}`}
        >
            <motion.div
                layout
                transition={{ layout: { duration: 3.0, ease: [0.22, 1, 0.36, 1] } }}
                className={`${isHero ? 'absolute bottom-0 left-0 w-full h-dvh z-50' : 'flex h-full w-full relative z-50 mx-auto items-end justify-center'}`}
            >
                {/* @ts-ignore */}
                <BackgroundVideo ref={videoRef} src={mobileHero} poster={mobileHero.poster} autoPlay={isHero} startTime={0} muted={true} loop={true} className="video-container block h-full w-full max-w-full object-cover mx-auto" />
                <AnimatePresence>
                    {isHero && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="absolute p-20 lg:p-24 xl:p-28 2xl:p-32 mt-(--header-height) inset-0 z-50 @container mx-auto w-full bg-transparent flex flex-col select-none justify-center items-center pointer-events-none"
                        >
                            <h2 className="text-black text-shadow-2xs text-shadow-accent-glow flex-1 min-w-fit md:min-w-3xs lg:min-w-2xs xl:min-w-xs 2xl:min-w-sm self-start font-extrabold font-inter text-left text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl">
                                What if<br />I fall ?<br /><br />Oh,<br />but my darling,<br />what if<br />you fly ?
                            </h2>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {!isHero && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="block absolute bottom-8 right-8 z-60 overflow-hidden"
                        >
                            <p className="text-white font-bold font-roboto text-right text-lg md:text-xl max-w-[200px] md:max-w-[250px] p-4 drop-shadow-md">
                                Driven by Obsession, Centered on Improving, Embracing Growth
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};