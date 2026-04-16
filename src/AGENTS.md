<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-17 | Updated: 2026-04-17 -->

# src

## Purpose
Astro 애플리케이션 소스. 블로그의 **껍데기**(홈, About, 레이아웃)만 여기서 작성하며, 케이스 스터디와 PDF 포트폴리오는 `public/` 하위에 스크립트가 정적 HTML로 공급한다.

## Key Files
없음 (이 레벨에는 폴더만 있음).

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `layouts/` | 공통 `<html>` 셸 (`Base.astro`). |
| `pages/` | 파일 기반 라우트 (`index.astro`, `about.astro`). 새 페이지 추가 시 이 디렉터리에. |
| `styles/` | 전역 CSS와 토큰 (`global.css`). |

## For AI Agents

### Working In This Directory
- **라우트 구조** (base path `/prjt-blog/` 자동 prefix):
  - `src/pages/index.astro` → `/prjt-blog/`
  - `src/pages/about.astro` → `/prjt-blog/about/`
  - `/prjt-blog/case-studies/<slug>/` → `public/case-studies/<slug>/index.html` (Astro 라우트 아님, 정적 파일)
  - `/prjt-blog/portfolio/...` → `public/portfolio/*.html` (정적, `scripts/convert-pdf.mjs` 생성)
- **내부 링크 전부 `${import.meta.env.BASE_URL}`로 시작**. 하드코딩된 `/path/`는 GH Pages(`/prjt-blog/` 하위)에서 404.
- 새 Astro 페이지를 추가할 때 `Base.astro`로 감싸고 `<section>` 기반으로 구조화. Pretendard는 Base에서 이미 import — 페이지별로 다시 import 금지.
- MDX 콘텐츠가 필요하면 `src/content/` 컬렉션을 만들고 `astro.config.mjs`에 없는 경우 content config를 먼저 추가 (현재는 컬렉션 없음).

### Testing Requirements
- Astro는 `astro check`로 타입체크 — `npm run build`에 포함됨.
- 수동 검증: `npm run dev`로 `/prjt-blog/`, `/prjt-blog/about/`, `/prjt-blog/case-studies/tikit/` 로딩 확인.

### Common Patterns
- 페이지 프론트매터:
  ```astro
  ---
  import Base from '../layouts/Base.astro';
  ---
  <Base title="..." description="...">
    <section class="hero">...</section>
    <section>...</section>
  </Base>
  ```
- 스타일은 `global.css`의 유틸 클래스(`.hero`, `.grid`, `.card`, `.prose`, `.tagline`)를 우선 사용. 페이지 scoped `<style>`는 **그 페이지에서만** 쓰는 스타일로 한정.
- 컬러 토큰은 `:root`의 CSS 변수(`--bg`, `--text`, `--accent` 등)를 참조. 하드코딩 금지.

## Dependencies

### Internal
- `public/case-studies/`, `public/portfolio/` — 사이드 카 정적 자산(스크립트가 공급).

### External
- `astro`, `pretendard` (npm 번들)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
