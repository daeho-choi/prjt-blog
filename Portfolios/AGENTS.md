<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# Portfolios

## Purpose
블로그의 **원본 콘텐츠 소스**. PM 포트폴리오 PDF와, 각 사이드 프로젝트의 케이스 스터디/PRD를 standalone HTML 페이지로 보관한다. 블로그 사이트가 구축되면 이 자료들을 소스로 삼아 렌더링한다(그대로 서빙 또는 MDX 이관).

## Key Files
| File | Description |
|------|-------------|
| `PM_Portflio.pdf` | PM 포트폴리오 원본 PDF (~1.4MB). **블로그에 통합 시 [`opendataloader-pdf`](https://github.com/opendataloader-project/opendataloader-pdf)로 구조화된 Markdown/JSON/HTML로 변환하여 사용한다** (raw PDF를 그대로 `<iframe>` 임베드하지 않음). 원본은 다운로드 링크로도 유지. 파일명 오탈자 주의: `Portflio` (→ 이후 `Portfolio`로 리네임 고려). |
| `prd_Tikit.html` | **TIKIT** 케이스 스터디 — "티켓처럼 공유하는 한국어 이벤트 초대장" 서비스. 3주 런칭 스토리. Tailwind CDN + Pretendard, 다크 테마 (보라 계열 액센트). |
| `prd_boombim.html` | **붐빔 (BoomBim)** PRD — 불/앰버 계열 테마 (fire-500 `#FF4500` 기반), Noto Sans KR + Outfit + Space Mono. |
| `prd_lokit.html` | **LOKIT** PRD — 시안/옵시디언 계열 테마 (cyan-500 `#00FFD1` 기반), Noto Sans KR + Outfit + JetBrains Mono. |

## Subdirectories
없음.

## For AI Agents

### Working In This Directory
- **이 HTML 파일들은 이미 완성된 배포 가능 페이지이다.** 각각 독립적인 다크 테마 디자인과 자체 CSS 변수 시스템을 가진다. 임의 수정 금지.
- 블로그 통합 방식은 크게 두 갈래이며, 사용자 결정 전 선택하지 말 것:
  1. **그대로 서빙**: `public/portfolios/` 또는 라우트 하위에 static asset으로 복사 → `<a>`/`<iframe>`으로 연결. 장점: 디자인 유지, 비용 0. 단점: 블로그 레이아웃/네비게이션과 분리됨.
  2. **MDX/컴포넌트로 이관**: 헤더/풋터를 블로그와 통일, 다크 테마 CSS 변수만 컴포넌트 스코프로 이식. 장점: 통합감·SEO. 단점: 작업량 큼.
- PDF는 크기 때문에 Git LFS 또는 CDN(예: Cloudflare R2, Cloudinary) 사용을 검토.
- **PDF → 블로그 콘텐츠 변환은 반드시 [`opendataloader-pdf`](https://github.com/opendataloader-project/opendataloader-pdf) 사용** (Apache-2.0, 100% 로컬 처리, 바운딩 박스 포함 JSON + 구조화 Markdown + HTML 산출). Python/Node.js/Java SDK + CLI 모두 지원.
  - **Python**: `pip install -U opendataloader-pdf` → `opendataloader_pdf.convert(input_path=["Portfolios/PM_Portflio.pdf"], output_dir="build/pdf/", format="markdown,json,html")`
  - **Node.js** (블로그가 JS 기반이면 권장): `npm install @opendataloader/pdf` → `import { convert } from '@opendataloader/pdf'; await convert(['Portfolios/PM_Portflio.pdf'], { outputDir: 'build/pdf/', format: 'markdown,json' })`
  - **CLI**: `opendataloader-pdf Portfolios/PM_Portflio.pdf --output-dir build/pdf/ --format markdown,json`
  - 옵션 메모: 스캔 PDF가 섞이면 `--force-ocr`, 프롬프트 인젝션/히든 텍스트 방어는 `--sanitize`, 복잡 레이아웃(다단/표)이 많으면 `--hybrid docling-fast` (별도 백엔드 `opendataloader-pdf-hybrid --port 5002` 필요).
  - 변환 산출물은 **빌드 타임에 생성**하고 (예: GitHub Actions 빌드 step), 결과 Markdown/JSON을 사이트 소스에 포함. 원본 PDF는 `Portfolios/`에 남기되 퍼블리시 대상 여부는 별도 결정.
- **신규 프로젝트 추가 시 명명 규칙**: `prd_<ProjectName>.html` (소문자 프로젝트명). MDX 전환 후에는 규칙이 바뀔 수 있으니 루트 AGENTS.md 확인.

### Testing Requirements
- HTML은 브라우저로 직접 열어 시각적으로 검수 (`open prd_Tikit.html` 등).
- 외부 CDN 링크 (Tailwind, Pretendard, Google Fonts) 의존 — 오프라인/CSP 환경에서 깨질 수 있음. 프로덕션 블로그로 통합 시 로컬 번들링 고려.

### Common Patterns
- 모든 HTML은 `<html lang="ko">`, 모바일 viewport 메타, `scroll-behavior: smooth`.
- CSS 변수 기반의 컬러 토큰 시스템 (각 프로젝트마다 고유 팔레트).
- 폰트: 한국어는 Noto Sans KR 또는 Pretendard, 디스플레이는 Outfit.
- 다크 모드 기본 (라이트 모드 변종 없음).

## Dependencies

### Internal
- 없음 (소스 콘텐츠만 담는 디렉터리).

### External
- **jsDelivr**: `pretendard@v1.3.9` (TIKIT)
- **Google Fonts**: Noto Sans KR, Outfit, Space Mono (BoomBim), JetBrains Mono (LOKIT)
- **Tailwind Play CDN**: `cdn.tailwindcss.com` (TIKIT) — 프로덕션 사용 시 로컬 빌드로 교체 권장

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
