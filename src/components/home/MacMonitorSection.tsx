"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

// ─── Screen-hole calibration ──────────────────────────────────────────────────
// Both PNGs are 1:1 square canvases.
// Values are % of the TOTAL square image dimensions.
const MACBOOK = {
  top: "22.5%",    // pushed down: video was leaking above the top bezel
  left: "10%",
  width: "80%",
  height: "51.5%",
  borderRadius: "0.7%",
  imageAspect: "1 / 1" as const,
};

const IPHONE = {
  top: "10%",
  left: "31.5%",
  width: "37%",
  height: "80%",
  borderRadius: "5%",
  imageAspect: "1 / 1" as const,
};
// ─────────────────────────────────────────────────────────────────────────────

// Video sources in priority order (WebM is ~60% smaller, MP4 as fallback)
const VIDEO_SRC_WEBM = "/heroVideo.webm";
const VIDEO_SRC_MP4  = "/heroVideo.mp4";

const VIDEO_SRC_MOBILE_WEBM = "/heroVideoMobile.webm";
const VIDEO_SRC_MOBILE_MP4  = "/heroVideoMobile.mp4";

export default function MacMonitorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  // ─── Smart lazy video loading ────────────────────────────────────────────
  // The video src is withheld until the loader fires `rsd:loaderDone`.
  // This means the browser won't touch the 64 MB file during the loader phase.
  // Once the event fires (~1.5 s in), the src is set immediately with
  // preload="auto" so the browser aggressively buffers it in the background —
  // well before the user scrolls down to this section.
  const [videoSrcReady, setVideoSrcReady] = useState(false);
  useEffect(() => {
    // If the loader has already run (SPA navigation back to home), set src now.
    if ((window as Window & { __rsd_loaderDone?: boolean }).__rsd_loaderDone) {
      setVideoSrcReady(true);
      return;
    }
    const onLoaderDone = () => {
      (window as Window & { __rsd_loaderDone?: boolean }).__rsd_loaderDone = true;
      setVideoSrcReady(true);
    };
    window.addEventListener("rsd:loaderDone", onLoaderDone, { once: true });
    return () => window.removeEventListener("rsd:loaderDone", onLoaderDone);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // All state declared together — hooks must be in consistent order
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Exact scale needed to fill the viewport with the video screen hole.
  // Computed from actual viewport + container dimensions on mount/resize.
  const [maxScaleDesktop, setMaxScaleDesktop] = useState(4.5);
  const [maxScaleMobile, setMaxScaleMobile] = useState(5.5);

  useEffect(() => {
    const recalc = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // ── Desktop: fills viewport WIDTH ─────────────────────────────────
      // Container = min(68vw, 860px). Screen hole = 80% of container width.
      const cW_d = Math.min(window.innerWidth * 0.68, 860);
      const sW_d = cW_d * 0.80;
      setMaxScaleDesktop((window.innerWidth / sW_d) * 1.02); // 2% buffer

      // ── Mobile: fills viewport HEIGHT (portrait phone) ────────────────
      // Container is square: min(96vw, no-cap). Screen height = 80% of that.
      // We zoom until the screen height equals 100dvh.
      const cS_m  = window.innerWidth * 1.5; // 150vw square — phone body appears large
      const sH_m  = cS_m * 0.80;
      const vh    = window.innerHeight;
      const sW_m  = cS_m * 0.37;
      const scaleH = (vh / sH_m) * 1.8;  // Increased buffer to massively push corners and notch off-screen
      const scaleW = (window.innerWidth / sW_m) * 1.8;
      setMaxScaleMobile(Math.max(scaleH, scaleW));
    };

    recalc();
    setMounted(true);
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  // ─── Scale: zoom until the screen-hole FILLS the viewport ───────────────
  // Use a longer scroll range [0, 0.75] so the zoom feels deliberate.
  // The spring stiffness/damping means the value lags slightly behind the
  // scroll position — the wider range ensures it reaches the target.
  const scaleDesktop = useTransform(scrollYProgress, [0, 0.55], [1, maxScaleDesktop]);
  const scaleMobile  = useTransform(scrollYProgress, [0, 0.55], [1, maxScaleMobile]);
  const activeScale  = isMobile ? scaleMobile : scaleDesktop;

  // High stiffness = spring tracks the target almost instantly, no lag
  const smoothScale = useSpring(activeScale, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  // PNG frame (notch) fades out EARLIER — before the scale is fully done.
  // This hides the notch/corners before the fullscreen video takes over.
  const imgOpacity             = useTransform(scrollYProgress, [0.46, 0.60], [1, 0]);
  // Background NEVER goes dark until the fullscreen video is fully opaque
  // and there is zero reason to see the bg colour anymore
  const bgColor = useTransform(
    scrollYProgress,
    [0.88, 1.0],
    ["var(--bg-base)", "#000000"]
  );
  // ─── Scroll hint visibility (merged into single event handler) ──────────
  const [scrolled, setScrolled] = useState(false);

  // ─── Volume ramp + scroll hint ───────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const vol = Math.min(1, latest / 0.60);
    if (videoRef.current) videoRef.current.volume = vol;
    setScrolled(latest > 0.06);
  });

  // ─── Derived device values (safe: defaults to MacBook on SSR) ───────────
  const device    = mounted && isMobile ? IPHONE   : MACBOOK;
  const mockupSrc = mounted && isMobile ? "/assets/homePageImages/iPhone14.png" : "/assets/homePageImages/macbook.png";

  return (
    <section
      ref={sectionRef}
      style={{ height: "300vh" }}
      className="relative w-full"
    >
      <motion.div
        className="sticky top-0 w-full"
        style={{
          height: "100dvh",
          backgroundColor: bgColor,
          overflow: "hidden",
        }}
      >
        {/* ── Mockup + video ───────────────────────────────────────────── */}
        {/* paddingTop creates gap between PreHeroSection image and mockup */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            paddingTop: mounted && isMobile ? "0vh" : "20vh",
          }}
        >
          <motion.div
            style={{
              scale: smoothScale,
              transformOrigin: "center center",
            }}
          >
            <div
              className="relative"
              style={mounted && isMobile
                ? {
                    // 150vw square — phone body fills ~70% of viewport width
                    // Parent overflow:hidden clips the 25vw overhang each side
                    width: "150vw",
                    height: "150vw",
                  }
                : {
                    width: "clamp(300px, 68vw, 860px)",
                    aspectRatio: device.imageAspect,
                  }
              }
            >
              {/* Screen-hole: video BEHIND the PNG frame (z-0) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  zIndex: 0,
                  top: device.top,
                  left: device.left,
                  width: device.width,
                  height: device.height,
                  borderRadius: device.borderRadius,
                  background: "#000",
                }}
              >
                {/* Video — src set lazily after rsd:loaderDone so the 64 MB file
                    doesn't block the loader phase. preload=auto ensures aggressive
                    buffering starts as soon as the src is set. */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={videoSrcReady ? "auto" : "none"}
                  suppressHydrationWarning
                  className="w-full h-full object-cover"
                  aria-label="Portfolio reel video"
                >
                  {videoSrcReady && (
                    <>
                      {/* WebM is served first — ~60% smaller than MP4 on Chrome/Firefox */}
                      <source src={mounted && isMobile ? VIDEO_SRC_MOBILE_WEBM : VIDEO_SRC_WEBM} type="video/webm" />
                      <source src={mounted && isMobile ? VIDEO_SRC_MOBILE_MP4 : VIDEO_SRC_MP4}  type="video/mp4" />
                    </>
                  )}
                </video>
              </div>

              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  pointerEvents: "none",
                  userSelect: "none",
                  opacity: imgOpacity,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mockupSrc}
                  alt={mounted && isMobile ? "iPhone 14 frame" : "MacBook Pro frame"}
                  draggable={false}
                  fetchPriority="low"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll Hint ─────────────────────────────────────────────────── */}
        {/* Single element owns both entry (delayed fade-up) and scroll-exit.
            z-20 lifts it above the MacBook's transform stacking context. */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? 4 : 0 }}
          transition={scrolled
            ? { duration: 0.35, ease: "easeOut" }
            : { delay: 1.2, duration: 0.9, ease: [0.19, 1, 0.22, 1] }
          }
        >
          {/* Desktop */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <span className="f-mono text-xs uppercase tracking-[0.25em] text-black/40 select-none">
              [ scroll to explore ]
            </span>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="text-black/30">
              <path d="M5 0v12M1 8l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Mobile / Tablet */}
          <div className="flex md:hidden flex-col items-center gap-1">
            <span className="f-mono text-[10px] uppercase tracking-[0.2em] text-black/35 select-none">
              Scroll
            </span>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="text-black/30">
              <path d="M5 0v12M1 8l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
