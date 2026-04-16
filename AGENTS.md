<!-- Generated: 2026-04-16 | Updated: 2026-04-17 -->

# prjt-blog

## Purpose
**daeho-choi**(PM)의 개인 포트폴리오 블로그. PM으로서의 케이스 스터디와 포트폴리오를 공개하는 정적 사이트이며, **Astro 5.x**로 빌드하고 **GitHub Pages**로 배포한다.

- **GitHub Repository**: https://github.com/daeho-choi/prjt-blog
- **프로덕션 URL**: https://daeho-choi.github.io/prjt-blog/
- **배포**: GitHub Actions → `actions/deploy-pages` (브랜치 아님, 아티팩트 기반)
- **소유자 / 저자**: daeho-choi (PM)

## Key Files
| File | Description |
|------|-------------|
| `package.json` | 스크립트(`dev`/`build`/`content`/`content:copy`/`content:pdf`)와 의존성 (astro, @astrojs/mdx, @astrojs/sitemap, @opendataloader/pdf, marked, pretendard). |
| `astro.config.mjs` | `site: https://daeho-choi.github.io`, `base: /prjt-blog/`, integrations: mdx + sitemap. |
| `tsconfig.json` | Astro strict preset. `Portfolios/`는 타입체킹에서 제외. |
| `.gitignore` | `node_modules/`, `dist/`, `.astro/`, `.omc/`, `build/pdf/`, `public/case-studies/`, `public/portfolio/` (뒤 두 개는 **빌드 산출물**이므로 커밋 금지). |
| `.github/workflows/deploy.yml` | Pages 배포 워크플로 (Node 22 + Temurin JDK 21 + npm ci + build + upload-pages-artifact + deploy-pages). |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/` | Astro 소스 (layouts, pages, styles). (`src/AGENTS.md` 참조) |
| `scripts/` | 빌드 전 콘텐츠 파이프라인 스크립트. (`scripts/AGENTS.md` 참조) |
| `public/` | Astro의 정적 자산 루트. **모든 내용이 스크립트에 의해 생성됨** — 직접 편집 금지. `public/case-studies/*`는 `copy-case-studies.mjs`가, `public/portfolio/*`는 `convert-pdf.mjs`가 매 빌드마다 재생성. |
| `Portfolios/` | 원본 콘텐츠 소스(PDF + 프로젝트별 케이스 스터디 HTML). 빌드 입력이며 직접 서빙하지 않음. (`Portfolios/AGENTS.md` 참조) |
| `build/` | PDF 변환 중간 산출물(`.md`/`.json`). gitignored. |
| `.github/workflows/` | CI/CD. |
| `.omc/` | oh-my-claudecode 런타임 상태. gitignored. |

## For AI Agents

### Working In This Directory
- **기술 스택 (확정)**: Astro 5.x(+ MDX) · TypeScript strict · Pretendard(npm 번들) · 다크 테마(미니멀). 전 세계적으로 rebranding 하거나 스택 교체하기 전에 사용자 확인 필수.
- **혼합 콘텐츠 전략 (확정)**:
  - 기존 3개 standalone 케이스 스터디(`Portfolios/prd_*.html`)는 **원본 디자인 그대로** `public/case-studies/<slug>/index.html`로 복사되어 `/case-studies/<slug>/` 라우트에서 서빙된다. 디자인 변경 금지.
  - PM 포트폴리오 PDF는 `@opendataloader/pdf`로 Markdown 추출 → `##` 단위 분할 → 미니멀 다크 HTML로 렌더 → `/portfolio/NN-<slug>.html` + `/portfolio/` 인덱스.
  - 블로그의 홈/소개/인덱스(`src/pages/*.astro`)만 Astro/MDX로 작성. 블로그 전역 레이아웃과 케이스 스터디는 디자인 언어가 다르게 유지됨 — 이게 의도된 **혼합**이다.
- **콘텐츠는 소스에 커밋하지 않는다**. `Portfolios/`만 진실의 원천. `public/case-studies/`, `public/portfolio/`, `build/pdf/`는 매 빌드마다 스크립트가 재생성하므로 gitignored.
- **Base path는 `/prjt-blog/`**. 내부 링크는 반드시 `import.meta.env.BASE_URL`로 prefix. 하드코딩된 `/` 절대경로는 GH Pages에서 깨진다.
- **JVM 의존성**: `@opendataloader/pdf`는 JDK 11+ 필요. 로컬(macOS)에선 `scripts/convert-pdf.mjs`가 Homebrew의 `openjdk@21` 경로를 자동 탐지해 `JAVA_HOME`을 세팅한다. CI는 `actions/setup-java@v4`가 처리.

### Developer Workflow
```bash
npm install                  # 첫 셋업
npm run content              # 케이스스터디 복사 + PDF 변환 (JDK 필요)
npm run content:copy         # 케이스스터디만 (빠름, JDK 불필요)
npm run dev                  # http://localhost:4321/prjt-blog/ (predev가 copy를 자동 실행)
npm run build                # content + astro build → dist/
npm run preview              # 빌드 결과 로컬 프리뷰
```

### Deployment
- `main` 브랜치로 push → `.github/workflows/deploy.yml` 실행 → `dist/`를 GitHub Pages 아티팩트로 업로드 → 배포.
- **선행 조건 (수동 1회 설정)**: GitHub repo **Settings → Pages → Source**를 **"GitHub Actions"**로 지정. "Deploy from a branch"가 기본값이면 워크플로가 실행되어도 배포되지 않는다.
- 커스텀 도메인 사용 시: `public/CNAME` 생성 + `astro.config.mjs`의 `site`/`base` 수정.

### Testing Requirements
- 아직 unit/e2e 테스트 없음. 최소 확인:
  - `npm run build`가 에러 없이 끝나는지 (Astro type-check 포함).
  - `dist/prjt-blog/`와 `dist/prjt-blog/case-studies/{tikit,boombim,lokit}/index.html`, `dist/prjt-blog/portfolio/*.html`이 생성됐는지.
  - `npm run preview`로 열고 base path가 `/prjt-blog/`로 반영되는지.

### Common Patterns
- 콘텐츠는 한국어 기본(`lang="ko"`).
- 네비 링크 / 에셋 경로: `${import.meta.env.BASE_URL}` prefix 필수.
- 케이스 스터디 파일명 규칙: `Portfolios/prd_<name>.html` → `public/case-studies/<name>/index.html`. 신규 추가 시 `scripts/copy-case-studies.mjs`의 `mapping`에 한 줄 추가.
- 스타일 토큰: `src/styles/global.css`의 `:root { --bg, --text, --accent, ... }`. 다크 테마만 존재하며 light 모드 변종 없음.

## Dependencies

### External (production)
- **astro** ^5.0.0 — 정적 사이트 생성기
- **@astrojs/mdx** ^4 — MDX 지원
- **@astrojs/sitemap** ^3 — sitemap.xml 생성
- **@opendataloader/pdf** ^2 — PDF → Markdown/JSON (JVM 기반)
- **marked** ^14 — Markdown → HTML
- **pretendard** ^1.3.9 — 한국어 최적화 가변 폰트

### System
- Node.js 22+ (로컬/CI)
- JDK 11+ (로컬은 Homebrew `openjdk@21`, CI는 `setup-java@v4` temurin 21)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
