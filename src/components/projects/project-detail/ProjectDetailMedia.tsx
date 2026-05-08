"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

const EXPO = [0.19, 1, 0.22, 1] as const;

/* ── Types ── */
interface Props {
  images: string[];
  video?: string;
}

/* ── Image Lightbox ── */
function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
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
          // Disable right-click save / drag
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
        }}
      >
        ✕ close
      </button>
    </motion.div>
  );
}

/* ── Video Player ── */
function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [enlarged, setEnlarged] = useState(false);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const rewind = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, v.currentTime - 10);
  }, []);

  useEffect(() => {
    if (enlarged) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [enlarged]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && enlarged) setEnlarged(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enlarged]);

  const ControlBtn = ({
    onClick,
    label,
    children,
  }: {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={label}
      style={{
        background: "rgba(0,0,0,0.45)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.85)",
        borderRadius: "6px",
        padding: "5px 10px",
        fontSize: "11px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backdropFilter: "blur(8px)",
        letterSpacing: "0.04em",
        fontFamily: "var(--font-mono, monospace)",
        transition: "background 0.2s",
      }}
    >
      {children}
    </button>
  );

  const videoEl = (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      onContextMenu={(e) => e.preventDefault()}
    />
  );

  const controls = (
    <div
      style={{
        position: "absolute",
        bottom: "clamp(0.75rem, 2vw, 1.25rem)",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "8px",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <ControlBtn onClick={rewind} label="Rewind 10s">⟪ 10s</ControlBtn>
      <ControlBtn onClick={togglePlay} label={playing ? "Pause" : "Play"}>
        {playing ? "⏸ Pause" : "▶ Play"}
      </ControlBtn>
      <ControlBtn onClick={toggleMute} label={muted ? "Unmute" : "Mute"}>
        {muted ? "🔇 Unmute" : "🔊 Mute"}
      </ControlBtn>
      <ControlBtn onClick={() => setEnlarged(true)} label="Enlarge video">⤢ Enlarge</ControlBtn>
    </div>
  );

  return (
    <>
      {/* Inline video */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#0a0a0a", borderRadius: "10px", overflow: "hidden" }}>
        {videoEl}
        {controls}
      </div>

      {/* Enlarged lightbox */}
      <AnimatePresence>
        {enlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setEnlarged(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              backgroundColor: "rgba(8,8,8,0.85)",
              backdropFilter: "blur(18px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.45, ease: EXPO }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "1100px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
                aspectRatio: "16/9",
                background: "#0a0a0a",
              }}
            >
              <video
                src={src}
                poster={poster}
                autoPlay
                loop
                playsInline
                muted={muted}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onContextMenu={(e) => e.preventDefault()}
              />
              {/* Lightbox controls */}
              <div style={{ position: "absolute", bottom: "1.25rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
                <ControlBtn onClick={rewind} label="Rewind 10s">⟪ 10s</ControlBtn>
                <ControlBtn onClick={togglePlay} label={playing ? "Pause" : "Play"}>
                  {playing ? "⏸ Pause" : "▶ Play"}
                </ControlBtn>
                <ControlBtn onClick={toggleMute} label={muted ? "Unmute" : "Mute"}>
                  {muted ? "🔇 Unmute" : "🔊 Mute"}
                </ControlBtn>
                <ControlBtn onClick={() => setEnlarged(false)} label="Close">✕ Close</ControlBtn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Main Component ── */
export default function ProjectDetailMedia({ images, video }: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(1.25rem, 2.5vw, 2rem)",
          padding: "clamp(1.5rem, 3vw, 2.5rem)",
          paddingTop: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        {/* Video first if it exists */}
        {video && (
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                opacity: 0.35,
                marginBottom: "0.75rem",
                color: "var(--color-text)",
              }}
            >
              Demo
            </p>
            <VideoPlayer src={video} poster={images[0]} />
          </div>
        )}

        {/* Images grid */}
        {images.length > 0 && (
          <div>
            {images.length > 1 && (
              <p
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.35,
                  marginBottom: "0.75rem",
                  color: "var(--color-text)",
                }}
              >
                Screenshots — {images.length} images
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: images.length === 1 ? "1fr" : "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                gap: "clamp(0.75rem, 1.5vw, 1.25rem)",
              }}
            >
              {images.map((src, i) => (
                <motion.div
                  key={src}
                  whileHover={{ scale: 1.025 }}
                  transition={{ duration: 0.35, ease: EXPO }}
                  onClick={() => setLightbox({ src, alt: `Screenshot ${i + 1}` })}
                  style={{
                    cursor: "zoom-in",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    background: "var(--color-bg)",
                    position: "relative",
                  }}
                >
                  <img
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      userSelect: "none",
                    }}
                  />
                  {/* Zoom hint on first image */}
                  {i === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        fontFamily: "var(--font-mono, monospace)",
                        pointerEvents: "none",
                      }}
                    >
                      ⤢ click to expand
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox portal */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            src={lightbox.src}
            alt={lightbox.alt}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
