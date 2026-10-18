// Renders routes at phone size in headless Edge/Chrome (real time, real rAF),
// scrolls each page so in-view animations run, then reports:
//   - overflow: visible elements reaching past the right edge, not clipped
//   - hidden:   text blocks still at opacity 0 after the page has settled
// and saves a full-page screenshot per route.
//
//   node scripts/mobile-audit.mjs [baseUrl] [route ...]
//   BROWSER=path/to/chrome.exe to override the browser.
//   NOJS=1 renders with page JavaScript disabled (what crawlers and no-JS
//   visitors get) — every animated section must still be readable.

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const routes = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/about", "/projects", "/projects/codecritter", "/blogs", "/blogs/the-infinite-hotel-paradox", "/protosem", "/protosem/week-7", "/contact"];
const browser =
  process.env.BROWSER ??
  ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(existsSync);
if (!browser) throw new Error("No Edge/Chrome found; set BROWSER");

const outDir = join(process.cwd(), ".mobile-audit");
mkdirSync(outDir, { recursive: true });
const profile = join(tmpdir(), `mobile-audit-${process.pid}`);
const port = 9300 + (process.pid % 500);
const proc = spawn(browser, [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  "--no-first-run", "--disable-sync", "--hide-scrollbars", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
const noJs = process.env.NOJS === "1";
if (noJs) await send("Emulation.setScriptExecutionDisabled", { value: true });

// Scrolling relies on page timers, so it only runs with JavaScript on. The
// measurement is synchronous so it also works with page scripts disabled.
const SCROLL_THROUGH = `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { window.scrollTo(0, y); await sleep(450); }
  await sleep(2500);
  window.scrollTo(0, 0);
})()`;

const AUDIT = `(() => {
  const vw = document.documentElement.clientWidth;
  const clippedByAncestor = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(hidden|clip|auto|scroll)/.test(s.overflowX) && p.getBoundingClientRect().right <= vw + 1) return true;
    }
    return false;
  };
  const effectivelyInvisible = (el) => { for (let p = el; p; p = p.parentElement) if (getComputedStyle(p).opacity === "0") return true; return false; };
  // A zero-height clipped ancestor is a collapsed disclosure (e.g. a note that
  // opens on hover/tap), hidden on purpose rather than stuck.
  const collapsed = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (p.getBoundingClientRect().height === 0 && s.overflow !== "visible") return true; } return false; };
  const label = (el) => el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/).slice(0, 3).join(".") : "");
  const overflow = new Map(), hidden = new Map();
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const s = getComputedStyle(el);
    if (s.position === "fixed" || s.visibility === "hidden") continue;
    const text = (el.innerText || "").trim();
    if (r.right > vw + 1 && r.left < vw && !effectivelyInvisible(el) && !clippedByAncestor(el) && !overflow.has(label(el)))
      overflow.set(label(el), { by: Math.round(r.right - vw), text: text.slice(0, 40) });
    // Only horizontally on-screen elements: cards further along a horizontal
    // carousel haven't been scrolled into view yet, so they haven't entered.
    if (r.left < vw && r.right > 0 && text.length > 20 && el.children.length < 4 && effectivelyInvisible(el) && !collapsed(el) && !hidden.has(label(el)))
      hidden.set(label(el), text.slice(0, 50));
  }
  return { overflow: [...overflow].slice(0, 8), hidden: [...hidden].slice(0, 8), height: document.documentElement.scrollHeight };
})()`;

let failures = 0;
for (const route of routes) {
  await send("Page.navigate", { url: base + route });
  await sleep(4500);
  if (!noJs) await evaluate(SCROLL_THROUGH);
  const res = await evaluate(AUDIT);
  const { cssContentSize } = await send("Page.getLayoutMetrics");
  const shot = await send("Page.captureScreenshot", {
    format: "jpeg", quality: 70, captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: 375, height: Math.min(cssContentSize.height, 12000), scale: 1 },
  });
  const file = join(outDir, (noJs ? "nojs-" : "") + (route === "/" ? "home" : route.slice(1).replace(/\//g, "_")) + ".jpg");
  writeFileSync(file, Buffer.from(shot.data, "base64"));
  const bad = res.overflow.length + res.hidden.length;
  failures += bad ? 1 : 0;
  console.log(`${bad ? "FAIL" : "ok  "} ${route}  (${res.height}px tall) → ${file}`);
  for (const [k, v] of res.overflow) console.log(`     overflow +${v.by}px  ${k}  "${v.text}"`);
  for (const [k, v] of res.hidden) console.log(`     invisible  ${k}  "${v}"`);
}

ws.close();
proc.kill();
process.exit(failures ? 1 : 0);
