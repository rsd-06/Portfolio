// src/lib/scrollLock.ts
// Page scroll locking that actually works under Lenis.
//
// Setting `document.body.style.overflow = "hidden"` alone does nothing here:
// Lenis drives the window with its own RAF loop and keeps scrolling regardless.
// A correct lock has to stop Lenis too.
//
// The depth counter is not incidental. Overlapping locks (a lightbox opened from
// inside an already-locked overlay) would otherwise have the inner unmount call
// lenis.start() while the outer lock is still open, silently unlocking the page.

import type Lenis from "lenis";

let instance: Lenis | null = null;
let depth = 0;
let previousOverflow = "";

/** Called by LenisProvider so the lock can reach the live instance. */
export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function lockScroll() {
  depth += 1;
  if (depth > 1) return; // already locked by an outer caller

  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  instance?.stop();

  if (process.env.NODE_ENV !== "production" && depth > 2) {
    console.warn(
      `[scrollLock] nesting depth ${depth} — check for a missing unlock.`
    );
  }
}

export function unlockScroll() {
  depth -= 1;
  if (depth > 0) return; // an outer caller still holds the lock
  depth = 0;

  document.body.style.overflow = previousOverflow;
  // start() internally calls reset(), re-syncing Lenis to the real window
  // position — which is what we want after the page may have shifted.
  instance?.start();
}
