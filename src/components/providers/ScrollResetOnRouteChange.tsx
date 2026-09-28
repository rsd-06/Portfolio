"use client";

// src/components/providers/ScrollResetOnRouteChange.tsx
//
// Fixes: scroll down /projects, click a project card, and the detail page paints
// already scrolled down.
//
// Cause: one Lenis instance drives the window for the whole app lifetime. While
// its wheel-momentum animation is still running, it keeps writing its own
// animatedScroll back to the window every frame — including straight over the
// scroll reset the router performs during navigation.
//
// `stopInertiaOnNavigate` in LenisProvider handles the momentum at click time.
// This component covers the rest: it re-measures after the new route has laid
// out (Lenis caches the scroll limit and debounces its own resize by 250ms, so
// after navigating to a page of a different height the limit is stale) and
// forces the position to the top.
//
// This is a separate component rather than an effect inside LenisProvider on
// purpose: usePathname() in the provider would re-render the entire children
// tree on every navigation.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/providers/LenisProvider";

type ScrollWindow = Window & { __rsd_restoreScrollY?: number };

export default function ScrollResetOnRouteChange() {
  const pathname = usePathname();
  const lenis = useLenis();
  const wasPopRef = useRef(false);

  // Distinguish a back/forward navigation from a fresh one. usePathname() alone
  // cannot tell them apart, and forcing the top on a pop would break every back
  // navigation — trading one scroll bug for another.
  useEffect(() => {
    const onPop = () => { wasPopRef.current = true; };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!lenis) return; // reduced motion: no Lenis, native scroll is correct

    const wasPop = wasPopRef.current;
    wasPopRef.current = false;

    // The home page owns its own restore sequence (LoaderScreen consumes this
    // flag), so stay out of its way.
    if ((window as ScrollWindow).__rsd_restoreScrollY !== undefined) return;

    // One frame later: when this effect runs the new route's DOM is not laid out
    // yet, so resize() would measure the outgoing page.
    const frame = requestAnimationFrame(() => {
      lenis.resize();

      if (wasPop) {
        // The browser restored a position. Don't override it — just re-sync
        // Lenis to it, which cures the same staleness.
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        return;
      }

      // Order matters. `force` bypasses the isStopped/isLocked guard and
      // `immediate` writes animatedScroll = targetScroll = 0 in the same tick.
      // start() internally calls reset(), re-syncing to actualScroll — now 0, so
      // the bracket reinforces the jump instead of fighting it. Calling start()
      // *before* scrollTo would snap back to the stale window value.
      lenis.stop();
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
    });

    // Safety net for content that sizes itself after hydration (scroll-pinned
    // sections measuring scrollWidth, etc.). Undercuts Lenis's own 250ms debounce.
    const late = setTimeout(() => lenis.resize(), 300);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(late);
    };
  }, [pathname, lenis]);

  return null;
}
