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

const VIDEO_SRC = "/assets/heroVideo.mp4";

export default function MacMonitorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

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
      const scaleH = (vh / sH_m) * 1.35;  // 35% buffer — corners pushed well off-screen
      const scaleW = (window.innerWidth / sW_m) * 1.35;
      setMaxScaleMobile(Math.min(scaleH, scaleW));
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

  // Frame starts fading AFTER scale has already completed (scroll > 0.55)
  const frameOpacity           = useTransform(scrollYProgress, [0.58, 0.80], [1, 0]);
  // PNG frame (notch) fades out EARLIER — before the scale is fully done.
  // This hides the notch/corners before the fullscreen video takes over.
  const imgOpacity             = useTransform(scrollYProgress, [0.46, 0.60], [1, 0]);
  const fullscreenVideoOpacity = useTransform(scrollYProgress, [0.68, 0.88], [0, 1]);
  // Background NEVER goes dark until the fullscreen video is fully opaque
  // and there is zero reason to see the bg colour anymore
  const bgColor = useTransform(
    scrollYProgress,
    [0.88, 1.0],
    ["var(--bg-base)", "#000000"]
  );
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);

  // ─── Volume ramp ────────────────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const vol = Math.min(1, latest / 0.60);
    if (videoRef.current) videoRef.current.volume = vol;
    if (fullscreenVideoRef.current) fullscreenVideoRef.current.volume = vol;

    // Keep fullscreen video in sync with in-mockup video for seamless crossfade
    if (latest >= 0.58 && fullscreenVideoRef.current && videoRef.current) {
      const diff = Math.abs(
        fullscreenVideoRef.current.currentTime - videoRef.current.currentTime
      );
      if (diff > 0.15) {
        fullscreenVideoRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  });

  // ─── Derived device values (safe: defaults to MacBook on SSR) ───────────
  const device    = mounted && isMobile ? IPHONE   : MACBOOK;
  const mockupSrc = mounted && isMobile ? "/assets/iPhone14.png" : "/assets/macbook.png";

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
              opacity: frameOpacity,
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
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  autoPlay
                  muted
                  loop
                  playsInline
                  suppressHydrationWarning
                  className="w-full h-full object-cover"
                  aria-label="Portfolio reel video"
                />
              </div>

              {/* Device frame PNG ON TOP of the video (z-10) */}
              {/* No drop-shadow: at high scale a blur filter blooms into dark side bars */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mockupSrc}
                alt={mounted && isMobile ? "iPhone 14 frame" : "MacBook Pro frame"}
                draggable={false}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  zIndex: 10,
                  pointerEvents: "none",
                  userSelect: "none",
                  opacity: imgOpacity as unknown as number,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Fullscreen video handoff ─────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: fullscreenVideoOpacity, zIndex: 20 }}
          aria-hidden="true"
        >
          <video
            ref={fullscreenVideoRef}
            src={VIDEO_SRC}
            autoPlay
            loop
            playsInline
            muted={false}
            suppressHydrationWarning
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* ── Scroll hint ──────────────────────────────────────────────── */}
        <motion.div
          className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: scrollHintOpacity, zIndex: 30 }}
          aria-hidden="true"
        >
          scroll ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
