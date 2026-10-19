// Google Docs Mini: two signed-in accounts editing one document at once,
// recorded side by side.
//
// Sign-in is done by a person, once, never by this script:
//   GDM_SETUP=1 node scripts/record-demo.mjs googledocsmini
// opens two Edge windows on separate saved profiles. Sign into a different
// account in each, put both in the same organisation, switch both to it, and
// create a document there (the liveblocks-auth route only admits the owner or
// members of the document's organisation). Close both windows when done.
// Then record with that document's URL:
//   GDM_DOC=https://google-docs-mini.vercel.app/documents/<id> node scripts/record-demo.mjs googledocsmini

import { join } from "node:path";

const SITE = "https://google-docs-mini.vercel.app/";
const OUT = "public/assets/projects/googleDocsClone";
const PROFILES = process.env.GDM_PROFILES ?? "D:/dev-tools/demo-profiles";
const EDITOR = ".ProseMirror";
const signedIn = `Boolean(window.Clerk && window.Clerk.user)`;

const A_TEXT = "Meeting notes, 19 Oct\nThe real-time layer is Liveblocks; Convex stores the document.\n";
const B_TEXT = "Action items: ship the demo, then write the README. ";

async function setup(studio) {
  const [a, b] = await Promise.all(["a", "b"].map((p) => studio.open({ width: 900, height: 1000, headless: false, profile: join(PROFILES, `gdm-${p}`) })));
  await Promise.all([a.goto(SITE, 1000), b.goto(SITE, 1000)]);
  console.log("Sign into a different account in each window. Waiting up to 15 minutes…");
  await Promise.all([a.waitFor(signedIn, 15 * 60000), b.waitFor(signedIn, 15 * 60000)]);
  console.log("Both signed in. Put both accounts in one organisation, create a document in it, then close the windows.");
  await a.wait(5 * 60000);
}

export default async function googledocsmini(studio) {
  if (process.env.GDM_SETUP) return setup(studio);
  const doc = process.env.GDM_DOC;
  if (!doc) throw new Error("set GDM_DOC to the shared document URL (see the header of this file)");

  const [a, b] = await Promise.all(["a", "b"].map((p) => studio.open({ width: 880, height: 1100, profile: join(PROFILES, `gdm-${p}`) })));
  await Promise.all([a.goto(doc, 6000), b.goto(doc, 6000)]);
  for (const d of [a, b]) {
    if (!(await d.evaluate(signedIn))) throw new Error("a profile is not signed in; rerun with GDM_SETUP=1");
    await d.waitFor(`Boolean(document.querySelector(${JSON.stringify(EDITOR)}))`, 30000);
  }

  await Promise.all([a.record(), b.record()]);
  await a.wait(1500);
  await a.click(EDITOR);
  await a.key("End", "End", 35, 2); // Ctrl+End: start at the end of the document
  await b.click(EDITOR);
  await b.key("Home", "Home", 36, 2); // Ctrl+Home: the other account starts at the top
  await a.wait(800);
  // Both type at the same time, each sees the other's cursor and text arrive.
  await Promise.all([a.type(A_TEXT, 11), b.wait(1200).then(() => b.type(B_TEXT, 9))]);
  await a.wait(2500);
  await a.shot(`${OUT}/02.jpg`);
  await b.shot(`${OUT}/03.jpg`);
  await Promise.all([a.stop(), b.stop()]);
  await studio.encode([a, b], `${OUT}/demo.mp4`);
}
