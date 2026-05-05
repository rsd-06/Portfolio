'use client';

import Header from "../../components/header/Header";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect } from "react";

export default function Contact() {

    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                const height = headerRef.current.getBoundingClientRect().height;
                document.documentElement.style.setProperty('--header-height', `${height}px`);
            }
        };

        updateHeaderHeight(); // on mount
        window.addEventListener('resize', updateHeaderHeight); // on resize
        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

    return (
        <section>
            <div className="w-full h-screen bg-base-bg">
                <div ref={headerRef} className="fixed top-0 left-0 w-full z-50 bg-transparent">
                    <Header />
                </div>
                <div className="w-full h-full bg-transparent flex flex-col pt-(--header-height) px-2.5">

                    <div className="flex-1 flex flex-col gap-y-2 w-full justify-start items-start pt-15 pb-15 px-10 text-text-secondary text-left font-inter max-w-[90vw] md:max-w-[85vw] xl:max-w-[70vw]">
                        <p className="text-3xl xs:text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-5xl 2xl:text-5xl 3xl:text-6xl 4xl:text-6xl py-2.5 font-black">
                            Let's build something amazing together. 
                        </p>
                        <p className="text-lg xs:text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-4xl py-2.5 font-normal text-left tracking-tighter max-w-[70vw] md:max-w-[70vw] xl:max-w-[40vw]">
                            Open to meaningful conversations, project collaborations, and remote full-time opportunities .
                        </p>
                    </div>

                    <div className="w-full h-full flex items-end justify-start flex-2 min-w-fit">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl 3xl:text-9xl 4xl:text-9xl tracking-tighter leading-none pt-5 pb-15 px-10 font-extrabold text-text-primary text-left max-w-2xl font-inter">
                            Let's<br/>Connect .
                        </h1>
                    </div>

                    <div className="justify-center md:justify-between w-full pb-8 px-12 text-sm xs:text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg 2xl:text-lg 3xl:text-xl 4xl:text-2xl overflow-x-scroll">
                        <div className="flex justify-center items-center gap-x-5 text-text-secondary font-semibold hidden md:block">
                            <span>
                                <Link href="https://github.com/rsudharshan2006">
                                    GitHub
                                </Link>
                            </span>
                            <span>
                                <Link href="https://www.instagram.com/sudharshan_2006/">
                                    Instagram
                                </Link>
                            </span>
                            <span>
                                <Link href="https://www.linkedin.com/in/sudharshan-r-08b24926a/">
                                    LinkedIn
                                </Link>
                            </span>
                            <span>
                                <Link href="https://www.threads.net/@sudharshan_2006">
                                    Threads
                                </Link>
                            </span>
                        </div>
                        <div className="flex justify-start items-center">
                            <span
                                className="text-text-secondary font-semibold"
                            >
                                rsudharshan2006@gmail.com
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};