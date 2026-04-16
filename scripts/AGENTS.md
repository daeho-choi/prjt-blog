<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-17 | Updated: 2026-04-17 -->

# scripts

## Purpose
빌드 전(prebuild) **콘텐츠 파이프라인**. `Portfolios/`의 원본 자료를 Astro가 소비할 수 있는 형태로 `public/` 아래에 배포한다.

## Key Files
| File | Description |
|------|-------------|
| `copy-case-studies.mjs` | `Portfolios/prd_{Tikit,boombim,lokit}.html` → `public/case-studies/{tikit,boombim,lokit}/index.html`. 빠름, 순수 Node built-ins만 사용. `predev` + `build` + `content:copy`에서 실행. |
| `convert-pdf.mjs` | `Portfolios/PM_Portflio.pdf` → `build/pdf/*.md` → `##` 단위 분할 → `public/portfolio/NN-<slug>.html` + `index.html` + `styles.css`. `@opendataloader/pdf`(JVM) + `marked`. `content:pdf` + `build`에서 실행. |

## Subdirectories
없음.

## For AI Agents

### Working In This Directory
- **`copy-case-studies.mjs`**: 파일명 매핑은 스크립트 상단 `mapping` 배열에. 새 케이스 스터디 추가 시 여기에 한 줄 추가하고 `src/pages/index.astro`의 `caseStudies` 배열에도 카드 항목 추가.
- **`convert-pdf.mjs`**:
  - `@opendataloader/pdf`는 JVM 프로세스를 spawn한다. 스크립트는 `JAVA_HOME`이 없으면 Homebrew `openjdk@21` / Temurin 경로를 자동 탐지한다. 그래도 실패하면 사용자에게 `brew install openjdk@21` 또는 JDK 설치 안내.
  - Markdown 분할은 **H2(`##`) 경계**. H1은 문서 제목으로 간주해 첫 섹션 이전에 수집된 본문 앞에 붙지 않는다. 분할 로직 변경은 `splitSections()` 수정.
  - 섹션 HTML은 **Astro 빌드와 무관한 plain HTML**이다. Pretendard 등 자체 `<link rel="stylesheet">` 로 `portfolio/styles.css`를 참조한다 (스크립트가 인라인 상수 `PORTFOLIO_CSS`로 같이 써낸다). 스타일 수정은 `PORTFOLIO_CSS` 상수 편집.
  - 실패하면 `process.exit(1)` → `npm run build` 자체가 실패한다. CI에서는 워크플로가 멈추므로 디버깅 시 `build/pdf/<stem>.md` 중간 산출물을 열어 원인 파악.
- 두 스크립트 모두 **출력 디렉터리를 먼저 `rm -rf`** 한 뒤 재생성 — 멱등성 보장.

### Testing Requirements
- `node scripts/copy-case-studies.mjs` → `public/case-studies/*/index.html` 3개가 생기는지 육안 확인.
- `npm run content:pdf` → `public/portfolio/index.html` + 섹션 파일들이 생성됐는지 확인. 브라우저로 로컬 열어 레이아웃/내비게이션 검수.
- 세션별 JVM spawn은 시간이 걸릴 수 있음(수 초~수십 초). `--hybrid docling-fast` 옵션은 별도 백엔드 필요해서 여기선 미사용.

### Common Patterns
- **ESM only** (`.mjs`). Top-level `await` 허용.
- 경로 해석은 `fileURLToPath(import.meta.url)` 기반 — 어디서 실행해도 동일 결과.
- 출력 파일명: `NN-<slugified-title>.html` (2자리 zero-padded + ASCII/한글 허용 슬러그).

## Dependencies

### Internal
- 입력: `Portfolios/prd_*.html`, `Portfolios/PM_Portflio.pdf`
- 출력: `public/case-studies/`, `public/portfolio/`, `build/pdf/`

### External
- `@opendataloader/pdf` — PDF 파서 (JVM 11+ 필요)
- `marked` — Markdown → HTML

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
