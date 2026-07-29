// src/components/home/LoaderScreen.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import { useLenis } from "@/components/providers/LenisProvider";
import Grainient from "@/components/Grainient";

// Module-level flag — survives SPA navigation, resets on hard reload.
let loaderHasRun = false;

type WindowWithScroll = Window & { __rsd_restoreScrollY?: number };

const MIN_MS = 1500; // minimum loader duration
const EASE = [0.19, 1, 0.22, 1] as const;

export default function LoaderScreen() {
  const { progress, ready } = useAssetLoader({
    images: ["/assets/hero.jpg"],
    videos: [],
  });
  const lenis = useLenis();

  const [shouldShow]   = useState(!loaderHasRun);
  const [exitStarted, setExitStarted] = useState(false);

  // phase: "center" → large number fills the screen; "expanded" → cross-fades to corner
  const [phase, setPhase] = useState<"center" | "expanded">("center");

  // Keep a ref so the RAF closure always reads the latest progress without stale closure issues
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  // displayCount lerps toward the real asset `progress` via RAF,
  // but is capped by a 2 s minimum so it never rushes.
  const displayCountRef = useRef(0);
  const [displayCount, setDisplayCount] = useState(0);
  const rafRef  = useRef<number | null>(null);
  const lastTime = useRef<number>(0);
  const elapsedAccum = useRef<number>(0);
  const exitTriggered = useRef(false);

  useEffect(() => {
    if (!shouldShow) return;
    lastTime.current = performance.now();
    elapsedAccum.current = 0;

    const tick = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      lastTime.current = now;

      // Cap delta at 100ms. If WebGL compiling blocks main thread for 1s, it only counts as 100ms!
      // This prevents the counter from jumping from 0 to 60 instantly.
      elapsedAccum.current += Math.min(delta, 100);

      const timeProg = Math.min(100, (elapsedAccum.current / MIN_MS) * 100);
      
      let target;
      if (progressRef.current === 100 && timeProg === 100) {
        target = 100;
        if (!exitTriggered.current) {
          exitTriggered.current = true;
          setTimeout(() => setExitStarted(true), 400);
        }
      } else {
        // Guarantee smooth counting up to 99% even if assets are pending
        target = Math.min(99, Math.max(timeProg, progressRef.current));
      }

      setDisplayCount(prev => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.3) return Math.round(target);
        return prev + diff * 0.08;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [shouldShow]);

  // Phase transition: large → corner at 30 %
  useEffect(() => {
    if (displayCount >= 30 && phase === "center") {
      setPhase("expanded");
    }
  }, [displayCount, phase]);

  // The exit trigger is now handled cleanly inside the RAF loop!

  // ── Lock scroll ──────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (shouldShow) {
      document.body.classList.add("is-loading");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.classList.remove("is-loading");
      document.body.style.overflow = "";
    };
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow) return;
    if (lenis && !exitStarted) lenis.stop();
  }, [lenis, exitStarted, shouldShow]);

  // ── Restore scroll ───────────────────────────────────────────────
  useEffect(() => {
    if (!lenis) return;
    const targetY = (window as WindowWithScroll).__rsd_restoreScrollY;
    if (targetY === undefined) return;
    delete (window as WindowWithScroll).__rsd_restoreScrollY;
    const t = setTimeout(() => {
      window.scrollTo(0, targetY);
      lenis.scrollTo(targetY, { immediate: true });
    }, 100);
    return () => clearTimeout(t);
  }, [lenis]);

  function handleExitComplete() {
    loaderHasRun = true;
    document.body.classList.remove("is-loading");
    document.body.style.overflow = "";
    const targetY = (window as WindowWithScroll).__rsd_restoreScrollY ?? 0;
    delete (window as WindowWithScroll).__rsd_restoreScrollY;
    window.scrollTo(0, targetY);
    if (lenis) {
      lenis.scrollTo(targetY, { immediate: true });
      lenis.start();
    }
  }

  const count = Math.round(displayCount);

  // Interpolate font size as count grows 0→30 (center phase)
  // Number: 4vw → 13vw, Brackets: 3vw → 10vw
  const sizeFraction = Math.min(count / 30, 1);
  const numVw        = (4 + sizeFraction * 9).toFixed(2);
  const bracketVw    = (3 + sizeFraction * 7).toFixed(2);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {shouldShow && !exitStarted && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col justify-between p-6 md:p-12"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, backgroundColor: "#F5F4F0", width: "100vw", height: "100vh" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: EASE }}
          aria-live="polite"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#F5F4F0] -z-20" />
          <div className="absolute inset-0 -z-10">
            <Grainient
              color1="#FBF9F6"
              color2="#EDE9E2"
              color3="#B19EEF"
              timeSpeed={0.15}
              colorBalance={0}
              warpStrength={1}
              warpFrequency={5}
              warpSpeed={1.5}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.08}
            />
          </div>


          {/* ── Top Bar ── fades in when phase = expanded */}
          <motion.div
            className="w-full flex justify-between items-start f-mono text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "expanded" ? 0.6 : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex flex-col">
              <span>Portfolio</span>
              <span>Building through Software</span>
            </div>
            <div className="hidden md:flex flex-col text-center">
              <span>Coimbatore</span>
              <span>India</span>
            </div>

            {/* ── Corner counter (small, top-right) — fades IN at expanded */}
            <motion.div
              className="flex flex-col items-end leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "expanded" ? 1 : 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span>Loading</span>
              <span className="font-bold tabular-nums">{count}%</span>
            </motion.div>
          </motion.div>

          {/* ── Large centered counter — fades OUT at expanded */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={false}
            animate={{ opacity: phase === "center" ? 1 : 0 }}
            transition={{ duration: phase === "center" ? 0 : 0.65, ease: EASE }}
          >
            <div className="flex items-center" style={{ gap: "0.3rem" }}>
              {/* Left bracket — slides left on exit */}
              <motion.span
                className="f-mono font-thin leading-none select-none"
                style={{ fontSize: `${bracketVw}vw` }}
                initial={false}
                animate={{ x: phase === "expanded" ? "-220px" : "0px", opacity: phase === "expanded" ? 0 : 0.45 }}
                transition={{ duration: phase === "expanded" ? 0.65 : 0, ease: EASE }}
              >
                [
              </motion.span>

              {/* The number */}
              <span
                className="f-mono font-bold tabular-nums leading-none"
                style={{ fontSize: `${numVw}vw` }}
              >
                {count}%
              </span>

              {/* Right bracket — slides right on exit */}
              <motion.span
                className="f-mono font-thin leading-none select-none"
                style={{ fontSize: `${bracketVw}vw` }}
                initial={false}
                animate={{ x: phase === "expanded" ? "220px" : "0px", opacity: phase === "expanded" ? 0 : 0.45 }}
                transition={{ duration: phase === "expanded" ? 0.65 : 0, ease: EASE }}
              >
                ]
              </motion.span>
            </div>
          </motion.div>

          {/* ── rsd.exe letters — staggered fade-in after expansion */}
          <div className="w-full flex justify-center items-center overflow-hidden">
            <div className="flex">
              {"rsd.exe".split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="f-display text-[28vw] md:text-[22vw] tracking-[-0.05em] font-black leading-none"
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    phase === "expanded"
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 50 }
                  }
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.8, ease: EASE }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* ── Bottom tagline — slides up after expansion */}
          <motion.div
            className="w-full text-center pb-8 f-mono text-sm italic max-w-lg mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={
              phase === "expanded"
                ? { opacity: 0.75, y: 0 }
                : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          >
            <p>
              Hello, I&apos;m Sudharshan,<br />
              A Software Enthusiast.
            </p>
          </motion.div>

          {/* Progress bar at the bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#11111122]">
            <div
              className="h-full bg-[#111111] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
