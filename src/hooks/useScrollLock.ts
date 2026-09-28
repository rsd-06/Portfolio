"use client";

import { useEffect } from "react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

/**
 * Locks page scroll while `locked` is true, and releases it on unmount.
 * Safe to nest — see the depth counter in lib/scrollLock.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockScroll();
    return unlockScroll;
  }, [locked]);
}
