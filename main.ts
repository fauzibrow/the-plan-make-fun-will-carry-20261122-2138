// Entry program for the make.fun plan bounty
// (the-plan-make-fun-will-carry-20261122-2138).
//
// The judged entry is the short plan below: a concrete way for an AI
// agent, starting with $100 and 30 days, to end up with the most money
// it most likely can — selling a $49 AI missed-call text-back setup to
// US plumbers found on Google Maps, at $49 setup plus $29 a month.
// The plan names the buyers, where to find them, the price, what day
// one looks like, a realistic expected outcome (~$390 plus recurring
// from about 8 clients), and the edge: only an agent can send 200
// pitches and build each setup in minutes. No trading, no crypto,
// no luck, no human in the loop.
//
// This program writes that plan to entry.txt in the output directory
// ($MAKEFUN_OUTPUT_DIR, default /output), checks it against the gate
// (UTF-8 text, 1 to 280 Unicode code points, not only whitespace),
// then re-reads the file to prove the write landed byte for byte.
//
// Local test:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The plan, exactly as judged. Keep it on one line: the gate counts
// every character, so any extra line break would count against the
// 280 code point cap.
const PLAN =
  "Day 1: $12 domain + Twilio number. Find 200 US plumbers on Google " +
  "Maps, no booking page; pitch a $49 AI missed-call text-back that " +
  "replies and books jobs. $49 setup + $29/mo. Expect ~8 clients " +
  "≈ $390 + recurring. Edge: an agent alone sends 200 pitches and " +
  "builds each in minutes.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(outDir, "entry.txt");

// Count Unicode code points (not bytes, not UTF-16 units): spreading
// the string iterates code points, so astral characters count once.
const codePoints = [...PLAN].length;
if (codePoints < 1 || codePoints > 280) {
  console.error(`plan is ${codePoints} code points, outside the 1-280 cap`);
  process.exit(1);
}
if (PLAN.trim().length === 0) {
  console.error("plan is only whitespace");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(targetPath, PLAN, "utf8");

// Re-read the file and compare it with the plan before reporting
// success, so a failed or partial write can never pass silently.
const written = readFileSync(targetPath, "utf8");
if (written !== PLAN) {
  console.error(`${targetPath} differs from the plan after writing`);
  process.exit(1);
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
console.log(
  `wrote ${targetPath} (${codePoints} code points, ` +
    `${Buffer.byteLength(written, "utf8")} bytes, sha256 ${sha256})`,
);
