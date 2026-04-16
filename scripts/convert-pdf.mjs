#!/usr/bin/env node
/**
 * Convert Portfolios/PM_Portflio.pdf -> structured Markdown -> per-section HTML.
 *
 * Pipeline:
 *   1. @opendataloader/pdf  PDF → Markdown (JVM under the hood; needs Java 11+)
 *   2. Split Markdown on `##` headings → per-section fragments
 *   3. marked  Markdown → HTML
 *   4. Wrap each section in a minimal dark Pretendard page
 *   5. Emit public/portfolio/index.html listing all sections
 *
 * Output:
 *   build/pdf/…                  (intermediate Markdown + JSON, gitignored)
 *   public/portfolio/NN-slug.html
 *   public/portfolio/index.html
 */
import { mkdir, readFile, writeFile, readdir, rm, access } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// --- Java runtime auto-detection ---
// opendataloader-pdf spawns a JVM. If the caller didn't set JAVA_HOME (local dev
// on macOS where openjdk@21 is keg-only), try well-known Homebrew paths before
// importing the SDK so the JVM can be located.
async function ensureJavaHome() {
  if (process.env.JAVA_HOME) return;
  const candidates = [
    '/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home',
    '/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home',
    '/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home',
    '/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home',
  ];
  for (const c of candidates) {
    try {
      await access(c);
      process.env.JAVA_HOME = c;
      process.env.PATH = `${c}/bin:${process.env.PATH ?? ''}`;
      console.log(`[convert-pdf] JAVA_HOME auto-detected: ${c}`);
      return;
    } catch {
      /* try next */
    }
  }
  console.warn(
    '[convert-pdf] JAVA_HOME not set and no known Homebrew/Temurin JDK found. ' +
      'The JVM call will likely fail. Install JDK 11+ and/or export JAVA_HOME.'
  );
}
await ensureJavaHome();

// Dynamic imports so the SDK loads AFTER JAVA_HOME is configured.
const { convert } = await import('@opendataloader/pdf');
const { marked } = await import('marked');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PDF_PATH = join(ROOT, 'Portfolios', 'PM_Portflio.pdf');
const BUILD_DIR = join(ROOT, 'build', 'pdf');
const OUT_DIR = join(ROOT, 'public', 'portfolio');

// --- utils ---
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60) || 'section';

const pad = (n) => String(n).padStart(2, '0');

const escapeHtml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Split markdown into sections at every H2 (`## …`).
// Anything before the first H2 is the "intro" section (labelled from the doc H1 if present).
function splitSections(md) {
  const lines = md.split(/\r?\n/);
  const sections = [];
  let current = null;
  let docTitle = null;

  for (const line of lines) {
    const h1 = /^#\s+(.+?)\s*$/.exec(line);
    const h2 = /^##\s+(.+?)\s*$/.exec(line);

    if (h1 && !docTitle) {
      docTitle = h1[1].trim();
      continue; // don't include doc title in any section body
    }

    if (h2) {
      if (current) sections.push(current);
      current = { title: h2[1].trim(), body: '' };
      continue;
    }

    if (!current) {
      current = { title: docTitle || 'Overview', body: '' };
    }
    current.body += line + '\n';
  }

  if (current) sections.push(current);
  return { docTitle: docTitle || 'PM Portfolio', sections };
}

function renderSectionHtml({ title, bodyHtml, prev, next, docTitle, base }) {
  const prevLink = prev
    ? `<a href="${base}portfolio/${prev.filename}" rel="prev">← ${escapeHtml(prev.title)}</a>`
    : '';
  const nextLink = next
    ? `<a href="${base}portfolio/${next.filename}" rel="next">${escapeHtml(next.title)} →</a>`
    : '';

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} · ${escapeHtml(docTitle)}</title>
<meta name="theme-color" content="#0a0a0b" />
<link rel="stylesheet" href="${base}portfolio/styles.css" />
</head>
<body>
<header class="site-header">
  <a class="brand" href="${base}">daeho-choi</a>
  <nav>
    <a href="${base}">Home</a>
    <a href="${base}portfolio/">Portfolio</a>
    <a href="${base}about/">About</a>
  </nav>
</header>
<main>
  <article class="prose">
    <p class="breadcrumb"><a href="${base}portfolio/">← ${escapeHtml(docTitle)}</a></p>
    <h1>${escapeHtml(title)}</h1>
    ${bodyHtml}
  </article>
  <nav class="pager">
    ${prevLink}
    ${nextLink}
  </nav>
</main>
<footer class="site-footer">
  <small>© ${new Date().getFullYear()} daeho-choi</small>
</footer>
</body>
</html>`;
}

function renderIndexHtml({ docTitle, sections, base }) {
  const items = sections
    .map(
      (s, i) =>
        `<li><a href="${base}portfolio/${s.filename}"><span class="n">${pad(i + 1)}</span> ${escapeHtml(s.title)}</a></li>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(docTitle)} · daeho-choi</title>
<meta name="theme-color" content="#0a0a0b" />
<link rel="stylesheet" href="${base}portfolio/styles.css" />
</head>
<body>
<header class="site-header">
  <a class="brand" href="${base}">daeho-choi</a>
  <nav>
    <a href="${base}">Home</a>
    <a href="${base}portfolio/">Portfolio</a>
    <a href="${base}about/">About</a>
  </nav>
</header>
<main>
  <section class="hero">
    <h1>${escapeHtml(docTitle)}</h1>
    <p class="tagline">섹션별로 읽을 수 있도록 쪼개진 포트폴리오.</p>
  </section>
  <section>
    <ol class="toc">
      ${items}
    </ol>
  </section>
</main>
<footer class="site-footer">
  <small>© ${new Date().getFullYear()} daeho-choi</small>
</footer>
</body>
</html>`;
}

// Styles served alongside the rendered pages. Standalone copy so the generated
// pages don't depend on Astro's build pipeline for CSS (they're plain HTML in public/).
const PORTFOLIO_CSS = `:root{--bg:#0a0a0b;--bg-soft:#111113;--card:#16161a;--border:#26262b;--text:#f4f4f5;--text-muted:#a1a1aa;--text-dim:#71717a;--accent:#818cf8;--link:#c7d2fe;--radius:14px;--max:960px;color-scheme:dark}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{margin:0;background:var(--bg);color:var(--text);font-family:"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,system-ui,"Noto Sans KR",sans-serif;font-size:16px;line-height:1.7;min-height:100dvh;display:flex;flex-direction:column}
main{flex:1;max-width:var(--max);width:100%;margin:0 auto;padding:clamp(2rem,5vw,4rem) 1.25rem}
a{color:var(--link);text-decoration:none;transition:color .15s}
a:hover{color:var(--accent)}
h1,h2,h3{line-height:1.2;letter-spacing:-.02em;margin:0 0 .5em}
h1{font-size:clamp(2rem,4vw,3rem);font-weight:800;letter-spacing:-.03em}
h2{font-size:clamp(1.4rem,2.5vw,1.75rem);margin-top:2.5rem}
h3{font-size:1.125rem;margin-top:2rem}
p{color:var(--text);margin:0 0 1em}
.site-header{display:flex;align-items:center;justify-content:space-between;max-width:var(--max);width:100%;margin:0 auto;padding:1.25rem}
.site-header .brand{font-weight:700;color:var(--text);letter-spacing:-.01em}
.site-header nav{display:flex;gap:1.25rem;font-size:.9375rem}
.site-header nav a{color:var(--text-muted)}
.site-header nav a:hover{color:var(--text)}
.site-footer{border-top:1px solid var(--border);padding:1.5rem 1.25rem;text-align:center;color:var(--text-dim)}
.breadcrumb{color:var(--text-muted);font-size:.9375rem}
.hero{padding:clamp(1.5rem,4vw,3rem) 0}
.hero .tagline{color:var(--text-muted);font-size:1.0625rem;max-width:48ch}
.prose{max-width:72ch}
.prose p,.prose li{line-height:1.85}
.prose ul,.prose ol{padding-left:1.25rem}
.prose code{font-family:ui-monospace,"JetBrains Mono",Menlo,monospace;font-size:.875em;padding:.125em .375em;background:var(--bg-soft);border:1px solid var(--border);border-radius:6px}
.prose img{max-width:100%;height:auto;border-radius:var(--radius);border:1px solid var(--border)}
.prose blockquote{border-left:3px solid var(--accent);margin:1.5em 0;padding:.25em 0 .25em 1em;color:var(--text-muted)}
.prose hr{border:0;border-top:1px solid var(--border);margin:2.5rem 0}
.prose table{width:100%;border-collapse:collapse;margin:1.5em 0}
.prose th,.prose td{border:1px solid var(--border);padding:.5em .75em;text-align:left}
.prose th{background:var(--bg-soft)}
.toc{list-style:none;padding:0;margin:2rem 0;display:grid;gap:.5rem}
.toc li{}
.toc a{display:flex;gap:1rem;align-items:baseline;padding:1rem 1.25rem;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);transition:border-color .2s,transform .2s}
.toc a:hover{border-color:color-mix(in srgb,var(--accent) 60%,var(--border));transform:translateY(-2px)}
.toc .n{color:var(--accent);font-feature-settings:"tnum";font-weight:500;min-width:2ch}
.pager{display:flex;justify-content:space-between;gap:1rem;margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--border)}
.pager a{color:var(--text-muted)}
.pager a:hover{color:var(--text)}
`;

// --- main ---
async function main() {
  console.log(`[convert-pdf] input: ${PDF_PATH}`);

  await rm(BUILD_DIR, { recursive: true, force: true });
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(BUILD_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  // 1) PDF -> markdown (via opendataloader-pdf; internally spawns JVM)
  console.log('[convert-pdf] running opendataloader-pdf → markdown');
  await convert([PDF_PATH], {
    outputDir: BUILD_DIR,
    format: 'markdown,json',
    sanitize: true,
  });

  // opendataloader emits <stem>.md next to <stem>.json in outputDir
  const files = await readdir(BUILD_DIR);
  const mdFile = files.find((f) => f.endsWith('.md'));
  const jsonFile = files.find((f) => f.endsWith('.json'));
  if (!mdFile) {
    throw new Error(`No .md emitted by opendataloader in ${BUILD_DIR}`);
  }
  const md = await readFile(join(BUILD_DIR, mdFile), 'utf8');
  console.log(`[convert-pdf] markdown ready: ${mdFile} (${md.length} chars)`);

  // Prefer the PDF's own title metadata — opendataloader's H1 detection
  // sometimes latches onto a section heading rather than the real title.
  let metaTitle = null;
  if (jsonFile) {
    try {
      const meta = JSON.parse(await readFile(join(BUILD_DIR, jsonFile), 'utf8'));
      if (meta && typeof meta.title === 'string' && meta.title.trim()) {
        metaTitle = meta.title.trim();
      }
    } catch {
      /* metadata is optional */
    }
  }

  // 2) split on H2
  const { docTitle: h1Title, sections } = splitSections(md);
  const docTitle = metaTitle || h1Title;
  if (sections.length === 0) {
    throw new Error('No sections detected in markdown.');
  }

  // assign filenames
  const enriched = sections.map((s, i) => ({
    ...s,
    filename: `${pad(i + 1)}-${slugify(s.title)}.html`,
  }));

  console.log(`[convert-pdf] ${enriched.length} sections under "${docTitle}"`);

  const base = '/prjt-blog/';

  // 3) + 4) render each section
  for (let i = 0; i < enriched.length; i++) {
    const s = enriched[i];
    const bodyHtml = marked.parse(s.body.trim());
    const html = renderSectionHtml({
      title: s.title,
      bodyHtml,
      prev: enriched[i - 1] || null,
      next: enriched[i + 1] || null,
      docTitle,
      base,
    });
    await writeFile(join(OUT_DIR, s.filename), html, 'utf8');
    console.log(`  wrote ${s.filename}`);
  }

  // 5) index + styles
  await writeFile(join(OUT_DIR, 'index.html'), renderIndexHtml({ docTitle, sections: enriched, base }), 'utf8');
  await writeFile(join(OUT_DIR, 'styles.css'), PORTFOLIO_CSS, 'utf8');

  console.log(`[convert-pdf] done → ${OUT_DIR}`);
}

main().catch((err) => {
  console.error('[convert-pdf] failed:', err);
  process.exit(1);
});
