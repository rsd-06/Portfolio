// src/components/home/LoaderScreen.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import { useLenis } from "@/components/providers/LenisProvider";
import Grainient from "@/components/Grainient";
import CountUp from "@/components/CountUp";

// Module-level flag — survives SPA (Link) navigation but resets on hard reload.
// sessionStorage persists across reloads (wrong). localStorage persists forever (wrong).
// A module variable is in JS memory: gone on reload, alive across route changes. ✓
let loaderHasRun = false;

// Extend window type for temporary scroll restoration flag
type WindowWithScroll = Window & { __rsd_restoreScrollY?: number };

export default function LoaderScreen() {
  const { progress, ready } = useAssetLoader({
    images: ["/assets/hero.jpg"],
    videos: [],
  });
  const lenis = useLenis();

  // `shouldShow` gates whether the loader markup is in the DOM.
  // On first hard load, server = true, client = true (Hydration match!)
  // On SPA return to Home, client = false (Normal render, no hydration mismatch)
  const [shouldShow, setShouldShow] = useState(!loaderHasRun);
  const [exitStarted, setExitStarted] = useState(false);

  // ── 1. Synchronous check — runs before first paint ─────────────
  useLayoutEffect(() => {
    if (shouldShow) {
      // First visit or hard reload: lock scroll.
      document.body.classList.add("is-loading");
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.classList.remove("is-loading");
      document.body.style.overflow = "";
    };
  }, [shouldShow]);

  // ── 2. Freeze Lenis while the loader is visible ────────────────
  useEffect(() => {
    if (!shouldShow) return;
    if (lenis && !exitStarted) lenis.stop();
  }, [lenis, exitStarted, shouldShow]);

  // ── 3. Trigger exit once assets are ready ─────────────────────
  useEffect(() => {
    if (!shouldShow || !ready) return;
    const t = setTimeout(() => setExitStarted(true), 400);
    return () => clearTimeout(t);
  }, [ready, shouldShow]);

  // ── 4. Restore scroll on return visits once Lenis is ready ────
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

  // ── Called by AnimatePresence after exit animation completes ───
  function handleExitComplete() {
    loaderHasRun = true; // in-memory only — resets automatically on hard reload
    document.body.classList.remove("is-loading");
    document.body.style.overflow = "";

    // Restore any scroll position saved before first-ever load (edge case)
    const targetY = (window as WindowWithScroll).__rsd_restoreScrollY ?? 0;
    delete (window as WindowWithScroll).__rsd_restoreScrollY;

    window.scrollTo(0, targetY);
    if (lenis) {
      lenis.scrollTo(targetY, { immediate: true });
      lenis.start();
    }
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {shouldShow && !exitStarted && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col justify-between p-6 md:p-12"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          aria-live="polite"
        >
          {/* Base solid background */}
          <div className="absolute inset-0 bg-[#F5F4F0] -z-20" />

          {/* Animated Gradient */}
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

          {/* Top Bar */}
          <div className="w-full flex justify-between items-start f-mono text-xs opacity-60">
            <div className="flex flex-col">
              <span>Portfolio</span>
              <span>Building through SDE</span>
            </div>
            <div className="hidden md:flex flex-col text-center">
              <span>Coimbatore</span>
              <span>India</span>
            </div>
            <div className="flex flex-col text-right">
              <span>Loading</span>
              <div className="flex items-center justify-end font-bold">
                <CountUp from={0} to={100} duration={1.2} direction="up" separator="" className="" />
                <span>%</span>
              </div>
            </div>
          </div>

          {/* Middle — rsd.exe letters */}
          <div className="w-full flex justify-center items-center overflow-hidden">
            <div className="flex">
              {"rsd.exe".split("").map((char, index) => (
                <motion.span
                  key={index}
                  className="f-display text-[28vw] md:text-[22vw] tracking-[-0.05em] font-black leading-none"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.06, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="w-full text-center pb-8 f-mono text-sm opacity-80 italic max-w-lg mx-auto">
            <p>
              Hallo, amigos<br />
              I'm Sudharshan, a web developer and engineer.<br />
              Welcome to my portfolio!
            </p>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#11111122]">
            <div
              className="h-full bg-[#111111] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
