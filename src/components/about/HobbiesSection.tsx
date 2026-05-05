"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useLenis } from "@/components/providers/LenisProvider";

const HOBBY_CARDS = [
  {
    id: "running",
    title: "Running & Marathons",
    emoji: "🏃",
    icon: "/assets/hobbies/strava-icon.svg",
    titleImage: "/assets/hobbies/running-main.jpg",
    smallImages: [
      "/assets/hobbies/running-1.jpg",
      "/assets/hobbies/running-2.jpg",
    ],
    description: "Chasing kilometres and occasionally catching them. Running clears the head better than anything else I've tried.",
    link: { label: "Follow on Strava", href: "https://www.strava.com/athletes/rsd_exe" },
    tag: "Fitness · Endurance\n5K · 10K · Half Marathon",
  },
  {
    id: "movies",
    title: "Cinema",
    emoji: "🎬",
    icon: "/assets/hobbies/letterboxd-icon.svg",
    titleImage: "/assets/hobbies/movies-main.jpg",
    smallImages: [
      "/assets/hobbies/movies-1.jpg",
      "/assets/hobbies/movies-2.jpg",
    ],
    description: "Letterboxd is my second diary. Slow cinema, Tamil classics, and anything Nolan touches.",
    link: { label: "Letterboxd", href: "https://letterboxd.com/rsd_exe" },
    tag: "Cinema · Storytelling",
  },
  {
    id: "music",
    title: "Music",
    emoji: "🎵",
    icon: "/assets/hobbies/spotify-icon.svg",
    titleImage: "/assets/hobbies/music-main.jpg",
    smallImages: [
      "/assets/hobbies/spotify-wrap.jpg",
      "/assets/hobbies/music-2.jpg",
    ],
    description: "Always something playing. Indie, Tamil classics, lo-fi when coding. Music is a constant.",
    link: { label: "Spotify", href: "https://open.spotify.com/user/rsd_exe" },
    tag: "Indie · Tamil · Lo-fi",
  },
  {
    id: "history",
    title: "History & Geopolitics",
    emoji: "🌍",
    icon: null,
    titleImage: "/assets/hobbies/history-main.jpg",
    smallImages: [
      "/assets/hobbies/history-1.jpg",
      "/assets/hobbies/history-2.jpg",
    ],
    description: "Why the world is the way it is. Cold War obsession, South Asian partition, modern power dynamics.",
    link: null,
    tag: "History · Geopolitics",
  },
  {
    id: "photography",
    title: "Photography",
    emoji: "📷",
    icon: null,
    titleImage: "/assets/hobbies/photo-main.jpg",
    smallImages: [
      "/assets/hobbies/photo-1.jpg",
      "/assets/hobbies/photo-2.jpg",
      "/assets/hobbies/photo-3.jpg",
    ],
    description: "Finding frames in everyday places. Street, architecture, candid — whatever the light allows.",
    link: null,
    tag: "Street · Candid",
  },
  {
    id: "guitar",
    title: "Guitar",
    emoji: "🎸",
    icon: null,
    titleImage: "/assets/hobbies/guitar-main.jpg",
    smallImages: [
      "/assets/hobbies/guitar-1.jpg",
    ],
    description: "Started last year. Fingers hurt, chords ring wrong, but it's the best kind of frustration.",
    link: null,
    tag: "Learning · Acoustic",
  },
  {
    id: "basketball",
    title: "Basketball",
    emoji: "🏀",
    icon: null,
    titleImage: "/assets/hobbies/bball-main.jpg",
    smallImages: [
      "/assets/hobbies/bball-1.jpg",
      "/assets/hobbies/bball-2.jpg",
    ],
    description: "Pickup games, half-court shots, and very loud opinions about who the GOAT is.",
    link: null,
    tag: "Sport · Pickup",
  },
  {
    id: "travel",
    title: "Adventure & Travel",
    emoji: "🗺️",
    icon: null,
    titleImage: "/assets/hobbies/travel-main.jpg",
    smallImages: [
      "/assets/hobbies/travel-1.jpg",
      "/assets/hobbies/travel-2.jpg",
      "/assets/hobbies/travel-3.jpg",
    ],
    description: "Somewhere between a tourist and a wanderer. Any road with an unknown destination is a good one.",
    link: null,
    tag: "Explore · Road trips",
  },
  {
    id: "reading",
    title: "Reading",
    emoji: "📖",
    icon: null,
    titleImage: "/assets/hobbies/books-main.jpg",
    smallImages: [
      "/assets/hobbies/book-1.jpg",
      "/assets/hobbies/book-2.jpg",
    ],
    description: "Non-fiction mostly. History, philosophy, biography. A good book is a long conversation.",
    link: null,
    tag: "Non-fiction · Philosophy",
  },
  {
    id: "other",
    title: "& Everything Else",
    emoji: "✦",
    icon: null,
    titleImage: "/assets/hobbies/other-main.jpg",
    smallImages: [],
    description: "MUNs. Late-night drives. Debates about things that don't matter. The conversations that do.",
    link: null,
    tag: "MUN · Driving · Debating",
  },
];

type Hobby = (typeof HOBBY_CARDS)[number];

/* ─── End Card ─── */
function EndHobbyCard() {
  return (
    <div
      style={{
        flexShrink: 0,
        width: "50vw",
        height: "calc(100dvh - clamp(6rem, 12dvh, 8rem))",
        maxHeight: "800px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h3
        className="f-display"
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: 300,
          opacity: 0.5,
          color: "var(--color-text)",
        }}
      >
        &amp; more
      </h3>
      <p
        className="f-accent"
        style={{
          fontStyle: "italic",
          fontSize: "var(--text-sm)",
          opacity: 0.35,
          color: "var(--color-text)",
          marginTop: "0.5rem",
        }}
      >
        The list keeps growing.
      </p>
    </div>
  );
}

/* ─── Hobby Card ─── */
function HobbyCard({
  hobby,
  isActive,
  index,
  onActive,
  isMobile,
}: {
  hobby: Hobby;
  isActive: boolean;
  index: number;
  onActive: (id: string) => void;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          onActive(hobby.id);
        }
      },
      { root: null, threshold: 0.51 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hobby.id, onActive]);

  return (
    <motion.div
      ref={cardRef}
      role="article"
      aria-label={hobby.title}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: isMobile ? "88vw" : "clamp(360px, 42vw, 500px)",
        height: "calc(100dvh - clamp(6rem, 12dvh, 8rem))",
        maxHeight: "800px",
        border: hovered
          ? "1px solid color-mix(in srgb, var(--color-text) 25%, transparent)"
          : "1px solid var(--color-border)",
        backgroundColor: hovered
          ? "color-mix(in srgb, var(--color-text) 2%, transparent)"
          : "transparent",
        borderRadius: "clamp(12px, 2vw, 20px)",
        padding: "clamp(1.25rem, 2.5vw, 2rem)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.4s ease",
        position: "relative",
      }}
    >
      {/* Active Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(0.4rem, 1vw, 0.8rem)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <motion.div
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            backgroundColor: "var(--color-text)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Top Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>{hobby.emoji}</span>
          <div
            className="f-mono"
            style={{
              fontSize: "var(--text-2xs)",
              opacity: 0.5,
              marginTop: "0.2rem",
              color: "var(--color-text)",
            }}
          >
            {hobby.tag.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
        {hobby.icon && (
          <Image
            src={hobby.icon}
            alt="icon"
            width={28}
            height={28}
            style={{ opacity: 0.5 }}
          />
        )}
      </div>

      {/* Title Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "40%" : "45%",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <motion.div
          animate={{ scale: hovered ? 1.03 : 1 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Image
            src={hobby.titleImage}
            alt={hobby.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 88vw, 42vw"
          />
        </motion.div>
      </div>

      {/* Title */}
      <h3
        className="f-display"
        style={{
          fontSize: "var(--text-xl)",
          fontWeight: 300,
          color: "var(--color-text)",
          marginBottom: "0.5rem",
        }}
      >
        {hobby.title}
      </h3>

      {/* Description */}
      <p
        className="f-mono"
        style={{
          fontSize: "var(--text-xs)",
          opacity: 0.55,
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          color: "var(--color-text)",
        }}
      >
        {hobby.description}
      </p>

      {/* Bottom Section */}
      <div style={{ marginTop: "auto" }}>
        {hobby.smallImages.length > 0 && (
          <div
            className="small-images-row"
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1rem",
              alignItems: hobby.id === "music" ? "flex-end" : "stretch",
            }}
          >
            {hobby.smallImages.map((src, i) => {
              const isPhoto = hobby.id === "photography";
              const isGuitar = hobby.id === "guitar";
              const isMusicWrap = src.includes("wrap");

              return (
                <div
                  key={i}
                  className="small-image-wrapper"
                  style={{
                    position: "relative",
                    height: isMobile
                      ? "60px"
                      : isMusicWrap
                      ? "100px"
                      : "80px",
                    flex: isPhoto ? 1 : isGuitar ? 1 : isMusicWrap ? "none" : 1,
                    width: isMusicWrap ? "65px" : "auto",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Image
                    src={src}
                    alt={`${hobby.title} - personal photo ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="150px"
                  />
                </div>
              );
            })}
          </div>
        )}

        {hobby.link && (
          <a
            href={hobby.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="f-mono"
            aria-label={`Follow on ${hobby.link.label} - opens in new tab`}
            style={{
              fontSize: "var(--text-2xs)",
              opacity: 0.45,
              textDecoration: "none",
              color: "var(--color-text)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.45")}
          >
            ↗ {hobby.link.label}
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function HobbiesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const AUTO_ADVANCE_MS = isMobile ? 5000 : 4000;

  const rawX = useMotionValue(0);
  const negX = useMotionValue(0);

  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardId, setActiveCardId] = useState(HOBBY_CARDS[0].id);

  const maxScrollRef = useRef(0);
  const lastScrollY = useRef(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [autoAdvanceKey, setAutoAdvanceKey] = useState(0);

  // Sync negX
  useEffect(() => {
    return rawX.on("change", (v) => {
      negX.set(-v);
    });
  }, [rawX, negX]);

  const smoothNegX = useSpring(negX, {
    stiffness: 120,
    damping: 35,
    restDelta: 0.5,
  });

  // Calculate Max Scroll dynamically
  useEffect(() => {
    if (!trackRef.current) return;
    const trackEl = trackRef.current;

    const updateMax = () => {
      maxScrollRef.current = trackEl.scrollWidth - window.innerWidth;
    };

    updateMax();

    const observer = new ResizeObserver(() => {
      updateMax();
    });
    observer.observe(trackEl);

    window.addEventListener("resize", updateMax);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMax);
    };
  }, []);

  // Window scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (!sectionRef.current || isActive) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const tolerance = 5;

      if (scrollingDown) {
        if (!isComplete && rect.top <= tolerance && rect.top >= -50) {
          if (lenis) lenis.scrollTo(sectionRef.current, { immediate: true });
          setIsActive(true);
        }
      } else {
        if (isComplete && rect.top >= -tolerance && rect.top <= 50) {
          if (lenis) lenis.scrollTo(sectionRef.current, { immediate: true });
          setIsActive(true);
          setIsComplete(false);
          rawX.set(maxScrollRef.current);
        }
      }

      if (rect.top > window.innerHeight || rect.bottom < 0) {
        setIsComplete(false);
        rawX.set(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isActive, isComplete, lenis, rawX]);

  // Handle Lenis start/stop
  useEffect(() => {
    if (!lenis) return;
    if (isActive) {
      lenis.stop();
    } else {
      lenis.start();
    }
    return () => lenis.start();
  }, [isActive, lenis]);

  const handleUserInteraction = () => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      setAutoAdvanceKey((k) => k + 1);
    }, 2000);
  };

  // Intercept Wheel
  useEffect(() => {
    if (!sectionRef.current) return;

    const onWheel = (e: WheelEvent) => {
      if (!isActive) return;

      e.preventDefault();
      e.stopPropagation();
      handleUserInteraction();

      const delta = e.deltaY || e.deltaX;
      const current = rawX.get();

      if (current <= 0 && delta < 0) {
        setIsActive(false);
        return;
      }
      if (current >= maxScrollRef.current && delta > 0) {
        setIsComplete(true);
        setIsActive(false);
        return;
      }

      const next = Math.max(0, Math.min(current + delta, maxScrollRef.current));
      rawX.set(next);
    };

    const el = sectionRef.current;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isActive, rawX]);

  // Intercept Touch
  useEffect(() => {
    if (!sectionRef.current) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      handleUserInteraction();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isActive) return;

      const dx = startX - e.touches[0].clientX;
      const dy = startY - e.touches[0].clientY;

      if (Math.abs(dx) > Math.abs(dy) || isActive) {
        e.preventDefault();

        const current = rawX.get();

        if (current <= 0 && dx < 0) {
          setIsActive(false);
          return;
        }
        if (current >= maxScrollRef.current && dx > 0) {
          setIsComplete(true);
          setIsActive(false);
          return;
        }

        const next = Math.max(
          0,
          Math.min(current + dx * 1.5, maxScrollRef.current)
        );
        rawX.set(next);
        startX = e.touches[0].clientX;
      }
    };

    const el = sectionRef.current;
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [isActive, rawX]);

  // Intercept Keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      const current = rawX.get();
      const cardWidth = isMobile
        ? window.innerWidth * 0.88
        : Math.max(360, Math.min(window.innerWidth * 0.42, 500));

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleUserInteraction();
        if (current >= maxScrollRef.current) {
          setIsComplete(true);
          setIsActive(false);
        } else {
          rawX.set(Math.min(current + cardWidth, maxScrollRef.current));
        }
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleUserInteraction();
        if (current <= 0) {
          setIsActive(false);
        } else {
          rawX.set(Math.max(current - cardWidth, 0));
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, rawX, isMobile]);

  // Auto Advance
  useEffect(() => {
    if (isPaused || isComplete || !isActive) return;

    // respect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const id = setInterval(() => {
      const cardWidth = isMobile
        ? window.innerWidth * 0.88
        : Math.max(360, Math.min(window.innerWidth * 0.42, 500));
      const next = Math.min(rawX.get() + cardWidth, maxScrollRef.current);
      rawX.set(next);
      setAutoAdvanceKey((k) => k + 1);

      if (next >= maxScrollRef.current - 2) {
        setIsComplete(true);
        setIsActive(false);
      }
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(id);
  }, [isPaused, isComplete, isActive, rawX, AUTO_ADVANCE_MS, isMobile]);

  // Progress Bar
  const progressBarScaleX = useSpring(0, { stiffness: 120, damping: 35 });
  useEffect(() => {
    return rawX.on("change", (v) => {
      if (maxScrollRef.current > 0) {
        progressBarScaleX.set(v / maxScrollRef.current);
      }
    });
  }, [rawX, progressBarScaleX]);

  return (
    <section
      ref={sectionRef}
      aria-label="Interests and hobbies"
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        touchAction: "pan-x",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setAutoAdvanceKey((k) => k + 1);
      }}
    >
      <style>{`
        .small-images-row:hover .small-image-wrapper {
          opacity: 0.4;
        }
        .small-images-row .small-image-wrapper:hover {
          opacity: 1;
          transform: scale(1.08);
          z-index: 20;
        }
      `}</style>
      <div className="sticky top-0 w-full" style={{ height: "100dvh" }}>
        {/* Header bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "clamp(1.2rem, 3vw, 2rem) var(--page-px)",
            borderBottom: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <div>
            <p
              className="f-mono uppercase"
              style={{
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.2em",
                opacity: 0.35,
                color: "var(--color-text)",
              }}
            >
              interests & hobbies
            </p>
            <h2
              className="f-display"
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                marginTop: "0.25rem",
                color: "var(--color-text)",
              }}
            >
              Beyond the screen.
            </h2>
          </div>
          {!isMobile && (
            <p
              className="f-mono"
              style={{
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.14em",
                opacity: 0.3,
                textAlign: "right",
                alignSelf: "flex-end",
                color: "var(--color-text)",
              }}
            >
              {HOBBY_CARDS.length} things
            </p>
          )}
        </div>

        {/* Track */}
        <motion.div
          ref={trackRef}
          style={{
            x: smoothNegX,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            willChange: "transform",
            paddingTop: "clamp(4rem, 8vh, 6rem)",
            paddingLeft: "var(--page-px)",
            paddingRight: "50vw",
            gap: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          {HOBBY_CARDS.map((hobby, index) => (
            <HobbyCard
              key={hobby.id}
              hobby={hobby}
              isActive={activeCardId === hobby.id}
              index={index}
              onActive={setActiveCardId}
              isMobile={isMobile}
            />
          ))}
          <EndHobbyCard />
        </motion.div>

        {/* Progress bar */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "var(--color-border)",
            zIndex: 10,
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: "var(--color-text)",
              transformOrigin: "left",
              scaleX: progressBarScaleX,
              opacity: 0.3,
            }}
          />
        </div>

        {/* Auto-advance time indicator */}
        <AnimatePresence mode="wait">
          {!isPaused && isActive && !isComplete && !isMobile && (
            <motion.div
              key={autoAdvanceKey}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
              style={{
                position: "absolute",
                bottom: "1px",
                left: 0,
                height: "2px",
                width: "100%",
                background: "var(--color-text)",
                opacity: 0.15,
                transformOrigin: "left",
                zIndex: 10,
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
