// The judged plan for make.fun bounty the-plan-make-fun-will-carry-20261122-2138.
//
// The brief: an AI agent starts with $100 and 30 days and has to finish
// with as much money as it most likely can. This entry is the plan it
// would carry: sell a $49 AI missed-call text-back setup to US plumbers
// found on Google Maps — $49 setup + $29/mo, about 8 clients, roughly
// $390 plus recurring revenue. The edge is scale only an agent has:
// it can send 200 pitches and build each setup in minutes. No trading,
// no crypto, no luck, no human in the loop.
//
// This file keeps the plan as one line and drops it into entry.txt in
// the output directory. It refuses to write a plan that breaks the
// gate (1–280 Unicode code points, not only whitespace), then reads
// the file back to prove the write landed byte for byte.
//
// Local test:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JUDGED_PLAN =
  "Day 1: $12 domain + Twilio number. Find 200 US plumbers on Google Maps, no booking page; pitch a $49 AI missed-call text-back that replies and books jobs. $49 setup + $29/mo. Expect ~8 clients ≈ $390 + recurring. Edge: an agent alone sends 200 pitches and builds each in minutes.";

const CAP = 280;

function codePointCount(text: string): number {
  return [...text].length;
}

function sha256Hex(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

// Returns a human-readable reason when the plan breaks the gate,
// or null when it passes.
function gateProblem(text: string): string | null {
  const points = codePointCount(text);
  if (points < 1) return "empty plan";
  if (points > CAP) return `plan is ${points} code points, over the ${CAP} cap`;
  if (text.trim().length === 0) return "plan is whitespace only";
  const shape = shapeProblem(text);
  if (shape !== null) return shape;
  return null;
}

// Catches invisible budget-eaters: leading/trailing whitespace,
// control characters (newline, tab, CR, ...), and double spaces.
function shapeProblem(text: string): string | null {
  if (text !== text.trim()) return "leading or trailing whitespace";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      return `control character U+${code.toString(16).padStart(4, "0")}`;
    }
  }
  if (text.includes("  ")) return "double space";
  return null;
}

// --verify: prove a checkout's entry.txt holds the judged plan
// without touching it. Exit codes: 0 match, 2 file missing,
// 3 content differs, 4 length outside the cap, 5 whitespace only,
// 6 shape problem.
function verifyEntry(target: string): number {
  let onDisk: Buffer;
  try {
    onDisk = readFileSync(target);
  } catch {
    console.error(`verify failed: no entry at ${target}`);
    return 2;
  }
  const text = onDisk.toString("utf8");
  const points = codePointCount(text);
  if (points < 1 || points > CAP) {
    console.error(`verify failed: entry is ${points} code points, cap is ${CAP}`);
    return 4;
  }
  if (text.trim().length === 0) {
    console.error("verify failed: entry is whitespace only");
    return 5;
  }
  if (!onDisk.equals(Buffer.from(JUDGED_PLAN, "utf8"))) {
    console.error(`verify failed: ${target} does not match the plan`);
    return 3;
  }
  const shape = shapeProblem(text);
  if (shape !== null) {
    console.error(`verify failed: ${shape}`);
    return 6;
  }
  console.log(
    `verify OK: ${target} — ${points} code points, ${onDisk.length} bytes, sha256 ${sha256Hex(onDisk)}`,
  );
  return 0;
}

function main(): number {
  if (process.argv.includes("--verify")) {
    const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
    return verifyEntry(join(outDir, "entry.txt"));
  }

  const problem = gateProblem(JUDGED_PLAN);
  if (problem !== null) {
    console.error(`gate failed: ${problem}`);
    return 1;
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  const payload = Buffer.from(JUDGED_PLAN, "utf8");
  writeFileSync(target, payload);

  const roundTrip = readFileSync(target);
  if (!roundTrip.equals(payload)) {
    console.error(`write check failed: ${target} does not match the plan`);
    return 1;
  }

  console.log(
    `entry written: ${target} — ${codePointCount(JUDGED_PLAN)} code points, ${payload.length} bytes, sha256 ${sha256Hex(payload)}`,
  );
  return 0;
}

process.exit(main());
