// This site: the loader, the hero and reel, the featured rail, then a post
// and its share card. Runs against `npm run dev` (or PORTFOLIO_URL).

const BASE = process.env.PORTFOLIO_URL ?? "http://localhost:3000";
const OUT = "public/assets/projects/portfolio";

export default async function portfolio(studio) {
  const d = await studio.open({ width: 1440, height: 900 });
  // Warm the dev server so the loader isn't waiting on a first compile.
  await d.goto(`${BASE}/blogs/the-infinite-hotel-paradox`, 1000);
  await d.goto(`${BASE}/blogs`, 1000);
  await d.goto("about:blank", 200);

  await d.record();
  await d.send("Page.navigate", { url: `${BASE}/` });
  await d.waitFor("window.__rsd_loaderDone === true", 60000);
  await d.wait(2200);
  for (let i = 0; i < 4; i++) { await d.scroll(700, 1700); await d.wait(500); }
  await d.wait(1200);
  for (let i = 0; i < 6; i++) { await d.scroll(650, 1500); await d.wait(350); }
  await d.wait(1200);

  await d.click('nav a[href="/blogs"]');
  await d.waitFor(`location.pathname === "/blogs"`, 30000);
  await d.wait(2500);
  await d.scroll(500, 1400);
  await d.wait(900);
  await d.click('main a[href="/blogs/the-infinite-hotel-paradox"]');
  await d.waitFor(`location.pathname.startsWith("/blogs/the-infinite")`, 30000);
  await d.wait(2500);
  await d.scroll(900, 2200);
  await d.wait(1200);
  await d.scroll(-900, 1400);
  await d.wait(500);
  await d.evaluate(`[...document.querySelectorAll("main header button")].find((b) => /share/i.test(b.textContent))?.setAttribute("data-demo", "share")`);
  await d.click('[data-demo="share"]');
  await d.wait(3200);
  await d.shot(`${OUT}/03.jpg`);
  await d.click('[aria-label="Close share sheet"]');
  await d.wait(1200);
  await d.stop();
  await studio.encode([d], `${OUT}/demo.mp4`);
}
