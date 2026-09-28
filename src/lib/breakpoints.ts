// src/lib/breakpoints.ts
// Single source of truth for viewport thresholds.
//
// These are Tailwind's stock values. That is deliberate: there is no Tailwind
// config file in this project (v4, CSS-first), so the stock breakpoints are what
// the `md:` / `lg:` utilities actually compile to, and every hand-written media
// query in globals.css already uses 768px. Codifying them here lets JS agree with
// CSS instead of scattering `window.innerWidth < 768` literals across components.

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Matches at or above a breakpoint — the equivalent of Tailwind's `md:` etc. */
export const up = (b: Breakpoint) => `(min-width: ${BREAKPOINTS[b]}px)`;

/**
 * Matches strictly below a breakpoint.
 *
 * The 0.02px step matters: a naive `max-width: 767px` leaves a dead zone at
 * fractional viewport widths (browser zoom, some devices) where neither the
 * `md:` utility nor a JS `< 768` check is true, so layout falls between stools.
 */
export const below = (b: Breakpoint) =>
  `(max-width: ${BREAKPOINTS[b] - 0.02}px)`;
