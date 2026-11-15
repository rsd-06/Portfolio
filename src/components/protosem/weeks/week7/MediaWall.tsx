"use client";

// src/components/protosem/weeks/week7/MediaWall.tsx
// Week 7 only: a tidy grid for photos, screenshots, demo clips and short notes.
// Every tile in a wall shares one frame size, so mixed media (portrait phone
// clips, landscape photos, screenshots) line up instead of stacking at their own
// sizes. Media is fitted whole ("contain") over a blurred copy of itself, so
// nothing is cropped and there are no empty bars. Clips play muted and looping
// while they are on screen and pause when scrolled away.

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";

export type Tile =
  | {
      kind: "image";
      src: string;
      alt: string;
      label?: string;
      caption?: ReactNode;
      aspect?: string;
      /** "cover" for photos that should fill the frame; default "contain". */
      fit?: "contain" | "cover";
    }
  | {
      kind: "video";
      src: string;
      poster: string;
      alt: string;
      label?: string;
      caption?: ReactNode;
      aspect?: string;
    }
  | {
      kind: "note";
      eyebrow: string;
      title?: string;
      body: ReactNode;
      aspect?: string;
    };

const FRAME_BORDER = "1px solid var(--border-subtle)";

function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      className="f-mono absolute left-3 top-3 z-10 rounded-full px-2.5 py-1"
      style={{
        fontSize: "var(--text-2xs)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#fff",
        background: "rgba(14,14,18,0.62)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {children}
    </span>
  );
}

/** Blurred copy of the media, so a contained image/clip never leaves empty bars. */
function Backdrop({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      fill
      sizes="120px"
      style={{ objectFit: "cover", filter: "blur(22px) saturate(1.1)", transform: "scale(1.2)", opacity: 0.6 }}
    />
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid place-items-center rounded-full"
      style={{
        width: 40,
        height: 40,
        color: "#fff",
        background: "rgba(14,14,18,0.62)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {children}
    </button>
  );
}

function Clip({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <>
      <Backdrop src={poster} />
      <video
        ref={ref}
        suppressHydrationWarning
        src={src}
        poster={poster}
        aria-label={alt}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={toggle}
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "contain", cursor: "pointer" }}
      />
      <div className="absolute bottom-3 right-3 z-10 flex gap-2">
        <IconBtn label={playing ? "Pause clip" : "Play clip"} onClick={toggle}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </IconBtn>
        <IconBtn label={muted ? "Turn sound on" : "Mute clip"} onClick={() => setMuted((m) => !m)}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </IconBtn>
        <IconBtn label="Full screen" onClick={() => ref.current?.requestFullscreen?.().catch(() => {})}>
          <Maximize2 size={16} />
        </IconBtn>
      </div>
    </>
  );
}

export function MediaWall({
  tiles,
  columns = 2,
  aspect = "4/3",
}: {
  tiles: Tile[];
  columns?: 1 | 2 | 3;
  /** Frame ratio shared by every tile that does not set its own. */
  aspect?: string;
}) {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);
  const cols = columns === 3 ? "sm:grid-cols-3" : columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";

  return (
    <>
      <div className={`mt-6 grid grid-cols-1 ${cols} gap-4 items-start sm:items-stretch`}>
        {tiles.map((t, i) => {
          const ratio = t.aspect ?? aspect;
          return (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={t.kind === "note" ? "m-0 sm:h-full" : "m-0"}
            >
              {t.kind === "note" ? (
                <div
                  className="rounded-xl p-5 flex flex-col justify-center sm:h-full"
                  style={{ background: "var(--bg-surface)", border: FRAME_BORDER, borderLeft: "3px solid var(--accent-main)" }}
                >
                  <p
                    className="f-mono"
                    style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}
                  >
                    {t.eyebrow}
                  </p>
                  {t.title && (
                    <p className="mt-2" style={{ fontSize: "var(--text-base)", color: "var(--text-primary)", fontWeight: 500 }}>
                      {t.title}
                    </p>
                  )}
                  <div className="mt-2" style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {t.body}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="relative overflow-hidden rounded-xl"
                    style={{ aspectRatio: ratio, background: "var(--bg-soft)", border: FRAME_BORDER }}
                  >
                    {t.label && <Chip>{t.label}</Chip>}
                    {t.kind === "video" ? (
                      <Clip src={t.src} poster={t.poster} alt={t.alt} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOpen({ src: t.src, alt: t.alt })}
                        aria-label={`Enlarge: ${t.alt}`}
                        className="absolute inset-0 block h-full w-full"
                        style={{ cursor: "zoom-in", padding: 0 }}
                      >
                        {(t.fit ?? "contain") === "contain" && <Backdrop src={t.src} />}
                        <Image
                          src={t.src}
                          alt={t.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 440px"
                          style={{ objectFit: t.fit ?? "contain" }}
                        />
                      </button>
                    )}
                  </div>
                  {t.caption && (
                    <figcaption
                      className="f-accent mt-2"
                      style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.55 }}
                    >
                      {t.caption}
                    </figcaption>
                  )}
                </>
              )}
            </motion.figure>
          );
        })}
      </div>

      <AnimatePresence>
        {open && <ImageLightbox src={open.src} alt={open.alt} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}
