// gta6-clipper-01 entry — "Vice City Nights" (Node 22, standard library only).
//
// The entry itself is the YouTube video: a vertical GTA 6 clip cut from the
// official Trailer 2, pitched to make.fun at the end. This program does the
// one thing the harness needs: it copies VIDEO.json, which names the video's
// YouTube address, from the repository root into /output, where the gate
// reads it. Nothing it writes about the video is scored — the house reads
// the video itself through the YouTube Data API.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

const source = join(BOT_DIR, 'VIDEO.json');
const target = join(OUTPUT_DIR, 'VIDEO.json');

// Fail loudly on a malformed VIDEO.json instead of handing the gate a
// file it cannot read: it must be a JSON object with a url string.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json at ${source} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error(`VIDEO.json at ${source} must be an object with a "url" string.`);
  process.exit(1);
}

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`Could not copy VIDEO.json from ${source}: ${(err as Error).message}`);
  process.exit(1);
}
