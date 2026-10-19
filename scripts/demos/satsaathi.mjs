// SatSaathi's landing page (local web app on :3005, `pnpm dev` in apps/web):
// drag the flood before/after comparison, switch the interface through its
// four languages, then read down to the trace.

const BASE = process.env.SATSAATHI_URL ?? "http://localhost:3005";
const OUT = "public/assets/projects/satsaathi";
const HANDLE = '[aria-label="Compare before and after"]';

export default async function satsaathi(studio) {
  const d = await studio.open({ width: 1440, height: 900 });
  await d.goto(`${BASE}/en`, 6000);
  await d.record();
  await d.wait(1500);

  const box = await d.evaluate(`(() => { const r = document.querySelector(${JSON.stringify(HANDLE)}).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await d.drag(box, { x: box.x - 260, y: box.y }, 1400);
  await d.wait(400);
  await d.drag({ x: box.x - 260, y: box.y }, { x: box.x + 220, y: box.y }, 1800);
  await d.wait(600);
  await d.drag({ x: box.x + 220, y: box.y }, box, 900);
  await d.wait(800);
  await d.shot(`${OUT}/04.jpg`);

  for (const lang of ["hi", "ta", "bn"]) {
    await d.click(`button[lang="${lang}"]`, { moveMs: 600 });
    await d.waitFor(`document.documentElement.lang === ${JSON.stringify(lang)}`, 20000);
    await d.wait(1600);
    if (lang === "ta") await d.shot(`${OUT}/05.jpg`);
  }
  await d.click('button[lang="en"]', { moveMs: 600 });
  await d.waitFor(`document.documentElement.lang === "en"`, 20000);
  await d.wait(1000);

  await d.scrollTo("#how", 2200, 70);
  await d.wait(2200);
  await d.scrollTo("ol.border-rule-strong", 2400, 260);
  await d.wait(2500);
  await d.stop();
  await studio.encode([d], `${OUT}/demo.mp4`);
}
