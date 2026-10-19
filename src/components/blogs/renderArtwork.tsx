// src/components/blogs/renderArtwork.tsx
// Draws lib/artwork shapes as SVG. A plain function (no hooks) so the og:image
// route (Satori) and the share sheet can both call it. Animation attributes are
// only emitted when `animated`, because Satori can't render them.

import type { CSSProperties } from "react";
import { ART_SIZE, type Shape } from "@/lib/artwork";

export function renderArtwork(shapes: Shape[], { animated = false, size = ART_SIZE }: { animated?: boolean; size?: number } = {}) {
  const motion = (s: Shape, draw: boolean) =>
    animated
      ? {
          className: draw ? "art-draw" : "art-in",
          style: { "--i": s.order, "--o": s.opacity } as CSSProperties,
          ...(draw ? { pathLength: 1 } : {}),
        }
      : {};

  return (
    <svg width={size} height={size} viewBox={`0 0 ${ART_SIZE} ${ART_SIZE}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {shapes.map((s, i) => {
        switch (s.kind) {
          case "circle":
            return (
              <circle
                key={i}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill={s.fill ?? "none"}
                stroke={s.stroke}
                strokeWidth={s.width}
                opacity={s.opacity}
                {...motion(s, !s.fill)}
              />
            );
          case "line":
            return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.stroke} strokeWidth={s.width} opacity={s.opacity} {...motion(s, true)} />;
          case "path":
            return <path key={i} d={s.d} fill="none" stroke={s.stroke} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" opacity={s.opacity} {...motion(s, true)} />;
          case "rect":
            return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} fill={s.fill} opacity={s.opacity} {...motion(s, false)} />;
        }
      })}
    </svg>
  );
}
