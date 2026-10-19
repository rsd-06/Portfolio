// SkillSync run locally against its own seed data (client on :3020, API on
// :5000 with an in-memory MongoDB). Signs in through the app's one-click demo
// account button, then: idea feed and filters, an idea, skill matching, a team.

const BASE = process.env.SKILLSYNC_URL ?? "http://localhost:3020";
const OUT = "public/assets/projects/skillsync";

const tag = (expr, name) => `(() => { const el = ${expr}; if (el) el.setAttribute("data-demo", ${JSON.stringify(name)}); return Boolean(el); })()`;

export default async function skillsync(studio) {
  const d = await studio.open({ width: 1440, height: 900 });
  await d.goto(`${BASE}/feed`, 4000);
  await d.goto(`${BASE}/match`, 3000);
  await d.goto(`${BASE}/teams`, 3000);
  await d.goto(`${BASE}/login`, 4000);
  await d.record();
  await d.wait(1200);

  await d.evaluate(tag(`[...document.querySelectorAll("button")].find((b) => /Sudharshan R/.test(b.textContent))`, "demo-user"));
  await d.click('[data-demo="demo-user"]');
  await d.wait(700);
  await d.click('button[type="submit"]');
  await d.waitFor(`location.pathname === "/feed" && document.querySelectorAll('a[href^="/ideas/"]').length > 0`, 30000);
  await d.wait(2000);
  await d.shot(`${OUT}/02.jpg`);
  await d.scroll(500, 1600);
  await d.wait(900);
  await d.scroll(-500, 1200);

  if (await d.evaluate(tag(`[...document.querySelectorAll("main button")].find((b) => /^(React|Python|Machine Learning|Node\\.js)$/.test(b.textContent.trim()))`, "skill"))) {
    await d.click('[data-demo="skill"]');
    await d.wait(1800);
    await d.click('[data-demo="skill"]');
    await d.wait(900);
  }

  await d.click('a[href^="/ideas/"]');
  await d.waitFor(`location.pathname.startsWith("/ideas/")`, 30000);
  await d.wait(2200);
  await d.scroll(400, 1400);
  await d.wait(1200);

  await d.click('nav a[href="/match"]');
  await d.waitFor(`location.pathname === "/match"`, 30000);
  await d.wait(2400);
  await d.shot(`${OUT}/03.jpg`);
  await d.scroll(450, 1500);
  await d.wait(1200);

  await d.click('nav a[href="/teams"]');
  await d.waitFor(`location.pathname === "/teams"`, 30000);
  await d.wait(1800);
  await d.click('a[href^="/teams/"]');
  await d.waitFor(`/^\\/teams\\/./.test(location.pathname)`, 30000);
  await d.wait(2500);
  await d.shot(`${OUT}/04.jpg`);
  await d.stop();
  await studio.encode([d], `${OUT}/demo.mp4`);
}
