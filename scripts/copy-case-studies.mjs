#!/usr/bin/env node
/**
 * Copy standalone case-study HTML files from Portfolios/ into public/case-studies/.
 *
 * Why a script instead of committing public/case-studies/?
 *   - Single source of truth: Portfolios/ holds the authored content.
 *   - Keeps public/ generated (gitignored) so we never have to sync two trees.
 *
 * Mapping:
 *   Portfolios/prd_Tikit.html   -> public/case-studies/tikit/index.html
 *   Portfolios/prd_boombim.html -> public/case-studies/boombim/index.html
 *   Portfolios/prd_lokit.html   -> public/case-studies/lokit/index.html
 */
import { mkdir, copyFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'Portfolios');
const DEST = join(ROOT, 'public', 'case-studies');

const mapping = [
  { from: 'prd_Tikit.html', slug: 'tikit' },
  { from: 'prd_boombim.html', slug: 'boombim' },
  { from: 'prd_lokit.html', slug: 'lokit' },
];

await rm(DEST, { recursive: true, force: true });

for (const { from, slug } of mapping) {
  const src = join(SRC, from);
  const dst = join(DEST, slug, 'index.html');
  await mkdir(dirname(dst), { recursive: true });
  await copyFile(src, dst);
  console.log(`copied ${from} -> case-studies/${slug}/index.html`);
}

console.log(`done: ${mapping.length} case studies placed under public/case-studies/`);
