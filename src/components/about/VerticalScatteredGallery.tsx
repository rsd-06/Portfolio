"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface GalleryImageDef {
    id: number;
    src: string;
    href: string;
    top: string;
    left: string;
    width: string;       // Desktop width
    mobileWidth: string; // Mobile/Tablet width
    speed: number;       // Parallax speed
    baseOpacity: number;
    zIndex: number;
}

const GALLERY_IMAGES: GalleryImageDef[] = [
    // Scattered completely naturally across the static 200vh container.
    { id: 1, src: "/hero.jpeg", href: "#", top: "5%", left: "10%", width: "16vw", mobileWidth: "38vw", speed: 1.1, baseOpacity: 0.8, zIndex: 2 },
    { id: 2, src: "/hero.jpeg", href: "#", top: "12%", left: "65%", width: "14vw", mobileWidth: "32vw", speed: 0.9, baseOpacity: 0.5, zIndex: 1 },
    { id: 3, src: "/hero.jpeg", href: "#", top: "18%", left: "30%", width: "18vw", mobileWidth: "42vw", speed: 1.2, baseOpacity: 0.9, zIndex: 3 },
    { id: 4, src: "/hero.jpeg", href: "#", top: "25%", left: "70%", width: "12vw", mobileWidth: "28vw", speed: 0.8, baseOpacity: 0.6, zIndex: 1 },
    { id: 5, src: "/hero.jpeg", href: "#", top: "32%", left: "15%", width: "20vw", mobileWidth: "45vw", speed: 1.15, baseOpacity: 0.8, zIndex: 2 },
    { id: 6, src: "/hero.jpeg", href: "#", top: "40%", left: "55%", width: "15vw", mobileWidth: "35vw", speed: 0.95, baseOpacity: 0.5, zIndex: 1 },
    { id: 7, src: "/hero.jpeg", href: "#", top: "48%", left: "20%", width: "14vw", mobileWidth: "32vw", speed: 1.1, baseOpacity: 0.9, zIndex: 3 },
    { id: 8, src: "/hero.jpeg", href: "#", top: "55%", left: "75%", width: "18vw", mobileWidth: "40vw", speed: 0.85, baseOpacity: 0.6, zIndex: 1 },
    { id: 9, src: "/hero.jpeg", href: "#", top: "62%", left: "35%", width: "16vw", mobileWidth: "38vw", speed: 1.05, baseOpacity: 0.8, zIndex: 2 },
    { id: 10, src: "/hero.jpeg", href: "#", top: "70%", left: "8%", width: "18vw", mobileWidth: "42vw", speed: 0.9, baseOpacity: 0.5, zIndex: 1 },
    { id: 11, src: "/hero.jpeg", href: "#", top: "78%", left: "60%", width: "13vw", mobileWidth: "30vw", speed: 1.2, baseOpacity: 0.9, zIndex: 3 },
    { id: 12, src: "/hero.jpeg", href: "#", top: "85%", left: "80%", width: "16vw", mobileWidth: "38vw", speed: 0.95, baseOpacity: 0.6, zIndex: 1 },
    { id: 13, src: "/hero.jpeg", href: "#", top: "90%", left: "20%", width: "19vw", mobileWidth: "45vw", speed: 1.1, baseOpacity: 0.8, zIndex: 2 },
    { id: 14, src: "/hero.jpeg", href: "#", top: "93%", left: "50%", width: "12vw", mobileWidth: "28vw", speed: 0.85, baseOpacity: 0.5, zIndex: 1 },
    { id: 15, src: "/hero.jpeg", href: "#", top: "96%", left: "70%", width: "17vw", mobileWidth: "40vw", speed: 1.05, baseOpacity: 0.9, zIndex: 3 },
];

interface ScatteredImageProps {
    img: GalleryImageDef;
    isDesktop: boolean;
}

function ScatteredImage({
    img,
    isDesktop
}: ScatteredImageProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Each image uniquely tracks its own presence passing through the viewport
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["100% 100%", "0% 0%"] // Progresses from 0 to 1 as it enters bottom and leaves top
    });

    const itemSmooth = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 20,
        restDelta: 0.001
    });

    // Create that parallax sliding offset
    // As it scrolls up across the viewport, it technically moves slightly extra relative to normal scroll speed
    // e.g. [0, 1] means moving from entering screen bottom to leaving screen top -> Offset [150px, -150px]
    const parallaxOffsetAmount = 150 * img.speed;
    const yParallax = useTransform(itemSmooth, [0, 1], [parallaxOffsetAmount, -parallaxOffsetAmount]);

    // Opacity fades out heavily when leaving at the extremes (0.0 to 0.15 and 0.85 to 1.0 of the scroll bounds)
    const opacityValue = useTransform(
        itemSmooth,
        [0, 0.2, 0.8, 1],
        [0.1, img.baseOpacity, img.baseOpacity, 0.1]
    );

    return (
        <motion.div
            ref={ref}
            className="absolute origin-center"
            style={{
                top: img.top,
                left: img.left,
                width: isDesktop ? img.width : img.mobileWidth,
                zIndex: img.zIndex,
                y: yParallax,
                opacity: opacityValue,
            }}
        >
            <motion.div
                className="relative w-full aspect-4/5 rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
                initial={{ opacity: img.baseOpacity, scale: 1 }}
                whileHover={{
                    opacity: 1,
                    scale: 1.05,
                    zIndex: 30, // pop to front
                    transition: { duration: 0.3 }
                }}
            >
                <Link href={img.href} className="block w-full h-full">
                    <Image
                        src={img.src}
                        alt={`Gallery image ${img.id}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 60vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                </Link>
            </motion.div>
        </motion.div>
    );
}

export default function VerticalScatteredGallery() {
    const targetRef = useRef<HTMLDivElement>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");
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

    // Quick mount check to avoid hydration mismatch on layout calculations
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 25 });

    // Shift the entire container slightly side-to-side based on mouse track
    const mouseContainerX = useTransform(smoothMouseX, [-1, 1], [-100, 100]);

    // 200vh tracking specifically for the text to pin it to viewport
    const { scrollYProgress: stickyProgress } = useScroll({
        target: mounted ? targetRef : undefined,
        offset: ["start start", "end end"]
    });

    // We translate the absolute 100vh text container exactly 100vh down over the 200vh section
    const textY = useTransform(stickyProgress, [0, 1], ["0vh", "100vh"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDesktop) return;
        const { clientX } = e;
        const xOffset = (clientX / window.innerWidth - 0.5) * 2; // Range: -1 to 1
        mouseX.set(xOffset);
    };

    if (!mounted) return <div className="h-[200vh] w-full bg-base-bg" />;

    return (
        <section
            ref={targetRef}
            className="relative h-[200vh] bg-base-bg w-full z-10 mt-(--header-height) overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => mouseX.set(0)}
        >
            {/* The Framer-Motion driven "Sticky" Gallery text pinned to the vertical center of the viewport */}
            <motion.div
                className="absolute top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-20"
                style={{ y: textY }}
            >
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-roboto font-extrabold text-text-primary text-center">
                    <span className="block opacity-90 drop-shadow-xl">Gallery</span>
                </h2>
            </motion.div>

            {/* The absolute container capturing mouse movements over 200vh height */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full z-10 pt-[30vh]"
                style={{
                    x: mouseContainerX,
                    maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
                }}
            >
                {GALLERY_IMAGES.map((img) => (
                    <ScatteredImage
                        key={img.id}
                        img={img}
                        isDesktop={isDesktop}
                    />
                ))}
            </motion.div>
        </section>
    );
}
