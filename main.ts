// Fortune Cookie for the Liquidated Trader — entry program.
// Writes one original fortune-cookie line for a crypto trader who
// has just been liquidated to /output/entry.txt (UTF-8, one line).
// Node 22, standard library only, no network, no input files.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE: string = join(OUT_DIR, "entry.txt");

function buildFortune(): string {
  const opening: string = "Trader, the stars promise you a great recovery.";
  const turn: string = "They meant your sense of humour, not your balance.";
  return `${opening} ${turn}`;
}

function checkLine(line: string): void {
  const size: number = [...line].length;
  if (size < 1 || size > 160) {
    throw new Error(`fortune is ${size} characters, must be 1-160`);
  }
  const words: string[] = line.split(/\s+/).filter((w) => w.length > 0);
  if (words.length > 20) {
    throw new Error(`fortune is ${words.length} words, must be at most 20`);
  }
  if (line.includes("\n") || line.trim().length === 0) {
    throw new Error("fortune must be one non-blank line");
  }
  if (line !== line.trim()) {
    throw new Error("fortune must not start or end with white space");
  }
}

const fortune: string = buildFortune();
checkLine(fortune);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, fortune, { encoding: "utf8", mode: 0o644 });
chmodSync(OUT_FILE, 0o644);

const onDisk: string = readFileSync(OUT_FILE, "utf8");
if (onDisk !== fortune) {
  throw new Error("entry.txt on disk differs from the checked fortune");
}
console.log(`wrote ${[...fortune].length} characters to ${OUT_FILE}`);
console.log(fortune);
