// scripts/record-demo.mjs
// Records a project demo from a scripted browser session and encodes it as a
// small muted H.264 mp4 (the format project cards autoplay), plus stills.
//
//   node scripts/record-demo.mjs <scenario>        → scripts/demos/<scenario>.mjs
//
// A scenario's default export receives a studio and drives one or more pages:
//   const d = await studio.open({ width, height, headless, profile });
//   await d.goto(url); d.record(); await d.scroll(800, 1500); await d.click(sel);
//   await d.shot("public/assets/projects/x/02.jpg");
//   await studio.encode([d], "public/assets/projects/x/demo.mp4");
// Two pages passed to encode() are placed side by side on one clock.
// Input is real (wheel, mouse, keys), so Lenis and hover states behave as for a
// visitor. Headless screencasts have no mouse pointer, so one is drawn in-page.
// Needs ffmpeg on PATH. Frames are staged in .demo-frames/ (git-ignored).

import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { launch } from "./lib/cdp.mjs";

const FPS = 30;
// A still stretch longer than this (the page settled, a slow step) is cut
// down to it: a demo should never sit on a frozen frame.
const MAX_HOLD = 3;
const name = process.argv[2];
if (!name) throw new Error("usage: node scripts/record-demo.mjs <scenario>");

const CURSOR = `(() => {
  if (window.__demoCursor) return; window.__demoCursor = true;
  const add = () => {
    const c = document.createElement("div"); c.id = "__demo_cursor";
    c.style.cssText = "position:fixed;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:rgba(20,20,20,.35);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);z-index:2147483647;pointer-events:none;transition:transform .12s;opacity:0";
    document.documentElement.appendChild(c);
    addEventListener("mousemove", (e) => { c.style.opacity = 1; c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; }, true);
    addEventListener("mousedown", () => (c.style.transform = "scale(.7)"), true);
    addEventListener("mouseup", () => (c.style.transform = ""), true);
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", add) : add();
})()`;

// Next's dev-mode badge would otherwise sit in the corner of every demo.
const HIDE_DEV_OVERLAY = `(() => { const s = document.createElement("style"); s.textContent = "nextjs-portal{display:none!important}"; (document.head || document.documentElement).appendChild(s); })()`;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Drives fn(eased progress) on wall-clock time rather than a step count, so
// a busy page (each CDP call waits on it) cannot stretch a 1.5 s gesture.
async function tween(ms, fn) {
  const start = Date.now();
  for (let p = 0; p < 1; ) {
    p = Math.min(1, (Date.now() - start) / ms);
    await fn(ease(p));
    if (p < 1) await new Promise((r) => setTimeout(r, 16));
  }
}

async function open({ width = 1440, height = 900, headless = true, profile } = {}) {
  const b = await launch({ width, height, headless, profile, mobile: false });
  const { send, on, evaluate, sleep } = b;
  await send("Page.addScriptToEvaluateOnNewDocument", { source: CURSOR + ";" + HIDE_DEV_OVERLAY });

  const frames = [];
  const cuts = [];
  let recording = false;
  on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    if (recording) frames.push({ t: metadata.timestamp, buf: Buffer.from(data, "base64") });
    send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });

  let mouse = { x: width / 2, y: height / 2 };
  const locate = async (selector) => {
    const r = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error(`selector not found: ${selector}`);
    return r;
  };
  // A visitor scrolls to what they click, so off-screen targets glide in first.
  const center = async (selector) => {
    const r = await locate(selector);
    if (r.y >= 60 && r.y <= height - 60) return r;
    await d.scroll(r.y - height / 2, 1400);
    await sleep(400);
    return locate(selector);
  };

  const d = {
    width, height, frames, cuts, evaluate, send, sleep,
    async goto(url, settleMs = 3000) {
      await send("Page.navigate", { url });
      // Not "load": a page streaming a hero video may not fire it for a long time.
      await sleep(500);
      await evaluate(`new Promise((r) => { if (document.readyState !== "loading") r(); else addEventListener("DOMContentLoaded", r, { once: true }); setTimeout(r, 15000); })`).catch(() => {});
      await sleep(settleMs);
      await evaluate(CURSOR + ";" + HIDE_DEV_OVERLAY);
    },
    async record() {
      recording = true;
      await send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: width, maxHeight: height, everyNthFrame: 1 });
      // Screencast only emits on repaint; a nudge guarantees a first frame.
      await d.move(mouse.x + 1, mouse.y, 50);
    },
    async stop() {
      await sleep(300);
      await send("Page.stopScreencast");
      recording = false;
    },
    wait: (ms) => sleep(ms),
    // Plays whatever `during` waits on (a slow server, a training run) as a
    // `keepSec` fast-forward. Bounds come from frame timestamps, not
    // Date.now(), so they share the screencast clock.
    async compress(during, keepSec = 2) {
      const a = frames.at(-1)?.t;
      await during();
      await sleep(100);
      const b = frames.at(-1)?.t;
      if (a != null && b > a) cuts.push({ a, b, keep: keepSec });
    },
    async waitFor(expression, timeoutMs = 60000) {
      for (const end = Date.now() + timeoutMs; Date.now() < end; await sleep(250))
        if (await evaluate(expression).catch(() => false)) return;
      throw new Error(`timed out waiting for: ${expression}`);
    },
    async move(x, y, ms = 600) {
      const from = { ...mouse };
      await tween(ms, async (k) => {
        mouse = { x: from.x + (x - from.x) * k, y: from.y + (y - from.y) * k };
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: mouse.x, y: mouse.y });
      });
    },
    async hover(selector, ms = 700) { const c = await center(selector); await d.move(c.x, c.y, ms); },
    async click(selector, { moveMs = 700 } = {}) {
      const c = await center(selector);
      await d.move(c.x, c.y, moveMs);
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x: c.x, y: c.y, button: "left", clickCount: 1 });
      await sleep(90);
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: c.x, y: c.y, button: "left", clickCount: 1 });
    },
    async drag(from, to, ms = 1200) {
      await d.move(from.x, from.y, 500);
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x: from.x, y: from.y, button: "left", clickCount: 1 });
      await tween(ms, async (k) => {
        mouse = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: mouse.x, y: mouse.y, button: "left", buttons: 1 });
      });
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: to.x, y: to.y, button: "left", clickCount: 1 });
    },
    // Wheel ticks spread over `ms`, eased, so smooth-scroll libraries glide.
    async scroll(dy, ms = 1200) {
      let sent = 0;
      await tween(ms, async (k) => {
        const target = Math.round(dy * k);
        if (target === sent) return;
        await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: mouse.x, y: mouse.y, deltaX: 0, deltaY: target - sent });
        sent = target;
      });
    },
    async scrollTo(selector, ms = 1500, offset = 120) {
      const top = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); return el ? el.getBoundingClientRect().top : null; })()`);
      if (top == null) throw new Error(`selector not found: ${selector}`);
      await d.scroll(top - offset, ms);
    },
    async type(text, cps = 14) {
      for (const ch of text) {
        if (ch === "\n") {
          await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
          await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
        } else await send("Input.insertText", { text: ch });
        await sleep(1000 / cps);
      }
    },
    async key(key, code = key, keyCode = 0, modifiers = 0) {
      await send("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: keyCode, modifiers });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: keyCode, modifiers });
    },
    async shot(file, { quality = 85 } = {}) {
      // Stills are for galleries, where a floating pointer is just a smudge.
      const toggle = (v) => evaluate(`document.getElementById("__demo_cursor")?.style.setProperty("visibility", "${v}")`).catch(() => {});
      await toggle("hidden");
      const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality });
      await toggle("visible");
      mkdirSync(dirname(resolve(file)), { recursive: true });
      writeFileSync(resolve(file), Buffer.from(data, "base64"));
      console.log(`  still → ${file}`);
    },
    close: b.close,
  };
  return d;
}

// Resample each page's variable-rate frames onto one 30 fps clock (the
// latest frame at or before each tick), so side-by-side pages stay in sync.
async function encode(pages, out, { crf = 30 } = {}) {
  const work = resolve(".demo-frames", name);
  rmSync(work, { recursive: true, force: true });
  const t0 = Math.max(...pages.map((p) => p.frames[0]?.t ?? Infinity));
  const t1 = Math.min(...pages.map((p) => p.frames.at(-1)?.t ?? -Infinity));
  if (!(t1 > t0)) throw new Error("nothing recorded: call d.record() before acting");
  // Source time of each output frame; inside a compress() cut it advances
  // faster, and across a still stretch it skips ahead. Cuts come from the
  // first page and apply to all.
  const times = [];
  const cuts = pages[0].cuts;
  const changes = pages.flatMap((p) => p.frames.map((f) => f.t)).sort((a, b) => a - b);
  let k = 0;
  for (let t = t0; t <= t1; ) {
    times.push(t);
    const cut = cuts.find((c) => t >= c.a && t < c.b);
    t += cut ? (cut.b - cut.a) / (cut.keep * FPS) : 1 / FPS;
    while (k < changes.length && changes[k] <= t) k++;
    if (k < changes.length && changes[k] - t > MAX_HOLD) t = changes[k] - MAX_HOLD;
  }

  const inputs = pages.map((p, n) => {
    const dir = join(work, String(n));
    mkdirSync(dir, { recursive: true });
    let j = 0;
    const list = [];
    for (const t of times) {
      while (j + 1 < p.frames.length && p.frames[j + 1].t <= t) j++;
      const file = join(dir, `${j}.jpg`);
      if (list.at(-1)?.file === file) list.at(-1).n++;
      else { writeFileSync(file, p.frames[j].buf); list.push({ file, n: 1 }); }
    }
    const txt = list.map((e) => `file '${e.file.replace(/\\/g, "/")}'\nduration ${(e.n / FPS).toFixed(4)}`).join("\n") + `\nfile '${list.at(-1).file.replace(/\\/g, "/")}'\n`;
    const listFile = join(dir, "list.txt");
    writeFileSync(listFile, txt);
    return listFile;
  });

  const scale = (w) => `fps=${FPS},scale=${w}:-2:flags=lanczos,setsar=1`;
  const filter =
    pages.length === 1
      ? ["-vf", `${scale(pages[0].width)},format=yuv420p`]
      : ["-filter_complex", inputs.map((_, n) => `[${n}:v]${scale(pages[n].width)},pad=iw+${n < inputs.length - 1 ? 8 : 0}:ih:0:0:white[v${n}]`).join(";") + `;${inputs.map((_, n) => `[v${n}]`).join("")}hstack=inputs=${inputs.length},format=yuv420p`];
  mkdirSync(dirname(resolve(out)), { recursive: true });
  const args = ["-loglevel", "error", "-y", ...inputs.flatMap((l) => ["-f", "concat", "-safe", "0", "-i", l]), ...filter,
    "-an", "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-movflags", "+faststart", resolve(out)];
  const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg failed");
  rmSync(work, { recursive: true, force: true });
  const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration,size:stream=width,height", "-of", "compact=p=0:nk=1", resolve(out)], { encoding: "utf8" });
  console.log(`  video → ${out}  (${probe.stdout.trim().replace(/\n/g, " ")})`);
}

const scenario = (await import(pathToFileURL(resolve("scripts/demos", `${name}.mjs`)).href)).default;
const opened = [];
const studio = {
  open: async (opts) => { const d = await open(opts); opened.push(d); return d; },
  encode,
};
try {
  console.log(`recording ${name}`);
  await scenario(studio);
} finally {
  for (const d of opened) d.close();
}
