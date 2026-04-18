#!/usr/bin/env node
/**
 * Copy standalone HTML content + PDF from Portfolios/ into public/.
 *
 * Why a script instead of committing public/?
 *   - Single source of truth: Portfolios/ holds the authored content.
 *   - Keeps public/ generated (gitignored) so we never have to sync two trees.
 *
 * While copying, this script also:
 *   - Replaces each page's inline site bar with a shared template so every
 *     page shares the same Case Studies hover dropdown + mobile hamburger
 *   - Publishes src/styles/tokens.css to public/tokens.css and injects a
 *     matching <link> into each standalone page, so both the Astro layer
 *     and the PRD/CV pages can pull from a single canonical token file
 */
import { mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'Portfolios');
const CASE_DEST = join(ROOT, 'public', 'case-studies');
const PORTFOLIO_DEST = join(ROOT, 'public', 'portfolio');
const TOKENS_SRC = join(ROOT, 'src', 'styles', 'tokens.css');
const TOKENS_DEST = join(ROOT, 'public', 'tokens.css');

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
const TOKENS_LINK_MARKER = '<!-- canonical-tokens-link -->';
const TOKENS_LINK = `${TOKENS_LINK_MARKER}<link rel="stylesheet" href="${BASE}tokens.css">`;

/**
 * Build the shared site bar HTML (styles + markup) for standalone pages.
 * `active` marks the current page so the matching link highlights.
 * Below 720px the inline pill flips into a full-height hamburger overlay
 * with a tiny inline script to toggle it — keeps parity with Base.astro.
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

/* Hamburger toggle — hidden above 720px */
.site-bar-toggle { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 40px; height: 40px; padding: 0; background: none; border: 0; cursor: pointer; border-radius: 10px; transition: background 0.15s ease; }
.site-bar-toggle:hover { background: rgba(255,255,255,0.06); }
.site-bar-toggle span { display: block; width: 22px; height: 2px; margin: 0 auto; background: #f4f4f5; border-radius: 2px; transition: transform 0.25s ease, opacity 0.15s ease; }
.site-bar-toggle[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.site-bar-toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.site-bar-toggle[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 720px) {
  .site-bar-menu, .site-bar-chev { display: none; }
  .site-bar-toggle { display: flex; }

  .site-bar-nav {
    position: fixed;
    inset: 0;
    z-index: 190;
    flex-direction: column;
    gap: 0;
    align-items: stretch;
    padding: clamp(4.5rem, 14vw, 6rem) 1.5rem 2.5rem;
    background: #0a0a0b;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-8px);
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  .site-bar-nav[data-open] { opacity: 1; pointer-events: auto; transform: translateY(0); }

  .site-bar-nav > a, .site-bar-nav .site-bar-trigger {
    font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; color: #f4f4f5;
    padding: 1.15rem 0; border-radius: 0;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: space-between;
    background: transparent;
  }
  .site-bar-nav > a::after, .site-bar-nav .site-bar-trigger::after {
    content: "↗"; font-size: 1rem; font-weight: 500; color: #71717a; margin-left: 0.75rem;
  }
  .site-bar-nav > a.is-active::after, .site-bar-nav .site-bar-trigger.is-active::after { color: #818cf8; }
  .site-bar-dropdown { display: contents; }
}
</style>
<div class="site-bar">
  <div class="site-bar-inner">
    <a class="site-bar-brand" href="${BASE}">daeho-choi<span>.</span></a>
    <button class="site-bar-toggle" type="button" aria-controls="site-bar-nav" aria-expanded="false" aria-label="메뉴 열기">
      <span></span><span></span><span></span>
    </button>
    <nav id="site-bar-nav" class="site-bar-nav">
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
<script>
(function(){
  var btn = document.querySelector('.site-bar-toggle');
  var nav = document.getElementById('site-bar-nav');
  if (!btn || !nav) return;
  function close(){ nav.removeAttribute('data-open'); btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','메뉴 열기'); document.body.style.overflow=''; }
  function open(){ nav.setAttribute('data-open',''); btn.setAttribute('aria-expanded','true'); btn.setAttribute('aria-label','메뉴 닫기'); document.body.style.overflow='hidden'; }
  btn.addEventListener('click', function(){ nav.hasAttribute('data-open') ? close() : open(); });
  nav.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('a')) close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && nav.hasAttribute('data-open')) close(); });
})();
</script>
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

/**
 * Add a <link> to the canonical tokens stylesheet just before the
 * closing </head> tag so standalone pages can consume the same design
 * tokens Astro does. Idempotent via a marker comment.
 */
function injectTokensLink(html) {
  if (html.includes(TOKENS_LINK_MARKER)) return html;
  return html.replace(/<\/head>/i, `  ${TOKENS_LINK}\n</head>`);
}

// --- Publish canonical tokens to public/ ---
await mkdir(dirname(TOKENS_DEST), { recursive: true });
await copyFile(TOKENS_SRC, TOKENS_DEST);
console.log(`copied src/styles/tokens.css -> public/tokens.css`);

// --- HTML: case studies + portfolio one-pager ---
await rm(CASE_DEST, { recursive: true, force: true });
await rm(PORTFOLIO_DEST, { recursive: true, force: true });

for (const { from, to, active } of htmlTargets) {
  const src = join(SRC, from);
  await mkdir(dirname(to), { recursive: true });
  const raw = await readFile(src, 'utf8');
  const withBar = injectSiteBar(raw, { active });
  const withTokens = injectTokensLink(withBar);
  await writeFile(to, withTokens, 'utf8');
  console.log(`copied ${from} -> ${to.replace(ROOT + '/', '')}`);
}

// --- binary assets (PDF) ---
for (const { from, to } of binaryTargets) {
  await mkdir(dirname(to), { recursive: true });
  await copyFile(join(SRC, from), to);
  console.log(`copied ${from} -> ${to.replace(ROOT + '/', '')}`);
}

console.log(
  `done: ${htmlTargets.length} HTML pages + ${binaryTargets.length} binary file(s) + tokens.css placed under public/`,
);
