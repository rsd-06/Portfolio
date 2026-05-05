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
    const totalCount = images.length + videos.length;
    
    if (totalCount === 0) {
      setProgress(100);
      document.documentElement.style.setProperty("--loader-progress", "100%");
      setTimeout(() => setReady(true), 1200);
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
        const remaining = Math.max(0, 1200 - elapsed);
        setTimeout(() => setReady(true), remaining);
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress;
    });

    videos.forEach((src) => {
      const video = document.createElement("video");
      video.src = src;
      video.preload = "auto";
      video.oncanplaythrough = updateProgress;
      video.onerror = updateProgress;
      video.load();
    });

  }, [images, videos]);

  return { progress, ready };
}
