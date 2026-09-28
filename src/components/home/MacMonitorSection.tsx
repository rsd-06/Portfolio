"use client";

import { useRef, useEffect, useState } from "react";
import HeroVideo from "@/components/home/HeroVideo";
import { useIsMobile } from "@/hooks/useMediaQuery";
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

// The desktop mockup's width. Declared once because BOTH the CSS below and the
// zoom maths need it — they were previously written out separately and had to be
// kept in sync by hand.
const DESKTOP_BOX = { min: 300, vw: 0.68, max: 860 };
const DESKTOP_BOX_CSS = `clamp(${DESKTOP_BOX.min}px, ${DESKTOP_BOX.vw * 100}vw, ${DESKTOP_BOX.max}px)`;

// The phone mockup rests at 150vw square, so a quarter of it overhangs each side
// and is clipped by the parent's overflow:hidden. Intentional — it makes the
// device read as large before the zoom starts.
const MOBILE_REST_SIDE = 1.5;

// Screen-hole proportions within the phone mockup (fractions of the square).
const MOBILE_HOLE_W = 0.37;
const MOBILE_HOLE_H = 0.80;

// Small overshoot so rounding never leaves a sliver of background at full zoom.
const FILL_BUFFER = 1.06;

const IPHONE = {
  top: "10%",
  left: "31.5%",
  width: "37%",
  height: "80%",
  borderRadius: "5%",
  imageAspect: "1 / 1" as const,
};
// ─────────────────────────────────────────────────────────────────────────────

export default function MacMonitorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // ─── Smart lazy video loading ────────────────────────────────────────────
  // The video src is withheld until the loader fires `rsd:loaderDone`.
  // This keeps the reel (~2 MB mobile / ~8 MB desktop) from competing with the
  // loader phase.
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
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  // Exact scale needed to fill the viewport with the video screen hole.
  // Computed from actual viewport + container dimensions on mount/resize.
  const [maxScaleDesktop, setMaxScaleDesktop] = useState(4.5);
  const [maxScaleMobile, setMaxScaleMobile] = useState(5.5);

  useEffect(() => {
    const recalc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // ── Desktop: the screen hole must cover the viewport WIDTH ────────
      // Mirrors DESKTOP_BOX_CSS exactly, including the clamp — the previous
      // version used a bare Math.min, so below ~441px it underestimated the
      // container and overestimated the scale needed.
      const boxW = Math.min(Math.max(vw * DESKTOP_BOX.vw, DESKTOP_BOX.min), DESKTOP_BOX.max);
      setMaxScaleDesktop((vw / (boxW * 0.8)) * FILL_BUFFER);

      // ── Mobile: the hole must cover BOTH axes ─────────────────────────
      // Derived from the requirement rather than the hand-tuned 1.8x that used
      // to sit here; hiding the notch is imgOpacity's job, not the scale's.
      const side = vw * MOBILE_REST_SIDE;
      setMaxScaleMobile(
        Math.max(vw / (side * MOBILE_HOLE_W), vh / (side * MOBILE_HOLE_H)) * FILL_BUFFER
      );
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
  const imgOpacity             = useTransform(scrollYProgress, [0.42, 0.52], [1, 0]);
  // Background NEVER goes dark until the fullscreen video is fully opaque
  // and there is zero reason to see the bg colour anymore
  const bgColor = useTransform(
    scrollYProgress,
    [0.88, 1.0],
    ["var(--bg-base)", "#000000"]
  );
  // ─── Scroll hint visibility (merged into single event handler) ──────────
  const [scrolled, setScrolled] = useState(false);

  // ─── Scroll hint ─────────────────────────────────────────────────────────
  // (There was a volume ramp here. It wrote videoRef.current.volume on an
  //  element that is permanently muted, and the source has no audio track.)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrolled(latest > 0.06);
  });

  // ─── Derived device values (safe: defaults to MacBook on SSR) ───────────
  const device    = mounted && isMobile ? IPHONE   : MACBOOK;
  const mockupSrc = mounted && isMobile ? "/assets/homePageImages/iPhone14.png" : "/assets/homePageImages/macbook.png";

  return (
    <section
      ref={sectionRef}
      style={{ height: "300svh" }}
      className="relative w-full"
    >
      <motion.div
        className="sticky top-0 w-full"
        style={{
          height: "100svh",
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
                    width: DESKTOP_BOX_CSS,
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
                {/* Device selection, poster, reduced-motion and load-failure
                    handling all live in HeroVideo. */}
                <HeroVideo ready={videoSrcReady} />
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
          className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 z-20 flex flex-col items-center md:items-end pointer-events-none"
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
