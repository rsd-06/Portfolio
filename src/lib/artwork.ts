// src/lib/artwork.ts
// Generative artwork for a post's share card. Pure data: a list of shapes in a
// 400×400 space, derived deterministically from the slug, so a post's artwork
// never changes between builds and two posts rarely look alike.
//
// Two renderers draw the same shapes: the static og:image (app/og/blog) and the
// animated card in the share sheet (components/blogs/ArtworkSvg), which uses
// each shape's `order` to stagger its entrance.

export type Shape =
  | { kind: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; width?: number; opacity: number; order: number }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; width: number; opacity: number; order: number }
  | { kind: "path"; d: string; stroke: string; width: number; opacity: number; order: number }
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill: string; rx: number; opacity: number; order: number };

export type Motif = "orbits" | "circuit" | "steps" | "waves";

export const ART_SIZE = 400;
const INK = "#1F1F1F";
const ACCENT = "#5227FF";
const SOFT = "#B19EEF";

// Category → motif. Anything unlisted falls back to orbits.
const MOTIF_BY_CATEGORY: Record<string, Motif> = {
  MATHEMATICS: "circuit",
  FUNDAMENTALS: "circuit",
  "COMPUTER ARCHITECTURE": "circuit",
  "SYSTEM DESIGN": "circuit",
  ECONOMICS: "steps",
  BUSINESS: "steps",
  STARTUPS: "steps",
  AI: "waves",
  "SOFTWARE ENGINEERING": "waves",
  DEVOPS: "waves",
  PHILOSOPHY: "orbits",
  CULTURE: "orbits",
  CONVERSATIONS: "orbits",
  SOCIETY: "orbits",
};

export const motifFor = (category: string): Motif => MOTIF_BY_CATEGORY[category.toUpperCase()] ?? "orbits";

/** mulberry32 seeded from an FNV-1a hash of the slug. */
function rng(seedText: string) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

function orbits(r: () => number): Shape[] {
  const c = ART_SIZE / 2;
  const shapes: Shape[] = [];
  const rings = 4 + Math.floor(r() * 3);
  for (let i = 0; i < rings; i++) {
    const radius = 38 + i * (150 / rings);
    shapes.push({ kind: "circle", cx: c, cy: c, r: round(radius), stroke: INK, width: 1.2, opacity: 0.18 + 0.05 * (i % 2), order: i });
    const angle = r() * Math.PI * 2;
    const big = i === Math.floor(rings / 2);
    shapes.push({
      kind: "circle",
      cx: round(c + Math.cos(angle) * radius),
      cy: round(c + Math.sin(angle) * radius),
      r: big ? 13 : 4 + r() * 5,
      fill: big ? ACCENT : i % 2 ? INK : SOFT,
      opacity: big ? 1 : 0.85,
      order: rings + i,
    });
  }
  shapes.push({ kind: "circle", cx: c, cy: c, r: 22, fill: INK, opacity: 0.9, order: rings * 2 });
  return shapes;
}

function circuit(r: () => number): Shape[] {
  const shapes: Shape[] = [];
  const n = 7;
  const step = ART_SIZE / (n + 1);
  const lit = new Set<number>();
  while (lit.size < 6) lit.add(Math.floor(r() * n * n));
  let order = 0;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const i = y * n + x;
      shapes.push({ kind: "circle", cx: step * (x + 1), cy: step * (y + 1), r: lit.has(i) ? 7 : 2.4, fill: lit.has(i) ? ACCENT : INK, opacity: lit.has(i) ? 1 : 0.35, order: order++ % 12 });
    }
  // Right-angled traces between lit nodes, like a PCB.
  const nodes = [...lit].map((i) => ({ x: step * ((i % n) + 1), y: step * (Math.floor(i / n) + 1) }));
  for (let k = 0; k < nodes.length - 1; k++) {
    const a = nodes[k], b = nodes[k + 1];
    shapes.push({ kind: "path", d: `M${a.x} ${a.y} H${b.x} V${b.y}`, stroke: k % 2 ? INK : ACCENT, width: 2.2, opacity: 0.7, order: 12 + k });
  }
  return shapes;
}

function steps(r: () => number): Shape[] {
  const shapes: Shape[] = [];
  const bars = 7;
  const gap = 12;
  const w = (ART_SIZE - 80 - gap * (bars - 1)) / bars;
  let h = 40 + r() * 30;
  for (let i = 0; i < bars; i++) {
    h = Math.min(300, h + 18 + r() * 34);
    const isPeak = i === bars - 2;
    shapes.push({ kind: "rect", x: round(40 + i * (w + gap)), y: round(360 - h), w: round(w), h: round(h), fill: isPeak ? ACCENT : i % 2 ? INK : SOFT, rx: 6, opacity: isPeak ? 1 : 0.8, order: i });
  }
  shapes.push({ kind: "line", x1: 30, y1: 362, x2: 370, y2: 362, stroke: INK, width: 1.5, opacity: 0.5, order: bars });
  return shapes;
}

function waves(r: () => number): Shape[] {
  const shapes: Shape[] = [];
  const lines = 6;
  for (let i = 0; i < lines; i++) {
    const amp = 18 + r() * 34;
    const freq = 1.5 + r() * 1.5;
    const phase = r() * Math.PI * 2;
    const baseY = 90 + i * 44;
    let d = "";
    for (let x = 20; x <= 380; x += 10) {
      const y = baseY + Math.sin((x / ART_SIZE) * Math.PI * 2 * freq + phase) * amp;
      d += `${x === 20 ? "M" : "L"}${x} ${round(y)} `;
    }
    shapes.push({ kind: "path", d: d.trim(), stroke: i === 2 ? ACCENT : i % 2 ? INK : SOFT, width: i === 2 ? 3.4 : 1.8, opacity: i === 2 ? 1 : 0.6, order: i });
  }
  return shapes;
}

const GENERATORS: Record<Motif, (r: () => number) => Shape[]> = { orbits, circuit, steps, waves };

export function artworkFor(slug: string, category: string): Shape[] {
  return GENERATORS[motifFor(category)](rng(slug));
}
