// Validates every post in src/content/blogs before a build does it the slow way:
// frontmatter keys present, date parseable, and the body compiles as MDX
// (a stray "{" or "<" in prose breaks the page).
//   node scripts/check-blogs.mjs

import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../src/content/blogs/", import.meta.url);
const REQUIRED = ["title", "date", "excerpt", "category", "readTime"];
let failed = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const { data, content } = matter(readFileSync(new URL(file, dir), "utf8"));
  const problems = REQUIRED.filter((k) => !data[k]).map((k) => `missing ${k}`);
  if (data.date && Number.isNaN(Date.parse(data.date))) problems.push(`bad date ${data.date}`);
  try {
    await compile(content);
  } catch (e) {
    problems.push(`MDX: ${e.message.split("\n")[0]}`);
  }
  if (problems.length) {
    failed++;
    console.log(`FAIL ${file}: ${problems.join("; ")}`);
  } else {
    console.log(`ok   ${file}  ${data.date}  ${data.category}  ${data.readTime}`);
  }
}

if (failed) process.exit(1);
