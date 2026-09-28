// src/components/providers/LenisProvider.tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scrollLock";

// ── Context so child components can access Lenis instance ──────
const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

// ── Provider ───────────────────────────────────────────────────
export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef   = useRef<number>(0);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Honour the OS "reduce motion" setting by not smooth-scrolling at all.
    // Every consumer is already null-safe (`lenis?.stop()` / `if (lenis)`), and
    // the scroll-pinned sections read window scroll directly, so they still work.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Init Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // Kills wheel momentum the moment an internal link is clicked. Without
      // this, Lenis keeps writing its stale animatedScroll back to the window
      // across the navigation, so the next page paints already scrolled.
      stopInertiaOnNavigate: true,
      // On touch devices, use native scroll for better feel
      // touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    // So scroll locks can stop/start the live instance (see lib/scrollLock).
    registerLenis(lenis);
    // Debug handle for verifying scroll behaviour from the console.
    (window as Window & { __rsd_lenis?: Lenis }).__rsd_lenis = lenis;

    // RAF loop
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Expose scroll progress on CSS var for JS consumption
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(progress)
      );
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      registerLenis(null);
      delete (window as Window & { __rsd_lenis?: Lenis }).__rsd_lenis;
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
