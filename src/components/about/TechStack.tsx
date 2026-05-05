"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll } from "framer-motion";
import { useLenis } from "@/components/providers/LenisProvider";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiFlask,
  SiMongodb,
  SiSupabase,
  SiScikitlearn,
  SiPytorch,
  SiDocker,
  SiGithub,
  SiVercel,
  SiLinux,
  SiRaspberrypi,
} from "react-icons/si";
import { IconType } from "react-icons";

type TechItem = {
    icon: IconType;
    name: string;
    category: string;
    note: string;
};

const TECH_STACK: TechItem[] = [
  { icon: SiReact,        name: "React",          category: "Frontend",  note: "Component architecture" },
  { icon: SiNextdotjs,    name: "Next.js",        category: "Frontend",  note: "Full-stack framework"   },
  { icon: SiTypescript,   name: "TypeScript",     category: "Language",  note: "Type-safe JS"           },
  { icon: SiTailwindcss,  name: "Tailwind CSS",   category: "Styling",   note: "Utility-first CSS"      },
  { icon: SiFramer,       name: "Framer Motion",  category: "Animation", note: "Motion & transitions"   },
  { icon: SiNodedotjs,    name: "Node.js",        category: "Backend",   note: "Server runtime"         },
  { icon: SiExpress,      name: "Express",        category: "Backend",   note: "REST API layer"         },
  { icon: SiPython,       name: "Python",         category: "Language",  note: "ML & scripting"         },
  { icon: SiFlask,        name: "Flask",          category: "Backend",   note: "Lightweight API"        },
  { icon: SiMongodb,      name: "MongoDB",        category: "Database",  note: "Document store"         },
  { icon: SiSupabase,     name: "Supabase",       category: "Database",  note: "Postgres + auth"        },
  { icon: SiScikitlearn,  name: "scikit-learn",   category: "ML",        note: "Classical ML models"    },
  { icon: SiPytorch,      name: "PyTorch",        category: "ML",        note: "Deep learning"          },
  { icon: SiDocker,       name: "Docker",         category: "DevOps",    note: "Containerisation"       },
  { icon: SiGithub,       name: "GitHub",         category: "Tools",     note: "Version control"        },
  { icon: SiVercel,       name: "Vercel",         category: "DevOps",    note: "Frontend deploy"        },
  { icon: SiLinux,        name: "Linux",          category: "Tools",     note: "Arch + Hyprland"        },
  { icon: SiRaspberrypi,  name: "Raspberry Pi",   category: "Hardware",  note: "Embedded systems"       },
];

function TechCard({ tech, index, isTouchDevice, isActive, onToggle }: { tech: TechItem; index: number; isTouchDevice: boolean; isActive: boolean; onToggle: () => void }) {
  const [localHovered, setLocalHovered] = useState(false);
  const hovered = isTouchDevice ? isActive : localHovered;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: (index % 6) * 0.04, 
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="relative w-full h-[130px]"
      style={{
        transformStyle: !isTouchDevice ? "preserve-3d" : "flat",
        zIndex: hovered ? 50 : 1,
      }}
      role="listitem"
      aria-label={`${tech.name} — ${tech.category}`}
    >
      <motion.div
        className="absolute top-0 left-0 w-full"
        whileHover={!isTouchDevice ? {
          z: 40,
          scale: 1.06,
          transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] },
        } : {}}
        onHoverStart={() => !isTouchDevice && setLocalHovered(true)}
        onHoverEnd={() => !isTouchDevice && setLocalHovered(false)}
        onClick={() => isTouchDevice && onToggle()}
        style={{
          border: `1px solid ${hovered ? "var(--color-text-primary)" : "rgba(100, 100, 100, 0.15)"}`,
          borderRadius: "clamp(6px, 1vw, 10px)",
          padding: "clamp(1rem, 2vw, 1.5rem) clamp(0.75rem, 1.5vw, 1.25rem)",
          backgroundColor: hovered ? "var(--color-text-primary)" : "var(--color-base-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          minHeight: "100%",
          gap: "clamp(0.5rem, 1vw, 0.75rem)",
          transition: "background-color 0.3s ease, border-color 0.3s ease",
          userSelect: "none",
          transformStyle: !isTouchDevice ? "preserve-3d" : "flat",
          cursor: "pointer",
        }}
      >
        <p
          className="f-mono absolute"
          style={{
            top: "0.5rem",
            right: "0.6rem",
            fontSize: "10px",
            letterSpacing: "0.12em",
            opacity: hovered ? 0.4 : 0.2,
            color: hovered ? "var(--color-base-bg)" : "var(--color-text-primary)",
            transition: "opacity 0.3s ease, color 0.3s ease",
            textTransform: "uppercase",
          }}
        >
          {tech.category}
        </p>

        <div
          style={{
            fontSize: "clamp(22px, 2.5vw, 28px)",
            color: hovered ? "var(--color-base-bg)" : "var(--color-text-primary)",
            opacity: hovered ? 1 : 0.75,
            transition: "color 0.3s ease, opacity 0.3s ease",
            marginTop: "0.5rem",
          }}
          aria-hidden="true"
        >
          <tech.icon />
        </div>

        <p
          className="f-mono mt-auto pt-2"
          style={{
            fontSize: "12px",
            letterSpacing: "0.06em",
            color: hovered ? "var(--color-base-bg)" : "var(--color-text-primary)",
            opacity: hovered ? 1 : 0.8,
            transition: "color 0.3s ease",
            lineHeight: 1.2,
          }}
        >
          {tech.name}
        </p>

        <motion.div
          animate={{
            height: hovered ? "auto" : 0,
            opacity: hovered ? 0.55 : 0,
            marginTop: hovered ? "4px" : "0px"
          }}
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          style={{ overflow: "hidden", width: "100%" }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <p
            className="font-inter font-light"
            style={{
              fontSize: "11px",
              color: hovered ? "var(--color-base-bg)" : "var(--color-text-primary)",
              letterSpacing: "0.02em",
              lineHeight: 1.4,
              transition: "color 0.3s ease",
            }}
          >
            {tech.note}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function TechStack() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const updateMax = () => {
      if (trackRef.current) {
        // max distance to scroll horizontally is track width minus viewport width
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
      }
    };
    updateMax();
    const observer = new ResizeObserver(() => updateMax());
    observer.observe(trackRef.current);
    
    window.addEventListener("resize", updateMax);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMax);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const smoothX = useSpring(rawX, { stiffness: 120, damping: 25, restDelta: 0.5 });

  return (
    <section 
      ref={containerRef}
      className="w-full relative bg-base-bg"
      style={{ height: `calc(100vh + ${scrollRange}px)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-start">
        
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.35 }}
            viewport={{ once: true }}
            className="absolute top-[var(--nav-h,120px)] left-[var(--page-px)] f-mono text-2xs tracking-widest uppercase"
        >
            tools & stack
        </motion.div>

        {/* Title container that stays static in the view while grid scrolls horizontally */}
        <div className="w-full pointer-events-none z-10 px-[var(--page-px)] pt-[calc(var(--nav-h,120px)+3rem)] flex-shrink-0">
            <div className="max-w-7xl mx-auto w-full relative">
                {/* Main title placed slightly below the top muted text */}
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                    className="f-display text-4xl md:text-5xl font-light tracking-[-0.03em] text-text-primary"
                >
                    Tools & Tech Stack I Use
                </motion.h2>
            </div>
        </div>

        {/* Wrapper for the moving track */}
        <div
            style={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "clamp(4rem, 10vh, 7rem)", // increased gap between heading and grid
                paddingBottom: "5vh",
            }}
        >
            {/* The actual track that moves horizontally via transform */}
            <motion.div
                ref={trackRef}
                style={{
                    x: smoothX,
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(3, min-content)", // ALWAYS exactly 3 rows
                    gridAutoColumns: "minmax(clamp(140px, 15vw, 180px), 1fr)",
                    gap: "clamp(0.75rem, 1.5vw, 1.25rem)",
                    paddingLeft: "clamp(2rem, 10vw, 16rem)", // Generous left spacing
                    paddingRight: 0,
                    transformStyle: isTouchDevice ? "flat" : "preserve-3d",
                }}
            >
                {TECH_STACK.map((tech, i) => (
                    <TechCard 
                        key={tech.name} 
                        tech={tech} 
                        index={i} 
                        isTouchDevice={isTouchDevice} 
                        isActive={activeCardIndex === i}
                        onToggle={() => setActiveCardIndex(prev => prev === i ? null : i)}
                    />
                ))}
                {/* Explicit right spacer — ensures the last card never sticks to the viewport edge */}
                <div
                  aria-hidden="true"
                  style={{
                    gridRow: "1 / -1",          // span all 3 rows
                    width: "clamp(8rem, 18vw, 22rem)",
                    height: "1px",              // zero visual footprint
                    flexShrink: 0,
                    pointerEvents: "none",
                  }}
                />
            </motion.div>
        </div>
      </div>
    </section>
  );
}
