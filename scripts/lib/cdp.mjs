// scripts/lib/cdp.mjs
// Launches Edge/Chrome and talks to one page over the DevTools protocol with
// Node's built-in WebSocket, so the audit and demo scripts need no Puppeteer.

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch({ width = 1280, height = 800, headless = true, profile, mobile = width <= 500 } = {}) {
  const browser =
    process.env.BROWSER ??
    ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(existsSync);
  if (!browser) throw new Error("No Edge/Chrome found; set BROWSER");

  const port = 9300 + Math.floor(Math.random() * 600);
  const proc = spawn(browser, [
    ...(headless ? ["--headless=new"] : [`--window-size=${width},${height + 90}`]),
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile ?? join(tmpdir(), `cdp-${process.pid}-${port}`)}`,
    "--no-first-run", "--disable-sync", "--hide-scrollbars", "--autoplay-policy=no-user-gesture-required",
    "about:blank",
  ], { stdio: "ignore" });

  let target;
  for (let i = 0; i < 75 && !target; i++) {
    await sleep(200);
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
  }
  if (!target) { proc.kill(); throw new Error("Browser did not expose a page target"); }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else if (msg.method) for (const cb of listeners.get(msg.method) ?? []) cb(msg.params);
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      const timer = setTimeout(() => { pending.delete(n); reject(new Error(`${method}: no reply in 45s`)); }, 45000);
      pending.set(n, (m) => {
        clearTimeout(timer);
        if (m.error) reject(new Error(`${method}: ${m.error.message}`));
        else resolve(m.result);
      });
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const on = (method, cb) => listeners.set(method, [...(listeners.get(method) ?? []), cb]);
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });
  if (mobile) await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

  const close = () => { ws.close(); proc.kill(); };
  return { send, on, evaluate, close, sleep };
}
