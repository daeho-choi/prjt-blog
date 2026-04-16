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
| `package.json` | 스크립트(`dev`/`build`/`content`)와 의존성 (astro, @astrojs/mdx, @astrojs/sitemap, pretendard). |
| `astro.config.mjs` | `site: https://daeho-choi.github.io`, `base: /prjt-blog/`, integrations: mdx + sitemap. |
| `tsconfig.json` | Astro strict preset. `Portfolios/`는 타입체킹에서 제외. |
| `.gitignore` | `node_modules/`, `dist/`, `.astro/`, `.omc/`, `public/case-studies/`, `public/portfolio/` (뒤 두 개는 **빌드 산출물**이므로 커밋 금지). |
| `.github/workflows/deploy.yml` | Pages 배포 워크플로 (Node 22 + npm ci + build + upload-pages-artifact + deploy-pages). |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/` | Astro 소스 (layouts, pages, styles). (`src/AGENTS.md` 참조) |
| `scripts/` | 빌드 전 콘텐츠 복사 스크립트. (`scripts/AGENTS.md` 참조) |
| `public/` | Astro의 정적 자산 루트. **모든 내용이 `scripts/copy-case-studies.mjs`에 의해 생성됨** — 직접 편집 금지. |
| `Portfolios/` | 원본 콘텐츠 소스(standalone HTML + 다운로드용 PDF). 빌드 입력이며 직접 서빙하지 않음. (`Portfolios/AGENTS.md` 참조) |
| `.github/workflows/` | CI/CD. (`.github/workflows/AGENTS.md` 참조) |
| `.omc/` | oh-my-claudecode 런타임 상태. gitignored. |

## For AI Agents

### Working In This Directory
- **기술 스택 (확정)**: Astro 5.x(+ MDX) · TypeScript strict · Pretendard(npm 번들) · 다크 테마(미니멀). 전 세계적으로 rebranding 하거나 스택 교체하기 전에 사용자 확인 필수.
- **콘텐츠 전략 (확정, 2026-04-17)**:
  - 3개 standalone 케이스 스터디(`Portfolios/prd_*.html`)는 **원본 디자인 그대로** `public/case-studies/<slug>/index.html`로 복사되어 `/case-studies/<slug>/` 에서 서빙.
  - **PM 포트폴리오도 동일 패턴**: `Portfolios/pm_portfolio.html` (tikit 스타일 one-pager) → `public/portfolio/index.html`. `Portfolios/PM_Portflio.pdf`는 다운로드 용도로 `public/portfolio/PM_Portfolio.pdf`로 같이 복사(복사 시 타이틀 오탈자 정정).
  - 블로그의 홈/소개(`src/pages/*.astro`)만 Astro/MDX로 작성. 케이스 스터디/포트폴리오는 각자 고유 디자인으로 유지됨 — 이게 의도된 **혼합**이다.
- **콘텐츠는 소스에 커밋하지 않는다**. `Portfolios/`만 진실의 원천. `public/case-studies/`, `public/portfolio/`는 매 빌드마다 스크립트가 재생성하므로 gitignored.
- **Base path는 `/prjt-blog/`**. Astro 라우트의 내부 링크는 반드시 `import.meta.env.BASE_URL`로 prefix. `public/` 아래 정적 HTML은 **상대 경로**(`./`, `../`)를 사용 — 이것이 `/prjt-blog/` 하위 어디에 마운트되든 깨지지 않는 패턴.
- **PDF 파이프라인 없음 (2026-04-17 기준)**: 이전엔 `@opendataloader/pdf`(JVM)로 PDF → Markdown → per-section HTML을 렌더했지만, 포트폴리오를 hand-authored one-pager로 전환하면서 **삭제됨**. JDK 의존성도 같이 제거. PDF는 다운로드 링크로만 남음.

### Developer Workflow
```bash
npm install                  # 첫 셋업
npm run content              # Portfolios/ → public/ 복사 (케이스스터디 3개 + 포트폴리오 HTML + PDF)
npm run dev                  # http://localhost:4321/prjt-blog/ (predev가 content를 자동 실행)
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
  - `dist/prjt-blog/case-studies/{tikit,boombim,lokit}/index.html`, `dist/prjt-blog/portfolio/index.html`, `dist/prjt-blog/portfolio/PM_Portfolio.pdf`가 생성됐는지.
  - `npm run preview`로 열어 홈 → 포트폴리오 one-pager → TIKIT 케이스 스터디 링크, PDF 다운로드까지 동선 확인.

### Common Patterns
- 콘텐츠는 한국어 기본(`lang="ko"`).
- Astro 페이지의 네비/에셋: `${import.meta.env.BASE_URL}` prefix 필수.
- 정적 HTML(`Portfolios/*.html`) 내부 링크는 **상대 경로**. `./PM_Portfolio.pdf`, `../case-studies/tikit/`, `../` (홈) 형태.
- 케이스 스터디 파일명 규칙: `Portfolios/prd_<name>.html` → `public/case-studies/<name>/index.html`. 신규 추가 시 `scripts/copy-case-studies.mjs`의 `caseStudies` 배열에 한 줄 추가 + `src/pages/index.astro`의 `caseStudies`에도 카드 추가.
- 스타일 토큰: `src/styles/global.css`의 `:root { --bg, --text, --accent, ... }` (Astro 라우트 용), 포트폴리오/케이스 스터디는 각자 파일 내부에 토큰 내장. 다크 테마 전용.

## Dependencies

### External (production)
- **astro** ^5.0.0 — 정적 사이트 생성기
- **@astrojs/mdx** ^4 — MDX 지원
- **@astrojs/sitemap** ^3 — sitemap.xml 생성
- **pretendard** ^1.3.9 — 한국어 최적화 가변 폰트

### System
- Node.js 22+ (로컬/CI). JDK 불필요.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
