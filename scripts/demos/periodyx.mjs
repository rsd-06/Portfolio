// PeriodyX on its Hugging Face Space: run the pipeline on a synthetic planet
// transit, then on an eclipsing binary, and show the verdict and the plot.

const URL = "https://rsd-06-periodyx-exoplanet-pipeline.hf.space/";
const OUT = "public/assets/projects/periodyx";
const visible = (id) => `!document.getElementById(${JSON.stringify(id)}).classList.contains("hidden")`;

async function run(d) {
  await d.click("#run-btn");
  await d.wait(1500);
  await d.compress(() => d.waitFor(visible("result-state"), 180000), 2.5);
  await d.wait(1200);
}

export default async function periodyx(studio) {
  const d = await studio.open({ width: 1440, height: 900 });
  await d.goto(URL, 4000);
  await d.record();
  await d.wait(1500);
  await d.scrollTo("#input-panel", 1600, 100);
  await d.wait(600);
  await d.hover("#synth_depth_pct", 700);
  await d.hover("#synth_period", 500);
  await d.wait(400);
  await run(d);
  await d.hover("#verdict-banner", 700);
  await d.wait(1500);
  await d.shot(`${OUT}/05.jpg`);
  await d.scrollTo("#plot-panel", 1800, 100);
  await d.wait(2500);
  await d.shot(`${OUT}/06.jpg`);

  await d.scrollTo("#input-panel", 1600, 100);
  await d.click("#case-select");
  await d.key("Escape", "Escape", 27);
  const picked = await d.evaluate(`(() => { const s = document.getElementById("case-select"); const o = [...s.options].find((o) => /eclips/i.test(o.text)); if (!o) return null; s.value = o.value; s.dispatchEvent(new Event("change", { bubbles: true })); return o.text; })()`);
  if (!picked) throw new Error("no eclipsing-binary case in the select");
  await d.wait(900);
  await run(d);
  await d.hover("#verdict-banner", 700);
  await d.wait(2500);
  await d.stop();
  await studio.encode([d], `${OUT}/demo.mp4`);
}
