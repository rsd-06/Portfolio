// src/hooks/useAssetLoader.ts
"use client";

import { useState, useEffect } from "react";

interface AssetProps {
  images: string[];
  videos: string[];
}

export function useAssetLoader({ images, videos }: AssetProps) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let completedCount = 0;

    // Videos are intentionally excluded from blocking the loader.
    // They are large assets (heroVideo.mp4 is ~64 MB) and will be
    // fetched in the background after the loader exits via the
    // `rsd:loaderDone` custom event. Only images are waited on.
    const watchedAssets = [...images];
    const totalCount = watchedAssets.length;

    if (totalCount === 0) {
      setProgress(100);
      document.documentElement.style.setProperty("--loader-progress", "100%");
      // Short 300ms buffer — enough for first paint, not artificially long
      setTimeout(() => setReady(true), 300);
      return;
    }

    const start = Date.now();

    const updateProgress = () => {
      completedCount++;
      const currentProgress = (completedCount / totalCount) * 100;
      setProgress(currentProgress);
      document.documentElement.style.setProperty("--loader-progress", `${currentProgress}%`);

      if (completedCount === totalCount) {
        const elapsed = Date.now() - start;
        // Keep a small buffer (max 300ms) so the RAF counter has time to
        // visually reach 100%, but don't add artificial 1200ms delay.
        const remaining = Math.max(0, 300 - elapsed);
        setTimeout(() => setReady(true), remaining);
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress;
    });

    // Videos are no longer waited on (see above).
    // The `videos` param is kept in the signature for future use.
    void videos;

  }, [images, videos]);

  return { progress, ready };
}
