// The PR Regression Audit env's dashboard on its Hugging Face Space: a read
// down from the header to the V1/V2 evaluation charts and the raw table.

const URL = "https://rsd-06-prregressionauditenv.hf.space/";
const OUT = "public/assets/projects/gitpr";

// The dashboard has few ids, so sections are found by their heading text.
const byText = (text) => `(() => { const el = [...document.querySelectorAll("h1,h2,h3,h4,div,span,p")].find((e) => e.children.length === 0 && e.textContent.trim().toUpperCase() === ${JSON.stringify(text.toUpperCase())}); if (!el) return null; el.setAttribute("data-demo", ${JSON.stringify(text)}); return true; })()`;

async function to(d, text, ms) {
  if (!(await d.evaluate(byText(text)))) throw new Error(`heading not found: ${text}`);
  await d.scrollTo(`[data-demo="${text}"]`, ms, 90);
}

export default async function gitpr(studio) {
  const d = await studio.open({ width: 1440, height: 900 });
  await d.goto(URL, 6000);
  await d.record();
  await d.wait(2000);
  await to(d, "Architecture & Parameters", 2200);
  await d.wait(2200);
  await to(d, "Important API Endpoints", 1800);
  await d.wait(1800);
  await to(d, "Model Evaluation & Comparison", 2000);
  await d.wait(1200);
  await d.shot(`${OUT}/02.jpg`);
  await d.move(330, 520, 900);
  await d.move(1050, 520, 1200);
  await d.wait(900);
  await d.scroll(560, 1800);
  await d.wait(600);
  await d.move(250, 400, 700);
  await d.move(420, 380, 700);
  await d.move(560, 420, 700);
  await d.wait(1200);
  await d.shot(`${OUT}/03.jpg`);
  await d.scroll(700, 2000);
  await d.wait(2500);
  await d.stop();
  await studio.encode([d], `${OUT}/demo.mp4`);
}
