<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-17 | Updated: 2026-04-17 -->

# scripts

## Purpose
빌드 전(prebuild) **콘텐츠 복사 파이프라인**. `Portfolios/`의 원본 HTML/PDF를 Astro가 정적 자산으로 서빙할 수 있도록 `public/` 아래에 배포한다.

## Key Files
| File | Description |
|------|-------------|
| `copy-case-studies.mjs` | 두 갈래의 복사를 동시에 수행. ① `Portfolios/prd_{Tikit,boombim,lokit}.html` → `public/case-studies/{tikit,boombim,lokit}/index.html`. ② `Portfolios/pm_portfolio.html` → `public/portfolio/index.html`, `Portfolios/PM_Portflio.pdf` → `public/portfolio/PM_Portfolio.pdf` (복사 시 파일명 오탈자 정정). 순수 Node built-ins만 사용. `predev` + `build` + `content`에서 실행. |

## Subdirectories
없음.

## For AI Agents

### Working In This Directory
- **파일명 매핑은 스크립트 상단 두 배열에**: `caseStudies`(`prd_*.html` → `/case-studies/<slug>/`), `portfolioFiles`(`pm_portfolio.html` + PDF → `/portfolio/`).
- **케이스 스터디 추가 시**: `caseStudies`에 `{ from, slug }` 한 줄 + `src/pages/index.astro`의 `caseStudies` 배열에도 카드 항목 추가 (두 곳 동기화).
- **출력 디렉터리를 먼저 `rm -rf`** 한 뒤 재생성 — 멱등성 보장. `CASE_DEST`와 `PORTFOLIO_DEST` 각각 별도로 초기화.
- **PDF 파일명**: 원본은 `PM_Portflio.pdf` (오탈자 "Portflio")인데 복사 시 `PM_Portfolio.pdf`로 정정한다. one-pager HTML 내부 링크(`./PM_Portfolio.pdf`)가 이 정정된 이름을 기대하므로 매핑을 함부로 바꾸지 말 것. 원본 파일명을 고치려면 `Portfolios/AGENTS.md`에도 반영.
- **PDF 변환 파이프라인은 제거됨 (2026-04-17)**: 이전엔 `convert-pdf.mjs`가 `@opendataloader/pdf`(JVM)로 PDF → Markdown → per-section HTML을 생성했다. 포트폴리오를 hand-authored one-pager로 전환하면서 삭제됐고, JDK 의존성도 함께 제거됐다. 같은 디자인 자동화가 다시 필요해지면 `@opendataloader/pdf` 패키지 재설치부터 시작(과거 버전은 git history 참조).

### Testing Requirements
- `node scripts/copy-case-studies.mjs` → 출력 확인:
  - `public/case-studies/{tikit,boombim,lokit}/index.html` 3개
  - `public/portfolio/index.html` + `public/portfolio/PM_Portfolio.pdf`
- 브라우저로 열어서 (`open public/portfolio/index.html`) one-pager가 제대로 로드되고, PDF 다운로드 링크가 같은 폴더의 `PM_Portfolio.pdf`를 가리키는지 확인.

### Common Patterns
- **ESM only** (`.mjs`). Top-level `await` 허용.
- 경로 해석은 `fileURLToPath(import.meta.url)` 기반 — 어디서 실행해도 동일 결과.
- 로그는 `console.log('copied <from> -> <dst>')` 형식으로 통일.

## Dependencies

### Internal
- 입력: `Portfolios/prd_*.html`, `Portfolios/pm_portfolio.html`, `Portfolios/PM_Portflio.pdf`
- 출력: `public/case-studies/`, `public/portfolio/`

### External
- 없음 (Node built-ins만 사용).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
