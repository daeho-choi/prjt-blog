#!/usr/bin/env node
/**
 * Copy standalone HTML content + PDF from Portfolios/ into public/.
 *
 * Why a script instead of committing public/?
 *   - Single source of truth: Portfolios/ holds the authored content.
 *   - Keeps public/ generated (gitignored) so we never have to sync two trees.
 *
 * Case studies (prd_*.html):
 *   Portfolios/prd_Tikit.html   -> public/case-studies/tikit/index.html
 *   Portfolios/prd_boombim.html -> public/case-studies/boombim/index.html
 *   Portfolios/prd_lokit.html   -> public/case-studies/lokit/index.html
 *
 * PM Portfolio (one-pager + downloadable PDF):
 *   Portfolios/pm_portfolio.html -> public/portfolio/index.html
 *   Portfolios/PM_Portflio.pdf   -> public/portfolio/PM_Portfolio.pdf   (typo fixed on copy)
 */
import { mkdir, copyFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'Portfolios');
const CASE_DEST = join(ROOT, 'public', 'case-studies');
const PORTFOLIO_DEST = join(ROOT, 'public', 'portfolio');

const caseStudies = [
  { from: 'prd_Tikit.html', slug: 'tikit' },
  { from: 'prd_boombim.html', slug: 'boombim' },
  { from: 'prd_lokit.html', slug: 'lokit' },
];

const portfolioFiles = [
  { from: 'pm_portfolio.html', to: 'index.html' },
  { from: 'PM_Portflio.pdf', to: 'PM_Portfolio.pdf' },
];

// --- case studies ---
await rm(CASE_DEST, { recursive: true, force: true });
for (const { from, slug } of caseStudies) {
  const src = join(SRC, from);
  const dst = join(CASE_DEST, slug, 'index.html');
  await mkdir(dirname(dst), { recursive: true });
  await copyFile(src, dst);
  console.log(`copied ${from} -> case-studies/${slug}/index.html`);
}

// --- PM portfolio ---
await rm(PORTFOLIO_DEST, { recursive: true, force: true });
await mkdir(PORTFOLIO_DEST, { recursive: true });
for (const { from, to } of portfolioFiles) {
  const src = join(SRC, from);
  const dst = join(PORTFOLIO_DEST, to);
  await copyFile(src, dst);
  console.log(`copied ${from} -> portfolio/${to}`);
}

console.log(
  `done: ${caseStudies.length} case studies + ${portfolioFiles.length} portfolio files placed under public/`
);
