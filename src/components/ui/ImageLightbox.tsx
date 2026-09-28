"use client";

// src/components/ui/ImageLightbox.tsx
// Full-screen image viewer. Extracted from ProjectDetailMedia so the ProtoSem
// week Gallery can share it instead of growing a second copy.

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

const EXPO = [0.19, 1, 0.22, 1] as const;

export default function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  // Stops Lenis as well as the body — setting body overflow alone does nothing
  // while Lenis is driving the window.
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(10,10,10,0.82)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1.5rem, 4vw, 3rem)",
        cursor: "zoom-out",
      }}
      onClick={onClose}
    >
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.45, ease: EXPO }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          borderRadius: "10px",
          boxShadow: "0 32px 96px rgba(0,0,0,0.6)",
          userSelect: "none",
          pointerEvents: "auto",
        }}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* Close hint */}
      <button
        onClick={onClose}
        aria-label="Close image"
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vw, 2rem)",
          right: "clamp(1rem, 3vw, 2rem)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: "rgba(255,255,255,0.6)",
          borderRadius: "100px",
          padding: "6px 14px",
          fontSize: "11px",
          letterSpacing: "0.12em",
          cursor: "pointer",
          fontFamily: "var(--font-mono, monospace)",
          minHeight: "44px",
          minWidth: "44px",
        }}
      >
        ✕ close
      </button>
    </motion.div>
  );
}
