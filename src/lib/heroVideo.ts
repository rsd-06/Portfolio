// src/lib/heroVideo.ts
//
// Single place to swap in a new hero reel. To replace the placeholder footage:
// run `npm run compress-video -- -InputPath <raw master>` to regenerate the four
// files in public/, refresh the poster, and — if the filenames change — edit the
// arrays below. Nothing else in the app needs to know.
//
// Sources are listed in preference order; the browser picks the first it can
// play, so WebM (smaller) comes before MP4 (universally supported).

export type VideoSource = {
  src: string;
  type: string;
};

export const HERO_VIDEO = {
  /** Shown before the video can paint, under reduced motion, and if loading fails. */
  poster: "/hero.jpg",

  /** 1080p — 8.2 MB WebM / 11.0 MB MP4 */
  desktop: [
    { src: "/heroVideo.webm", type: "video/webm" },
    { src: "/heroVideo.mp4", type: "video/mp4" },
  ] as VideoSource[],

  /**
   * 720p — 1.76 MB WebM / 2.00 MB MP4.
   * Leave this empty if no mobile encode exists: HeroVideo falls back to the
   * desktop list rather than requesting files that aren't there. (It previously
   * pointed at heroVideoMobile.* while those files did not exist, so the hero
   * was a black rectangle on every phone.)
   */
  mobile: [
    { src: "/heroVideoMobile.webm", type: "video/webm" },
    { src: "/heroVideoMobile.mp4", type: "video/mp4" },
  ] as VideoSource[],
} as const;
