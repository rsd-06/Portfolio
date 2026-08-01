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

const MIN_MS = 1500; // minimum loader duration — preserves the rsd.exe animation
const EASE = [0.19, 1, 0.22, 1] as const;

export default function LoaderScreen() {
  const { progress, ready } = useAssetLoader({
    images: ["/assets/hero.jpg"],
    videos: [], // videos are no longer blocking — they load after loaderDone
  });

  const lenis = useLenis();

  const [shouldShow]   = useState(!loaderHasRun);
  const [exitStarted, setExitStarted] = useState(false);
  // phase: "counting" (growing number) → "complete" (rsd.exe text)
  const [phase, setPhase] = useState<"counting" | "complete">("counting");

  // Keep a ref so the RAF closure always reads the latest progress without stale closure issues
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  // displayCount lerps toward the real asset `progress` via RAF,
  // but is capped by a 2 s minimum so it never rushes.
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
          setPhase("complete");
          // Hold on the rsd.exe logo for 1.2s before exiting
          setTimeout(() => setExitStarted(true), 1200);
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
    // Signal all lazy components (especially MacMonitorSection) that the
    // loader is done so they can begin fetching their heavy assets now.
    window.dispatchEvent(new CustomEvent("rsd:loaderDone"));
  }

  const count = Math.round(displayCount);

  // Interpolate font size as count grows 0→100
  // Number: 4vw → 13vw, Brackets: 3vw → 10vw
  const sizeFraction = Math.min(count / 100, 1);
  const numVw        = (4 + sizeFraction * 9).toFixed(2);
  const bracketVw    = (3 + sizeFraction * 7).toFixed(2);

  // Top bar fades in early
  const showTopBar = count > 10;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {shouldShow && !exitStarted && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col justify-between p-6 md:p-12"
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 999, backgroundColor: "#F5F4F0",
            width: "100vw", height: "100vh",
            // GPU-composited exit — prevents main-thread jank during the clip-path animation
            willChange: "clip-path",
          }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: EASE }}
          aria-live="polite"
        >
          {/* Background — solid fallback shown instantly */}
          <div className="absolute inset-0 bg-[#F5F4F0] -z-20" />
          {/* Grainient */}
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

          {/* ── Top Bar ── fades in when count > 10 */}
          <motion.div
            className="w-full flex justify-between items-start f-mono text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: showTopBar ? 0.6 : 0 }}
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

            {/* ── Corner counter (small, top-right) */}
            <div className="flex flex-col items-end leading-tight">
              <span>Loading</span>
              <span className="font-bold tabular-nums">{count}%</span>
            </div>
          </motion.div>

          {/* ── Center Content: Counter OR Logo ── */}
          <div className="w-full flex flex-1 items-center justify-center pointer-events-none">
            {phase === "counting" ? (
              <div className="flex items-center" style={{ gap: "0.3rem" }}>
                <span
                  className="f-mono font-thin leading-none select-none"
                  style={{ fontSize: `${bracketVw}vw`, opacity: 0.45 }}
                >
                  [
                </span>
                <span
                  className="f-mono font-bold tabular-nums leading-none text-[#111111]"
                  style={{ fontSize: `${numVw}vw` }}
                >
                  {count}%
                </span>
                <span
                  className="f-mono font-thin leading-none select-none"
                  style={{ fontSize: `${bracketVw}vw`, opacity: 0.45 }}
                >
                  ]
                </span>
              </div>
            ) : (
              <div className="flex text-[#111111]">
                {"rsd.exe".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="f-display text-[28vw] md:text-[22vw] tracking-[-0.05em] font-black leading-none"
                    initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* ── Bottom tagline — fades in at the end ── */}
          <motion.div
            className="w-full text-center pb-8 f-mono text-sm italic max-w-lg mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={
              phase === "complete"
                ? { opacity: 0.75, y: 0 }
                : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          >
            <p>
              Hello, I&apos;m Sudharshan,<br />
              A Software Enthusiast.
            </p>
          </motion.div>

          {/* Progress bar at the bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#11111122]">
            <div
              className="h-full bg-[#111111] transition-all duration-75 ease-linear"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
