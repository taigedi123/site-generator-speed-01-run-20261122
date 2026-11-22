// Entry driver (program/v1, node22): reads every case from /input/cases.json,
// answers each one alone with run() from solve.js, and writes /output/answers.json.
// V8 flags: incremental marking off (as the house baseline runs) and the
// optimizing compiler off: this is a single cold run, and TurboFan's background
// compilation costs more CPU than its faster code saves here.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setFlagsFromString } from 'node:v8';

setFlagsFromString('--no-incremental-marking --no-opt');

/** solve.js, imported by its URL (a .js module carries no types) and typed by its contract. */
const { run } = (await import(new URL('./solve.js', import.meta.url).href)) as { run: (input: unknown) => unknown };

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const cases = JSON.parse(readFileSync(join(INPUT_DIR, 'cases.json'), 'utf8')) as { id: string; input: unknown }[];
const parts: string[] = ['['];
for (let i = 0; i < cases.length; i++) {
  if (i > 0) parts.push(',');
  parts.push(JSON.stringify(run(cases[i].input)));
}
parts.push(']');
writeFileSync(join(OUTPUT_DIR, 'answers.json'), parts.join(''));
