"use client";

import BackgroundVideo from "next-video/background-video";
import desktopHero from "../../../videos/desktop-hero.mp4.json"
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";

export default function DesktopMain({ heroState }: { heroState: 'pre' | 'hero' | 'section3' }) {
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
            className={`w-full h-full flex @container mx-auto ${isHero ? 'items-center justify-center p-0 m-0' : 'items-end justify-center lg:justify-between gap-8 lg:gap-15 xl:gap-22 p-8 pb-0 md:px-12 md:pt-12 md:pb-0 lg:px-6 lg:pt-6 lg:pb-0 video-container min-w-fit'}`}
        >
            <AnimatePresence>
                {!isHero && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="hidden xl:block overflow-hidden shrink self-end pb-6 lg:pb-10 xl:pb-12 2xl:pb-16 min-w-0"
                    >
                        <span className="text-text-muted text-center font-inter font-semibold text-lg lg:text-xl xl:text-xl 2xl:text-2xl px-4 min-w-[80px] whitespace-normal shrink wrap-break-word inline-block">
                            [ Scroll Down ]
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layout
                transition={{ layout: { duration: 2.5, ease: [0.22, 1, 0.36, 1] } }}
                className={`${isHero ? 'absolute bottom-0 left-0 w-full h-screen z-50' : 'flex shrink w-full lg:w-auto h-full relative z-50 mx-auto justify-center items-end overflow-hidden'}`}
            >
                {/* @ts-ignore */}
                <BackgroundVideo ref={videoRef} src={desktopHero} poster={desktopHero.poster} autoPlay={isHero} startTime={0} muted={true} loop={true} className="video-container block h-full w-full max-w-full object-cover mx-auto" />
                <AnimatePresence>
                    {!isHero && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="block lg:hidden absolute bottom-4 right-4 md:bottom-8 md:right-8 z-60 overflow-hidden"
                        >
                            <p className="text-white font-bold font-roboto text-right text-lg md:text-xl max-w-[200px] md:max-w-[250px] p-4 drop-shadow-md mix-blend-difference">
                                Driven by Obsession, Centered on Improving, Embracing Growth
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {isHero && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="absolute p-20 lg:p-24 xl:p-28 2xl:p-32 mt-[--header-height] inset-0 z-40 bg-transparent flex flex-col select-none justify-center items-center h-full"
                        >
                            <h2 className="text-black text-shadow-2xs text-shadow-accent-glow flex-1 min-w-fit md:min-w-3xs lg:min-w-2xs xl:min-w-xs 2xl:min-w-sm self-start font-extrabold font-inter text-left text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl">
                                What if<br />I fall ?<br /><br />Oh,<br />but my darling,<br />what if<br />you fly ?
                            </h2>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {!isHero && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="hidden lg:block overflow-hidden shrink self-end min-w-0 pb-10 lg:pb-16 xl:pb-20 2xl:pb-24"
                    >
                        <p className="text-[#171A1E] font-bold font-roboto text-left text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl w-full max-w-[250px] lg:max-w-[380px] xl:max-w-[480px] 2xl:max-w-[550px] wrap-break-word whitespace-normal p-4 lg:pr-10 xl:pr-16">
                            Driven by Obsession, Centered on Improving, Embracing Growth
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}