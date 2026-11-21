// Hand-in program for "Twins of Mosslight", a spot-the-difference game.
//
// The game itself is plain static files under game/ (open game/index.html in
// a desktop browser, no build step, no network). This program's only job is
// to hand the entry in: it mirrors game/ and screenshots/ into the output
// directory and writes dossier.json there with buildDossier from the
// vendored make.fun library, exactly the summary the scorer rebuilds and
// compares byte for byte.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader MAKEFUN_OUTPUT_DIR is unset and the output is /output.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(fromName: string, toName: string): void {
  const from = join(repoDir, fromName);
  const to = join(outputDir, toName);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyTree('game', 'game');
copyTree('screenshots', 'screenshots');

// The limits below are the scorer's own caps for this bounty: they only make
// buildDossier refuse early what the sealed gate would refuse anyway.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
