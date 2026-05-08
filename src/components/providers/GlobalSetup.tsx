// src/components/providers/GlobalSetup.tsx
// Handles global once-per-session concerns:
// 1. Context-menu / drag protection for all images
"use client";

import { useEffect } from "react";

export default function GlobalSetup() {
  useEffect(() => {
    // ── Problem 3: Disable image right-click & drag globally ──
    function blockContextMenu(e: MouseEvent) {
      if (
        e.target instanceof HTMLImageElement ||
        e.target instanceof HTMLCanvasElement ||
        (e.target instanceof HTMLElement && e.target.tagName === "VIDEO")
      ) {
        e.preventDefault();
      }
    }

    function blockDragStart(e: DragEvent) {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    }

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockDragStart);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDragStart);
    };
  }, []);

  return null;
}
