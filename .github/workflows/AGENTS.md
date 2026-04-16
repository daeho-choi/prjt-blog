<!-- Parent: ../../AGENTS.md -->
<!-- Generated: 2026-04-17 | Updated: 2026-04-17 -->

# .github/workflows

## Purpose
GitHub Actions CI/CD. 현재는 **GitHub Pages 배포** 한 가지만 수행한다.

## Key Files
| File | Description |
|------|-------------|
| `deploy.yml` | `main` 브랜치 push(또는 `workflow_dispatch`)마다 실행. `build` 잡: `actions/checkout@v4` → `setup-node@v4`(Node 22 + npm 캐시) → `npm ci` → `npm run build` → `actions/upload-pages-artifact@v3`(`./dist`). `deploy` 잡: `actions/deploy-pages@v4`로 `github-pages` 환경에 배포. |

## Subdirectories
없음.

## For AI Agents

### Working In This Directory
- **Pages 소스 설정은 수동 1회**: GitHub repo **Settings → Pages → Source = "GitHub Actions"**. "Deploy from a branch"로 남아 있으면 워크플로가 성공해도 사이트에 반영되지 않는다.
- **Permissions 블록 손대지 말 것**: `pages: write` + `id-token: write` 는 `actions/deploy-pages`의 OIDC 배포 요구사항이다. 제거하면 배포 실패.
- **Concurrency**: `group: pages` + `cancel-in-progress: true`. 빠르게 여러 번 push하면 이전 런이 취소된다 — 의도된 동작.
- **JDK 불필요 (2026-04-17 기준)**: 이전엔 `@opendataloader/pdf`(JVM)로 PDF를 HTML로 변환하느라 `setup-java@v4` 스텝이 필수였지만, 포트폴리오를 hand-authored one-pager로 전환하면서 JDK 의존성이 제거됐다. 같은 디자인의 PDF 자동 변환이 다시 필요해지면 `setup-java` 스텝 + `@opendataloader/pdf` 패키지 복원부터.
- **Node 버전**을 올릴 땐 `package.json`의 `engines`(있다면) · 로컬 dev 환경 · `astro`의 요구 버전을 같이 확인.
- **npm ci** 를 쓰므로 `package-lock.json`을 반드시 커밋. `npm install`로 교체하지 말 것(비재현성).
- **산출물 경로 변경 시**: `astro.config.mjs`의 `base` 나 `outDir`을 바꾸면 `upload-pages-artifact`의 `path: ./dist`도 같이 수정.
- **새 워크플로 추가**: 이 디렉터리에 별도 `.yml`로. Pages 배포 잡과 환경(`github-pages`)을 공유하면 충돌 가능 — `concurrency.group`을 분리.

### Testing Requirements
- 로컬에서 `npm run build`가 클린하게 끝나는지 먼저 확인 (워크플로가 이걸 그대로 실행).
- 워크플로 수정 후: 브랜치에 push → Actions 탭에서 `build` → `deploy` 둘 다 녹색인지, `deployment` job의 `page_url` 출력이 정상 URL인지 확인.
- 배포 후: `https://daeho-choi.github.io/prjt-blog/` + `/case-studies/tikit/` + `/portfolio/` 수동 스모크.

### Common Patterns
- Action 버전 pin은 메이저(`@v4`) 기준. 보안 업데이트는 Dependabot 또는 수동으로 bump.
- `npm ci` → `npm run build` 순서 고정. `npm run content`는 `build` 스크립트 안에서 자동 호출되므로 별도 스텝 불필요.

## Dependencies

### Internal
- `package.json` scripts(`build`, `content`, `content:copy`, `content:pdf`).
- `scripts/copy-case-studies.mjs`, `scripts/convert-pdf.mjs`.
- `astro.config.mjs` (`site`/`base`).

### External (GitHub-hosted actions)
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/setup-java@v4` (Temurin 21)
- `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v4`

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
