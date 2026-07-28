"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useLenis } from "@/components/providers/LenisProvider";
import { ArrowUpRight } from "lucide-react";

const HOBBY_CARDS = [
  {
    id: "running",
    title: "Running & Marathons",
    titleImage: "/assets/aboutPageImages/hobbyImages/runImage.jpg",
    smallImages: [],
    description: "Chasing kilometres and occasionally catching them. Running clears the head better than anything else I've tried.",
    link: { label: "Follow on Strava", href: "https://www.strava.com/athletes/rsudharshan_athlete" },
    headerIcons: [
      { src: "/assets/aboutPage/hobbyIcons/Strava.svg", href: "https://www.strava.com/athletes/rsudharshan_athlete", alt: "Strava" }
    ],
    tag: "Fitness · Endurance\n5K · 10K · Half Marathon",
  },
  {
    id: "movies",
    title: "Cinema",
    titleImage: "/assets/aboutPageImages/hobbyImages/cinemaImages.png",
    smallImages: [],
    description: "Letterboxd is my second diary. Slow cinema, Tamil classics, and anything Nolan touches.",
    link: { label: "Letterboxd", href: "https://letterboxd.com/rsudharshan_06/" },
    headerIcons: [
      { src: "https://a.ltrbxd.com/logos/letterboxd-decal-dots-pos-rgb.svg", href: "https://letterboxd.com/rsudharshan_06/", alt: "Letterboxd" }
    ],
    tag: "Cinema · Storytelling",
  },
  {
    id: "music",
    title: "Music",
    titleImage: "/assets/aboutPageImages/hobbyImages/musicImage.jpg",
    smallImages: [],
    description: "Always something playing. Indie, Tamil classics, lo-fi when coding. Music is a constant.",
    link: { label: "Spotify", href: "https://open.spotify.com/user/314kxlcurw7nmgc6nbp4hxuun6va" },
    headerIcons: [
      { src: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png", href: "https://open.spotify.com/user/314kxlcurw7nmgc6nbp4hxuun6va", alt: "Spotify" },
      { src: "/assets/aboutPage/hobbyIcons/appleMusic.svg", href: "https://music.apple.com/profile/sudharshan195?ls", alt: "Apple Music" }
    ],
    tag: "Indie · Tamil · Lo-fi",
  },
  {
    id: "history",
    title: "History & Geopolitics",
    titleImage: "/assets/aboutPageImages/hobbyImages/historyImage.jpg",
    smallImages: [],
    description: "Why the world is the way it is. Cold War obsession, South Asian partition, modern power dynamics.",
    link: null,
    tag: "History · Geopolitics",
  },
  {
    id: "photography",
    title: "Photography",
    titleImage: "/assets/aboutPageImages/hobbyImages/photoGraphyImage.jpg",
    smallImages: [],
    description: "Finding frames in everyday places. Street, architecture, candid — whatever the light allows.",
    link: null,
    tag: "Street · Candid",
  },
  {
    id: "guitar",
    title: "Guitar",
    titleImage: "/assets/aboutPageImages/hobbyImages/guitarImage.jpg",
    smallImages: [],
    description: "Started last year. Fingers hurt, chords ring wrong, but it's the best kind of frustration.",
    link: null,
    tag: "Learning · Acoustic",
  },
  {
    id: "basketball",
    title: "Basketball",
    titleImage: "/assets/aboutPageImages/hobbyImages/basketBallImage.jpg",
    smallImages: [],
    description: "Pickup games, half-court shots, and very loud opinions about who the GOAT is.",
    link: null,
    tag: "Sport · Pickup",
  },
  {
    id: "travel",
    title: "Adventure & Travel",
    titleImage: "/assets/aboutPageImages/hobbyImages/adventureImage.jpg",
    smallImages: [],
    description: "Somewhere between a tourist and a wanderer. Any road with an unknown destination is a good one.",
    link: null,
    tag: "Explore · Road trips",
  },
  {
    id: "reading",
    title: "Reading",
    titleImage: "/assets/aboutPageImages/hobbyImages/readingImage.jpg",
    smallImages: [],
    description: "Non-fiction mostly. History, philosophy, biography. A good book is a long conversation.",
    link: null,
    tag: "Non-fiction · Philosophy",
  },
  {
    id: "other",
    title: "& Everything Else",
    titleImage: "/assets/aboutPageImages/hobbyImages/musicImage.jpg",
    smallImages: [],
    description: "MUNs. Late-night drives. Debates about things that don't matter. The conversations that do.",
    link: null,
    tag: "MUN · Driving · Debating",
  },
];

type Hobby = (typeof HOBBY_CARDS)[number];

/* ─── End Card ─── */
function EndHobbyCard({ smoothNegX }: { smoothNegX: MotionValue<number> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardCenter, setCardCenter] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1000);

  useEffect(() => {
    const updateSize = () => {
      setWindowWidth(window.innerWidth);
      if (cardRef.current) {
        setCardCenter(cardRef.current.offsetLeft + cardRef.current.offsetWidth / 2);
      }
    };
    updateSize();
    const t = setTimeout(updateSize, 100);
    window.addEventListener("resize", updateSize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const distance = useTransform(smoothNegX, (x) => (cardCenter + x) - (windowWidth / 2));
  const normalizedDistance = useTransform(distance, (d) => windowWidth === 0 ? 0 : d / (windowWidth / 2));
  const rotateZ = useTransform(normalizedDistance, [-2, -1, 0, 1, 2], [-10, -5, 0, 5, 10]);
  const y = useTransform(normalizedDistance, [-2, -1, 0, 1, 2], [100, 30, 0, 30, 100]);
  const scale = useTransform(normalizedDistance, [-2, -1, 0, 1, 2], [0.8, 0.9, 1, 0.9, 0.8]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        y, rotateZ, scale,
        flexShrink: 0,
        width: "50vw",
        height: "calc(100dvh - clamp(10rem, 22dvh, 14rem))",
        maxHeight: "650px",
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
    </motion.div>
  );
}

/* ─── Hobby Card ─── */
function HobbyCard({
  hobby,
  isActive,
  index,
  onActive,
  isMobile,
  smoothNegX,
}: {
  hobby: Hobby;
  isActive: boolean;
  index: number;
  onActive: (id: string) => void;
  isMobile: boolean;
  smoothNegX: MotionValue<number>;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [cardCenter, setCardCenter] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1000);

  useEffect(() => {
    const updateSize = () => {
      setWindowWidth(window.innerWidth);
      if (cardRef.current) {
        setCardCenter(cardRef.current.offsetLeft + cardRef.current.offsetWidth / 2);
      }
    };
    updateSize();
    const t = setTimeout(updateSize, 100);
    window.addEventListener("resize", updateSize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const distance = useTransform(smoothNegX, (x) => (cardCenter + x) - (windowWidth / 2));
  const normalizedDistance = useTransform(distance, (d) => windowWidth === 0 ? 0 : d / (windowWidth / 2));
  
  const rotateZ = useTransform(normalizedDistance, [-2, -1, 0, 1, 2], [-12, -6, 0, 6, 12]);
  const y = useTransform(normalizedDistance, [-2, -1, 0, 1, 2], [120, 30, 0, 30, 120]);
  const scale = useTransform(normalizedDistance, [-2, -1, 0, 1, 2], [0.85, 0.95, 1, 0.95, 0.85]);

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
        y, rotateZ, scale,
        flexShrink: 0,
        width: isMobile ? "88vw" : "clamp(360px, 42vw, 500px)",
        height: "calc(100dvh - clamp(10rem, 22dvh, 14rem))",
        maxHeight: "650px",
        background: "color-mix(in srgb, var(--color-text) 3%, transparent)",
        boxShadow: hovered 
          ? "0 30px 60px -15px color-mix(in srgb, var(--color-text) 10%, transparent)" 
          : "0 10px 30px -10px color-mix(in srgb, var(--color-text) 5%, transparent)",
        border: "1px solid color-mix(in srgb, var(--color-text) 5%, transparent)",
        borderRadius: "clamp(16px, 2vw, 24px)",
        padding: "clamp(1rem, 2vw, 1.5rem)",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.4s ease",
        position: "relative",
      }}
    >
      {/* Title Image edge to edge inside the padding, rounded */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "55%", 
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
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

      {/* Text Content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div className="flex items-center justify-between mb-2">
          <h3
            className="f-display"
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 400,
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
              margin: 0
            }}
          >
            {hobby.title}
          </h3>
          {/* Icons container pushed to the right */}
          <div className="flex items-center gap-4">
            {(hobby as any).headerIcons?.map((icon: any, i: number) => (
              <a 
                key={i} 
                href={icon.href} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex items-center gap-1 opacity-60 hover:opacity-100 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 mt-1 cursor-pointer"
                title={`Visit my ${icon.alt} profile`}
              >
                <img 
                  src={icon.src} 
                  alt={icon.alt} 
                  width={28} 
                  height={28} 
                  className="object-contain w-7 h-7 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" 
                />
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
              </a>
            ))}
          </div>
        </div>

        <p
          className="f-mono"
          style={{
            fontSize: "var(--text-sm)",
            opacity: 0.6,
            lineHeight: 1.5,
            color: "var(--color-text)",
            marginBottom: "1.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {hobby.description}
        </p>
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
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: "clamp(4rem, 8vh, 6rem)",
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "clamp(1.2rem, 3vw, 2rem) var(--page-px)",
            pointerEvents: "none",
          }}
        >
          <div>
            <p
              className="f-mono uppercase tracking-widest text-2xs"
              style={{
                opacity: 0.35,
                color: "var(--color-text)",
              }}
            >
              beyond the screen
            </p>
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
            paddingTop: "clamp(5rem, 12vh, 8rem)",
            paddingBottom: "clamp(2rem, 4vh, 4rem)",
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
              smoothNegX={smoothNegX}
            />
          ))}
          <EndHobbyCard smoothNegX={smoothNegX} />
        </motion.div>

      </div>
    </section>
  );
}
