"use client";

import { useRef, forwardRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Image from "next/image";

const DEPTH_CONFIG = {
    1: { parallaxSpeed: 0.3, opacity: 0.85, scale: 0.92, brightness: 1.0, zIndex: 1 },
    2: { parallaxSpeed: 0.6, opacity: 0.70, scale: 0.96, brightness: 0.85, zIndex: 2 },
    3: { parallaxSpeed: 0.9, opacity: 0.55, scale: 1.00, brightness: 0.70, zIndex: 3 },
    4: { parallaxSpeed: 1.3, opacity: 0.40, scale: 1.03, brightness: 0.55, zIndex: 4 },
    5: { parallaxSpeed: 1.7, opacity: 0.28, scale: 1.06, brightness: 0.40, zIndex: 5 },
} as const;

const GALLERY_PHOTOS = [
    { id:1,  depth:1, top:"3%",  left:"8%",  width:"18vw", mobileWidth:"40vw", aspectRatio:"3/4"  },
    { id:2,  depth:1, top:"20%", left:"62%", width:"14vw", mobileWidth:"34vw", aspectRatio:"4/3"  },
    { id:3,  depth:1, top:"55%", left:"72%", width:"16vw", mobileWidth:"38vw", aspectRatio:"3/4"  },
    { id:4,  depth:1, top:"80%", left:"15%", width:"20vw", mobileWidth:"44vw", aspectRatio:"1/1"  },

    { id:5,  depth:2, top:"10%", left:"40%", width:"15vw", mobileWidth:"36vw", aspectRatio:"4/3"  },
    { id:6,  depth:2, top:"38%", left:"5%",  width:"17vw", mobileWidth:"40vw", aspectRatio:"3/4"  },
    { id:7,  depth:2, top:"70%", left:"58%", width:"13vw", mobileWidth:"32vw", aspectRatio:"1/1"  },

    { id:8,  depth:3, top:"15%", left:"72%", width:"16vw", mobileWidth:"38vw", aspectRatio:"3/4"  },
    { id:9,  depth:3, top:"44%", left:"28%", width:"18vw", mobileWidth:"42vw", aspectRatio:"4/3"  },
    { id:10, depth:3, top:"75%", left:"78%", width:"14vw", mobileWidth:"34vw", aspectRatio:"3/4"  },

    { id:11, depth:4, top:"25%", left:"52%", width:"13vw", mobileWidth:"30vw", aspectRatio:"1/1"  },
    { id:12, depth:4, top:"60%", left:"12%", width:"19vw", mobileWidth:"44vw", aspectRatio:"4/3"  },

    { id:13, depth:5, top:"32%", left:"80%", width:"12vw", mobileWidth:"28vw", aspectRatio:"3/4"  },
    { id:14, depth:5, top:"50%", left:"42%", width:"14vw", mobileWidth:"32vw", aspectRatio:"1/1"  },
    { id:15, depth:5, top:"85%", left:"65%", width:"16vw", mobileWidth:"38vw", aspectRatio:"4/3"  },
];

function GalleryImage({ photo, scrollYProgress, isMobile }: { photo: any, scrollYProgress: any, isMobile: boolean }) {
    const config = DEPTH_CONFIG[photo.depth as keyof typeof DEPTH_CONFIG];
    
    const yOffset = useTransform(
        scrollYProgress,
        [0, 1],
        [`${-config.parallaxSpeed * 120}px`, `${config.parallaxSpeed * 120}px`]
    );

    const smoothY = useSpring(yOffset, { 
        stiffness: isMobile ? 100 : 60, 
        damping: isMobile ? 25 : 20 
    });

    return (
        <motion.div
            className="absolute rounded-lg overflow-hidden group cursor-pointer shadow-xl"
            style={{
                top: photo.top,
                left: photo.left,
                width: isMobile ? photo.mobileWidth : photo.width,
                aspectRatio: photo.aspectRatio,
                zIndex: config.zIndex,
                y: smoothY,
                opacity: config.opacity,
                scale: config.scale,
                filter: `brightness(${config.brightness})`,
            }}
            whileHover={!isMobile ? {
                scale: config.scale * 1.06,
                filter: "brightness(1)",
                zIndex: 20,
                opacity: 1,
            } : undefined}
            transition={{ duration: 0.3 }}
        >
            <Image
                src={`/aboutImages/photo-${photo.id}.jpg`}
                alt={`Gallery photo ${photo.id}`}
                fill
                className="object-cover"
            />
        </motion.div>
    );
}

const DepthGallery = forwardRef<HTMLElement, {}>((props, externalRef) => {
    const localRef = useRef<HTMLElement>(null);
    const sectionRef = (externalRef as any) || localRef;
    const isMobile = useMediaQuery("(max-width: 767px)");

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    const stickyProgress = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    }).scrollYProgress;

    const textY = useTransform(stickyProgress, [0, 1], ["0vh", "150vh"]);

    return (
        <section 
            id="depth-gallery"
            ref={sectionRef} 
            className="h-[250vh] w-full relative bg-base-bg overflow-hidden"
            style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)"
            }}
        >
            <motion.div 
                className="absolute inset-0 flex justify-center items-center pointer-events-none"
                style={{ y: textY, zIndex: 0 }}
            >
                <h2 className="f-display text-[clamp(4rem,10vw,8rem)] font-light opacity-[0.08] text-text-primary uppercase tracking-widest">
                    Gallery
                </h2>
            </motion.div>

            <div className="relative w-full h-full max-w-7xl mx-auto">
                {GALLERY_PHOTOS.map((photo) => (
                    <GalleryImage 
                        key={photo.id} 
                        photo={photo} 
                        scrollYProgress={scrollYProgress} 
                        isMobile={isMobile} 
                    />
                ))}
            </div>
        </section>
    );
});

DepthGallery.displayName = "DepthGallery";
export default DepthGallery;
