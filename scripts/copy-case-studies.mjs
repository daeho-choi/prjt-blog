#!/usr/bin/env node
/**
 * Copy standalone HTML content + PDF from Portfolios/ into public/.
 *
 * Why a script instead of committing public/?
 *   - Single source of truth: Portfolios/ holds the authored content.
 *   - Keeps public/ generated (gitignored) so we never have to sync two trees.
 *
 * While copying, the shared site bar (blog-level navigation) is replaced
 * with a standard template so every page — Astro routes or standalone PRDs —
 * shares the same Case Studies hover dropdown.
 */
import { mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'Portfolios');
const CASE_DEST = join(ROOT, 'public', 'case-studies');
const PORTFOLIO_DEST = join(ROOT, 'public', 'portfolio');

const caseStudies = JSON.parse(
  await readFile(join(ROOT, 'src', 'data', 'case-studies.json'), 'utf8'),
);

const htmlTargets = [
  { from: 'prd_Tikit.html', to: join(CASE_DEST, 'tikit', 'index.html'), active: 'cases' },
  { from: 'prd_boombim.html', to: join(CASE_DEST, 'boombim', 'index.html'), active: 'cases' },
  { from: 'prd_lokit.html', to: join(CASE_DEST, 'lokit', 'index.html'), active: 'cases' },
  { from: 'pm_portfolio.html', to: join(PORTFOLIO_DEST, 'index.html'), active: 'cv' },
];

const binaryTargets = [
  { from: 'PM_Portflio.pdf', to: join(PORTFOLIO_DEST, 'PM_Portfolio.pdf') },
];

const BASE = '/prjt-blog/';

/**
 * Build the shared site bar HTML (styles + markup) for standalone pages.
 * `active` marks the current page so the matching link highlights.
 */
function renderSiteBar({ active }) {
  const items = caseStudies
    .map(
      (cs) => `      <a class="site-bar-item" href="${BASE}case-studies/${cs.slug}/" style="--sb-accent:${cs.accent}" role="menuitem">
        <span class="site-bar-dot"></span>
        <span class="site-bar-text"><span class="site-bar-title">${cs.title}</span><span class="site-bar-sub">${cs.year}</span></span>
      </a>`,
    )
    .join('\n');

  const isActive = (key) => (active === key ? ' is-active' : '');

  return `<!-- ═════ SITE BAR (blog-level navigation) ═════ -->
<style>
.site-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: rgba(10,10,11,0.88); backdrop-filter: saturate(180%) blur(14px); -webkit-backdrop-filter: saturate(180%) blur(14px); border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
.site-bar-inner { max-width: 1100px; margin: 0 auto; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
.site-bar-brand { color: #fff; font-weight: 700; text-decoration: none; letter-spacing: -0.01em; }
.site-bar-brand span { color: #818CF8; }
.site-bar-nav { display: flex; gap: 4px; align-items: center; }
.site-bar-nav a { color: #a1a1aa; text-decoration: none; padding: 6px 12px; border-radius: 999px; transition: color 0.15s ease, background 0.15s ease; font-weight: 500; }
.site-bar-nav a:hover { color: #fff; background: rgba(255,255,255,0.06); }
.site-bar-nav a.is-active { color: #fff; background: rgba(129,140,248,0.18); }
.site-bar-dropdown { position: relative; }
.site-bar-trigger { display: inline-flex; align-items: center; gap: 4px; }
.site-bar-chev { opacity: 0.6; transition: transform 0.2s ease, opacity 0.2s ease; }
.site-bar-dropdown:hover .site-bar-chev,
.site-bar-dropdown:focus-within .site-bar-chev { transform: rotate(180deg); opacity: 1; }
.site-bar-menu { position: absolute; top: calc(100% + 4px); right: 0; min-width: 288px; padding: 8px; background: rgba(23,23,28,0.96); backdrop-filter: saturate(180%) blur(16px); -webkit-backdrop-filter: saturate(180%) blur(16px); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; box-shadow: 0 8px 24px -6px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 2px; opacity: 0; visibility: hidden; transform: translateY(-6px); transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease; }
.site-bar-dropdown::after { content: ""; position: absolute; top: 100%; left: 0; right: 0; height: 8px; }
.site-bar-dropdown:hover .site-bar-menu,
.site-bar-dropdown:focus-within .site-bar-menu { opacity: 1; visibility: visible; transform: translateY(0); }
.site-bar-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #a1a1aa; text-decoration: none; transition: background 0.15s ease, color 0.15s ease; }
.site-bar-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
.site-bar-dot { flex-shrink: 0; width: 8px; height: 8px; border-radius: 999px; background: var(--sb-accent, #818cf8); box-shadow: 0 0 8px var(--sb-accent, #818cf8); }
.site-bar-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.site-bar-title { color: #fff; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.site-bar-sub { font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace; font-size: 11px; letter-spacing: 0.1em; color: #71717a; text-transform: uppercase; }
.site-bar-all { margin-top: 4px; padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.06); border-radius: 0 0 10px 10px; color: #a1a1aa; font-size: 13px; text-align: right; text-decoration: none; }
.site-bar-all:hover { color: #818cf8; }
@media (max-width: 640px) { .site-bar-menu, .site-bar-chev { display: none; } }
</style>
<div class="site-bar">
  <div class="site-bar-inner">
    <a class="site-bar-brand" href="${BASE}">daeho-choi<span>.</span></a>
    <nav class="site-bar-nav">
      <a href="${BASE}"${isActive('home')}>Home</a>
      <div class="site-bar-dropdown">
        <a class="site-bar-trigger${isActive('cases') ? ' is-active' : ''}" href="${BASE}case-studies/" aria-haspopup="true">
          Case Studies
          <svg class="site-bar-chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <div class="site-bar-menu" role="menu">
${items}
          <a class="site-bar-all" href="${BASE}case-studies/" role="menuitem">All case studies →</a>
        </div>
      </div>
      <a href="${BASE}portfolio/"${isActive('cv') ? ' class="is-active"' : ''}>CV</a>
      <a href="${BASE}about/"${isActive('about') ? ' class="is-active"' : ''}>About</a>
    </nav>
  </div>
</div>
<!-- ═════ /SITE BAR ═════ -->`;
}

/**
 * Replace the legacy inline site bar (whose block starts with the
 * `SITE BAR (blog-level navigation)` comment and ends with its wrapper
 * `</div>`) with the shared dropdown-enabled template.
 *
 * Matches either:
 *   a) the new marker pair `<!-- SITE BAR -->` … `<!-- /SITE BAR -->`
 *   b) the legacy single-comment form followed by the fixed wrapper div
 */
function injectSiteBar(html, { active }) {
  const replacement = renderSiteBar({ active });

  // Prefer the paired-marker form when present.
  const paired = /<!--\s*═*\s*SITE BAR[^>]*-->[\s\S]*?<!--\s*═*\s*\/SITE BAR\s*═*\s*-->/;
  if (paired.test(html)) {
    return html.replace(paired, replacement);
  }

  // Legacy: starting comment + the fixed-position wrapper div that follows.
  const legacy = /<!--\s*═*\s*SITE BAR[^>]*-->\s*<div\s+style="position:\s*fixed[\s\S]*?<\/div>\s*<\/div>/;
  if (legacy.test(html)) {
    return html.replace(legacy, replacement);
  }

  console.warn('  ⚠ no site bar marker found — file left untouched');
  return html;
}

// --- HTML: case studies + portfolio one-pager ---
await rm(CASE_DEST, { recursive: true, force: true });
await rm(PORTFOLIO_DEST, { recursive: true, force: true });

for (const { from, to, active } of htmlTargets) {
  const src = join(SRC, from);
  await mkdir(dirname(to), { recursive: true });
  const raw = await readFile(src, 'utf8');
  const transformed = injectSiteBar(raw, { active });
  await writeFile(to, transformed, 'utf8');
  console.log(`copied ${from} -> ${to.replace(ROOT + '/', '')}`);
}

// --- binary assets (PDF) ---
for (const { from, to } of binaryTargets) {
  await mkdir(dirname(to), { recursive: true });
  await copyFile(join(SRC, from), to);
  console.log(`copied ${from} -> ${to.replace(ROOT + '/', '')}`);
}

console.log(
  `done: ${htmlTargets.length} HTML pages + ${binaryTargets.length} binary file(s) placed under public/`,
);
