<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-17 -->

# Portfolios

## Purpose
블로그의 **원본 콘텐츠 소스**. PM 포트폴리오 one-pager + 다운로드용 PDF와, 각 사이드 프로젝트의 케이스 스터디/PRD를 standalone HTML 페이지로 보관한다. 빌드 시 `scripts/copy-case-studies.mjs`가 이 디렉터리를 소스로 `public/`에 복사한다.

## Key Files
| File | Description |
|------|-------------|
| `pm_portfolio.html` | **PM 포트폴리오 one-pager**. TIKIT 케이스 스터디와 동일한 디자인 언어(다크 테마 · 인디고/마젠타/오렌지 그라디언트 · Pretendard · 섹션 마커). Hero → Career Timeline → Core Competencies → 5개 케이스(FC Online / JSY / OS / ZEPETO / TIKIT) → Competency Matrix → Contact 순. Tailwind CDN + 자체 CSS. `scripts/copy-case-studies.mjs`가 `public/portfolio/index.html`로 복사. |
| `PM_Portflio.pdf` | PM 포트폴리오 원본 PDF (~1.4MB). **파일명 오탈자 주의**: `Portflio`. 빌드 시 `PM_Portfolio.pdf`로 복사되어 one-pager 안의 "PDF 다운로드" 버튼이 이걸 가리킨다. 원본 파일명을 고치려면 `scripts/copy-case-studies.mjs`의 `portfolioFiles` 매핑도 함께 수정. |
| `prd_Tikit.html` | **TIKIT** 케이스 스터디 — "티켓처럼 공유하는 한국어 이벤트 초대장" 서비스. 3주 런칭 스토리. Tailwind CDN + Pretendard, 다크 테마(보라/마젠타/오렌지). **이 파일의 디자인 언어가 `pm_portfolio.html`의 스타일 레퍼런스**이다. |
| `prd_boombim.html` | **붐빔 (BoomBim)** PRD — 불/앰버 계열 테마 (fire-500 `#FF4500` 기반), Noto Sans KR + Outfit + Space Mono. |
| `prd_lokit.html` | **LOKIT** PRD — 시안/옵시디언 계열 테마 (cyan-500 `#00FFD1` 기반), Noto Sans KR + Outfit + JetBrains Mono. |

## Subdirectories
없음.

## For AI Agents

### Working In This Directory
- **이 HTML 파일들은 이미 완성된 배포 가능 페이지이다.** 각각 독립적인 다크 테마 디자인과 자체 CSS 변수 시스템을 가진다. 임의 수정 금지. 내용 업데이트는 섹션 단위로 신중하게.
- **디자인 일관성 레퍼런스**: `pm_portfolio.html`과 `prd_Tikit.html`은 **같은 비주얼 언어**(CSS 변수 `--accent: #818CF8` 등, `.section-marker` / `.feature-card` / `.badge` / `.gradient-text` / `.mono-label` / `.orb` 패턴)를 공유한다. 두 파일을 같이 수정할 일이 생기면 토큰/클래스 명칭을 맞춰서 유지.
- **나머지 PRD(`prd_boombim.html`, `prd_lokit.html`)는 독립 팔레트**다 — 프로젝트 아이덴티티 자체가 서로 다르므로 통일하지 말 것.
- **`pm_portfolio.html`의 내부 링크는 상대 경로**:
  - `./PM_Portfolio.pdf` — 같은 폴더의 PDF (복사 시 오탈자 정정된 이름)
  - `../case-studies/tikit/` — TIKIT 상세 케이스 스터디
  - `../` — 블로그 홈
  이 파일은 `public/portfolio/index.html`로 복사되어 `/prjt-blog/portfolio/`에서 서빙되므로, 상대 경로가 자동으로 `/prjt-blog/` 하위로 해석된다. 절대 경로 금지.
- **신규 프로젝트(케이스 스터디) 추가 시 명명 규칙**: `prd_<ProjectName>.html` (소문자 프로젝트명). 추가 후 `scripts/copy-case-studies.mjs`의 `caseStudies` 배열 + `src/pages/index.astro`의 홈 카드 배열 + `pm_portfolio.html`의 Competency Matrix 컬럼까지 검토.
- PDF 크기(~1.4MB)가 부담되면 Git LFS 또는 CDN(Cloudflare R2 등) 이전 검토. 현재는 일반 git 트래킹.

### Testing Requirements
- HTML은 브라우저로 직접 열어 시각적으로 검수 (`open Portfolios/pm_portfolio.html`, `open Portfolios/prd_Tikit.html` 등).
- `pm_portfolio.html` 검수 포인트:
  - Hero 섹션의 ID 카드 비주얼 로드
  - 스크롤 시 상단 progress bar + 각 섹션의 reveal 애니메이션 작동
  - 내비 pill의 앵커 점프 (`#case-01` 등)
  - CTA의 PDF 다운로드 버튼이 같은 폴더의 PDF를 가리키는지 (실파일 존재는 빌드 후 `public/portfolio/`에서)
- 외부 CDN 링크 (Tailwind, Pretendard, Google Fonts) 의존 — 오프라인/CSP 환경에서 깨질 수 있음. 프로덕션에서 문제 되면 로컬 번들링으로 교체 검토.

### Common Patterns
- 모든 HTML은 `<html lang="ko">`, 모바일 viewport 메타, `scroll-behavior: smooth`.
- CSS 변수 기반의 컬러 토큰 시스템 (각 파일마다 `:root`).
- 폰트: 한국어는 Pretendard (또는 Noto Sans KR), 디스플레이는 Outfit (BoomBim/LOKIT).
- 다크 모드 기본 (라이트 모드 변종 없음).
- `pm_portfolio.html` / `prd_Tikit.html`: Tailwind CDN + 커스텀 CSS 혼합. 인라인 `<style>`은 디자인 토큰과 컴포넌트 클래스(`.section-marker`, `.feature-card` 등)를 정의.

## Dependencies

### Internal
- 소비처: `scripts/copy-case-studies.mjs` (빌드마다 `public/`로 복사).

### External (CDN, 런타임 로드)
- **jsDelivr**: `pretendard@v1.3.9` (TIKIT · PM portfolio)
- **Google Fonts**: Noto Sans KR, Outfit, Space Mono (BoomBim), JetBrains Mono (LOKIT)
- **Tailwind Play CDN**: `cdn.tailwindcss.com` (TIKIT · PM portfolio) — 프로덕션 사용 시 로컬 빌드로 교체 권장

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
