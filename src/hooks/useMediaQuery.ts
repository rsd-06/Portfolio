"use client";

import { useCallback, useSyncExternalStore } from "react";
import { up, below, type Breakpoint } from "@/lib/breakpoints";

/**
 * Tracks a CSS media query.
 *
 * Built on useSyncExternalStore rather than useState + useEffect for two reasons:
 *
 *  1. The previous implementation initialised to `false`, so the first client
 *     render always claimed "no match" regardless of the real viewport, then
 *     corrected itself a frame later. Here `getServerSnapshot` supplies the SSR
 *     value and the first *post-hydration* render already has the truth.
 *  2. It had `matches` in its effect dependencies, so every match flip tore down
 *     and re-created the matchMedia listener.
 *
 * @param query  A media query string, e.g. "(min-width: 768px)".
 * @param serverValue  What to report during SSR and the hydration render.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

/** Matches at or above a named breakpoint. */
export const useBreakpointUp = (b: Breakpoint, serverValue = false) =>
  useMediaQuery(up(b), serverValue);

/** Matches strictly below a named breakpoint. */
export const useBreakpointDown = (b: Breakpoint, serverValue = false) =>
  useMediaQuery(below(b), serverValue);

/** Below 768px. Server-renders as `false` so SSR assumes the desktop layout. */
export const useIsMobile = () => useMediaQuery(below("md"));

/** At or above 1024px. */
export const useIsDesktop = () => useMediaQuery(up("lg"));

/** Touch / stylus primary input — use to gate hover-only affordances. */
export const useIsTouch = () => useMediaQuery("(pointer: coarse)");

/** Honour the OS "reduce motion" setting. */
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
