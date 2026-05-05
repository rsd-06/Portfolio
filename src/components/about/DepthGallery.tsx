"use client";

import { useRef, forwardRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import Image from "next/image";

// width is % of viewport width (vw)
// top is % of 320vh container height

const GALLERY_PHOTOS = [
  // id, top%, left%, width(%), depth(1-5), aspectRatio
  { id:1,  top: "2%",   left: "5%",   width: "22%", mobileWidth: "52%", depth: 2, aspectRatio: "3/4"  },
  { id:2,  top: "5%",   left: "52%",  width: "18%", mobileWidth: "42%", depth: 4, aspectRatio: "4/3"  },
  { id:3,  top: "11%",  left: "30%",  width: "20%", mobileWidth: "46%", depth: 1, aspectRatio: "1/1"  },
  { id:4,  top: "16%",  left: "72%",  width: "16%", mobileWidth: "38%", depth: 5, aspectRatio: "3/4"  },
  { id:5,  top: "22%",  left: "8%",   width: "24%", mobileWidth: "54%", depth: 3, aspectRatio: "4/3"  },
  { id:6,  top: "27%",  left: "42%",  width: "19%", mobileWidth: "44%", depth: 2, aspectRatio: "3/4"  },
  { id:7,  top: "32%",  left: "68%",  width: "21%", mobileWidth: "48%", depth: 1, aspectRatio: "1/1"  },
  { id:8,  top: "38%",  left: "18%",  width: "17%", mobileWidth: "40%", depth: 5, aspectRatio: "3/4"  },
  { id:9,  top: "43%",  left: "55%",  width: "23%", mobileWidth: "52%", depth: 3, aspectRatio: "4/3"  },
  { id:10, top: "49%",  left: "3%",   width: "20%", mobileWidth: "46%", depth: 4, aspectRatio: "3/4"  },
  { id:11, top: "54%",  left: "36%",  width: "18%", mobileWidth: "42%", depth: 2, aspectRatio: "1/1"  },
  { id:12, top: "60%",  left: "74%",  width: "15%", mobileWidth: "36%", depth: 1, aspectRatio: "3/4"  },
  { id:13, top: "65%",  left: "22%",  width: "22%", mobileWidth: "50%", depth: 5, aspectRatio: "4/3"  },
  { id:14, top: "71%",  left: "60%",  width: "19%", mobileWidth: "44%", depth: 3, aspectRatio: "3/4"  },
  { id:15, top: "76%",  left: "10%",  width: "16%", mobileWidth: "38%", depth: 4, aspectRatio: "1/1"  },
  { id:16, top: "81%",  left: "44%",  width: "21%", mobileWidth: "48%", depth: 2, aspectRatio: "3/4"  },
  { id:17, top: "86%",  left: "70%",  width: "17%", mobileWidth: "40%", depth: 1, aspectRatio: "4/3"  },
  { id:18, top: "91%",  left: "28%",  width: "23%", mobileWidth: "52%", depth: 3, aspectRatio: "3/4"  },
] as const;

type DepthLevel = 1 | 2 | 3 | 4 | 5;

const DEPTH_CONFIG: Record<DepthLevel, { opacity: number; brightness: number; parallaxRange: number; zIndex: number }> = {
  1: { opacity: 0.30, brightness: 1.0,  parallaxRange: 35,  zIndex: 1 },
  2: { opacity: 0.50, brightness: 0.92, parallaxRange: 55,  zIndex: 2 },
  3: { opacity: 0.65, brightness: 0.85, parallaxRange: 75,  zIndex: 3 },
  4: { opacity: 0.80, brightness: 0.78, parallaxRange: 95,  zIndex: 4 },
  5: { opacity: 0.95, brightness: 0.72, parallaxRange: 120, zIndex: 5 },
};

const SPRING_CONFIG: Record<DepthLevel, { stiffness: number; damping: number }> = {
  1: { stiffness: 40,  damping: 18 },
  2: { stiffness: 55,  damping: 20 },
  3: { stiffness: 70,  damping: 22 },
  4: { stiffness: 90,  damping: 25 },
  5: { stiffness: 110, damping: 28 },
};

function GalleryImage({ 
  photo, 
  scrollYProgress, 
  isMobile 
}: { 
  photo: typeof GALLERY_PHOTOS[number]; 
  scrollYProgress: MotionValue<number>; 
  isMobile: boolean 
}) {
  const depth = photo.depth as DepthLevel;
  const config = DEPTH_CONFIG[depth];

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? [0, 0]  
      : [
          -(config.parallaxRange / 2),
           (config.parallaxRange / 2),
        ]
  );

  const springConfig = SPRING_CONFIG[depth];
  const smoothY = useSpring(yOffset, springConfig);

  const willChange = depth >= 4 ? "transform" : "auto";

  return (
    <motion.div
      className="absolute"
      style={{
        top: photo.top,
        left: photo.left,
        width: photo.width,
        zIndex: config.zIndex,
        y: smoothY,
        willChange,
      }}
    >
      <div
        className={`relative w-full overflow-hidden rounded-xl group gallery-photo-${photo.id}`}
        style={{
          aspectRatio: photo.aspectRatio,
          opacity: config.opacity,
          filter: `brightness(${config.brightness})`,
          // CRITICAL FIX: Removed 'transform' from this transition so it doesn't fight Framer Motion's y offset!
          transition: "opacity 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease",
          boxShadow: `0 ${depth * 4}px ${depth * 16}px rgba(0,0,0,${0.05 + depth * 0.03})`,
          cursor: "default"
        }}
      >
        <style>{`
          .gallery-photo-${photo.id}:hover {
            opacity: 1 !important;
            filter: brightness(1) !important;
            z-index: 30 !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.2) !important;
          }
          .gallery-photo-${photo.id}:hover .photo-inner {
            transform: scale(1.04);
          }
        `}</style>

        <div 
          className="photo-inner w-full h-full" 
          style={{ transition: "transform 0.4s cubic-bezier(0.19,1,0.22,1)" }}
        >
          <Image
            src={`/aboutImages/photo-${photo.id}.jpg`}
            alt={`Gallery photo ${photo.id}`}
            fill
            sizes="(max-width: 768px) 60vw, 25vw"
            className="object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}

const DepthGallery = forwardRef<HTMLElement, {}>((props, externalRef) => {
  const localRef = useRef<HTMLElement>(null);
  const sectionRef = (externalRef as React.RefObject<HTMLElement>) ?? localRef;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textX = useTransform(scrollYProgress, [0, 1], ["-2vw", "2vw"]);

  if (isMobile) {
    return (
      <section 
        id="depth-gallery"
        ref={sectionRef} 
        className="relative w-full bg-base-bg py-20 overflow-hidden"
      >
        {/* Background text */}
        <div className="sticky top-[40vh] w-full flex justify-center pointer-events-none h-0 z-0">
          <motion.h2 
            className="f-display select-none whitespace-nowrap"
            style={{ 
                fontSize: "clamp(5rem,15vw,9rem)", 
                opacity: 0.05,
                color: "var(--color-text-primary)",
            }}
          >
            Gallery
          </motion.h2>
        </div>
        {/* Zigzag photos */}
        <div className="relative flex flex-col gap-6 px-4 z-10">
          {GALLERY_PHOTOS.map((photo, i) => (
            <div
              key={photo.id}
              className={`gallery-mobile-photo-${photo.id}`}
              style={{
                marginLeft: i % 2 === 0 ? "5vw" : "18vw",
                width: i % 2 === 0 ? "75vw" : "70vw",
                opacity: DEPTH_CONFIG[photo.depth as DepthLevel].opacity,
                filter: `brightness(${DEPTH_CONFIG[photo.depth as DepthLevel].brightness})`,
                transition: "opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease",
              }}
            >
              <style>{`
                .gallery-mobile-photo-${photo.id}:active {
                  opacity: 1 !important;
                  filter: brightness(1) !important;
                  transform: scale(1.02);
                }
              `}</style>
              <div style={{ aspectRatio: photo.aspectRatio, borderRadius: 12, overflow: "hidden", position: "relative" }}>
                <Image src={`/aboutImages/photo-${photo.id}.jpg`} alt="" fill loading="lazy" sizes="75vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="depth-gallery"
      ref={sectionRef}
      className="relative w-full bg-base-bg overflow-hidden"
      style={{ height: "320vh" }}
    >
      {/* ── Sticky background "Gallery" text ── */}
      <div className="sticky top-0 w-full h-[100dvh] flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.h2
          className="f-display select-none"
          style={{
            fontSize: "clamp(8rem, 20vw, 22rem)",
            fontWeight: 300,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            opacity: 0.07,
            color: "var(--color-text-primary)",
            userSelect: "none",
            x: textX,
          }}
          aria-hidden="true"
        >
          Gallery
        </motion.h2>
      </div>

      {/* ── Absolute photo container ── */}
      <div
        className="absolute inset-0 w-full max-w-[1600px] mx-auto"
        style={{
          paddingTop: "5vh",
          paddingBottom: "10vh",
        }}
      >
        {GALLERY_PHOTOS.map((photo) => (
          <GalleryImage
            key={photo.id}
            photo={photo}
            scrollYProgress={scrollYProgress}
            isMobile={false}
          />
        ))}
      </div>
    </section>
  );
});

DepthGallery.displayName = "DepthGallery";

export default DepthGallery;
