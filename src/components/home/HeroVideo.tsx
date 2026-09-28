"use client";

// src/components/home/HeroVideo.tsx
// The hero reel, with the device/motion/failure handling kept in one place so
// MacMonitorSection only has to care about geometry.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HERO_VIDEO } from "@/lib/heroVideo";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Props = {
  /**
   * Gate for fetching. The home loader fires `rsd:loaderDone`; until then we
   * keep preload="none" so the reel never competes with the loader phase.
   */
  ready?: boolean;
  className?: string;
  ariaLabel?: string;
};

type LoaderWindow = Window & { __rsd_loaderDone?: boolean };

/**
 * Resolves once the loader has finished — or immediately when returning to home
 * via client navigation, where the event has already fired.
 *
 * Read as external state rather than mirrored into React state: the flag can
 * already be set before this component mounts, and syncing that in an effect
 * means a synchronous setState and an extra render pass.
 */
function useLoaderDone(initial: boolean) {
  const subscribe = useCallback((onChange: () => void) => {
    const handler = () => {
      (window as LoaderWindow).__rsd_loaderDone = true;
      onChange();
    };
    window.addEventListener("rsd:loaderDone", handler);
    return () => window.removeEventListener("rsd:loaderDone", handler);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => initial || Boolean((window as LoaderWindow).__rsd_loaderDone),
    () => initial
  );
}

export default function HeroVideo({
  ready = false,
  className = "w-full h-full object-cover",
  ariaLabel = "Portfolio reel video",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const loaderDone = useLoaderDone(ready);
  const [failed, setFailed] = useState(false);

  // Fall back to the desktop encode when no mobile variant is configured, so a
  // missing file degrades in quality rather than 404-ing to a black box.
  const sources =
    isMobile && HERO_VIDEO.mobile.length > 0
      ? HERO_VIDEO.mobile
      : HERO_VIDEO.desktop;

  // <source> children are only read when the element loads. Swapping them after
  // a breakpoint flip (rotate, devtools resize) would otherwise leave the old
  // file playing, so key the element to force a remount.
  const sourceKey = sources[0]?.src ?? "none";

  const showPosterOnly = reducedMotion || failed;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || showPosterOnly || !loaderDone) return;
    // `error` on <source> does not bubble, so check the element's own state.
    if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) setFailed(true);
  }, [loaderDone, showPosterOnly, sourceKey]);

  if (showPosterOnly) {
    return (
      <Image
        src={HERO_VIDEO.poster}
        alt={ariaLabel}
        fill
        priority={false}
        sizes="100vw"
        className={className.includes("object-") ? className : `${className} object-cover`}
      />
    );
  }

  return (
    <video
      key={sourceKey}
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      poster={HERO_VIDEO.poster}
      preload={loaderDone ? "auto" : "none"}
      suppressHydrationWarning
      className={className}
      aria-label={ariaLabel}
      onError={() => setFailed(true)}
    >
      {loaderDone &&
        sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  );
}
