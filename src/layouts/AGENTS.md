<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-17 | Updated: 2026-04-17 -->

# src/layouts

## Purpose
Astro 페이지가 공통으로 감싸는 **HTML 셸**. 사이트 헤더/풋터, `<head>` 메타(OG/canonical/theme-color), 폰트·전역 CSS import가 한 곳에 모인다. 모든 `src/pages/*.astro`는 이 레이아웃을 통해 렌더된다.

## Key Files
| File | Description |
|------|-------------|
| `Base.astro` | 단일 레이아웃. `title` / `description` props를 받아 `<head>`를 구성하고, Pretendard(`pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css`)와 `../styles/global.css`를 최상단에서 import. `import.meta.env.BASE_URL`(`/prjt-blog/`)을 기준으로 nav 링크 prefix. 푸터에 GitHub 링크 + 저작년도 표시. |

## Subdirectories
없음.

## For AI Agents

### Working In This Directory
- **폰트/전역 CSS import는 `Base.astro`에서만** 한다. 페이지에서 중복 import 금지(번들 중복 + FOUC 위험).
- 새 레이아웃이 정말 필요한 경우에만 추가(예: 케이스 스터디 MDX용 `Article.astro`). 단, 현재 케이스 스터디와 포트폴리오는 `public/`의 **정적 HTML**이라 Astro 레이아웃을 거치지 않는다 — 이 분기를 깨지 말 것.
- nav 항목(`Home` / `Portfolio` / `About`)을 수정할 때는 두 군데를 맞춰야 한다:
  1. `src/layouts/Base.astro` (Astro 라우트용)
  2. `scripts/convert-pdf.mjs`의 `renderSectionHtml` / `renderIndexHtml` 내부 헤더 마크업 (`/portfolio/` 정적 페이지용)
  불일치하면 포트폴리오 섹션 페이지에서만 네비가 달라진다.
- `canonical`은 `Astro.site`가 있어야 절대경로로 찍힌다. `astro.config.mjs`의 `site` 값에 의존하므로 site 변경 시 빌드 재검증 필요.
- `lang="ko"` 고정. 다국어 계획이 생기면 props로 노출하기 전에 라우팅 전략부터 설계.

### Testing Requirements
- `npm run dev`로 `/prjt-blog/`, `/prjt-blog/about/` 로딩 → 헤더/푸터 · 폰트(Pretendard) · 다크 배경이 보이는지 육안 확인.
- 빌드 후 `dist/prjt-blog/index.html`의 `<link rel="canonical">`이 `https://daeho-choi.github.io/prjt-blog/...` 절대경로인지 확인.

### Common Patterns
- 페이지 사용 예:
  ```astro
  ---
  import Base from '../layouts/Base.astro';
  ---
  <Base title="..." description="...">
    <section class="hero">...</section>
  </Base>
  ```
- 내부 링크는 `${base}foo/` (trailing slash). `astro.config.mjs`가 `trailingSlash: 'ignore'`라 엄격하지 않지만, 현재 코드는 slash 포함으로 통일되어 있다.

## Dependencies

### Internal
- `../styles/global.css` — 디자인 토큰과 `.hero` / `.grid` / `.card` / `.prose` 유틸.

### External
- `pretendard` (npm) — Variable 다이내믹 서브셋 CSS.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
