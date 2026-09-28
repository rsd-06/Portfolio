"use client";

// Image and video primitives.

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";

export type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  /** CSS aspect-ratio for the wrapper, e.g. "4/3". */
  aspect?: string;
  maxWidth?: string;
  sizes?: string;
  /**
   * "cover" crops to fill (right for photos); "contain" fits the whole frame
   * (right for screenshots, diagrams and schematics, which must not be cropped).
   */
  fit?: "cover" | "contain";
  priority?: boolean;
};

export function Figure({
  src,
  alt,
  caption,
  aspect = "4/3",
  maxWidth = "720px",
  sizes = "(max-width: 768px) 100vw, 720px",
  fit = "cover",
  priority = false,
}: FigureProps) {
  return (
    <motion.figure 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6" 
      style={{ maxWidth, width: "100%" }}
    >
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          aspectRatio: aspect,
          background: "var(--bg-soft)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: fit }}
        />
      </div>
      {caption && (
        <figcaption
          className="f-accent mt-2"
          style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
        >
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

/**
 * Muted, looping demo clip. Autoplay is deliberately paired with muted +
 * playsInline, which is what iOS requires to play inline at all.
 */
export function VideoFigure({
  src,
  poster,
  caption,
  maxWidth = "720px",
  aspect,
}: {
  src: string;
  poster?: string;
  caption?: string;
  maxWidth?: string;
  aspect?: string;
}) {
  return (
    <motion.figure 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6" 
      style={{ maxWidth, width: "100%" }}
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--bg-soft)",
          border: "1px solid var(--border-subtle)",
          aspectRatio: aspect,
        }}
      >
        <video
          src={src}
          poster={poster}
          controls
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full"
          style={{ display: "block", objectFit: "contain" }}
        />
      </div>
      {caption && (
        <figcaption
          className="f-accent mt-2"
          style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
        >
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

/** Multi-image grid with a shared lightbox. */
export function Gallery({
  items,
  columns = 2,
}: {
  items: FigureProps[];
  columns?: 2 | 3;
}) {
  const [open, setOpen] = useState<FigureProps | null>(null);
  const cols = columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <>
      <div className={`mt-6 grid grid-cols-1 ${cols} gap-4`}>
        {items.map((item, i) => (
          <motion.figure 
            key={item.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setOpen(item)}
              aria-label={`Enlarge: ${item.alt}`}
              className="relative w-full rounded-xl overflow-hidden block"
              style={{
                aspectRatio: item.aspect ?? "4/3",
                background: "var(--bg-soft)",
                border: "1px solid var(--border-subtle)",
                cursor: "zoom-in",
                padding: 0,
                minHeight: "44px",
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                style={{ objectFit: item.fit ?? "cover" }}
              />
            </button>
            {item.caption && (
              <figcaption
                className="f-accent mt-2"
                style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
              >
                {item.caption}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <ImageLightbox src={open.src} alt={open.alt} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
