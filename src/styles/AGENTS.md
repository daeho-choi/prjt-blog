<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-17 | Updated: 2026-04-17 -->

# src/styles

## Purpose
블로그 본체(Astro 라우트)의 **전역 CSS와 디자인 토큰**. 미니멀 다크 테마 한 벌만 존재하며 라이트 모드 변종은 없다.

## Key Files
| File | Description |
|------|-------------|
| `global.css` | 디자인 토큰(`:root`의 `--bg`/`--bg-soft`/`--card`/`--border`/`--text`/`--text-muted`/`--text-dim`/`--accent`/`--link`/`--radius`/`--max`/`--gap`) + base 리셋 + 타이포 + 사이트 헤더/푸터 + `.hero` / `.grid` / `.card` / `.prose` 유틸. `Base.astro`에서 한 번 import. |

## Subdirectories
없음.

## For AI Agents

### Working In This Directory
- **토큰 우선**: 색/반경/최대폭은 반드시 CSS 변수로 참조. 하드코딩된 hex는 리팩터링 시 바로 바꿀 것.
- **다크 전용**: `color-scheme: dark` 선언됨. 라이트 모드를 추가하려면 `@media (prefers-color-scheme: light)`나 `[data-theme]` 전략 중 하나를 먼저 결정 — 섞지 말 것.
- **Pretendard 폰트 스택**: `body`의 `font-family`는 `"Pretendard Variable"` 우선. `font-feature-settings: "ss06", "tnum"`은 한국어/숫자 가독성을 위한 의도된 설정이다 — 제거 금지.
- **두 벌의 CSS 동기화 주의**: `global.css`는 Astro 라우트 전용이고, `scripts/convert-pdf.mjs`의 `PORTFOLIO_CSS` 상수는 `/portfolio/*.html` 정적 페이지 전용이다. 디자인 토큰/색상을 바꿀 때 두 곳 모두 업데이트해야 일관성이 유지된다. 케이스 스터디(`public/case-studies/*`)는 각자 고유 팔레트라 별도 관리 대상이 아님.
- `.card`의 `--accent`는 카드별로 override 가능(`style="--accent: #..."`). `color-mix(in srgb, var(--accent) 60%, var(--border))` 같은 모던 CSS를 쓰므로 타깃 브라우저가 이를 지원하는지 유지.
- `.prose`는 `max-width: 72ch`. 긴 본문(포트폴리오 섹션, About)에 적용. 리팩터로 컨테이너 폭을 바꿀 때 `--max`(960px, 카드 레이아웃용)와 혼동하지 말 것.
- 반응형 타이포는 `clamp()` 기반. breakpoint 기반 미디어쿼리는 최소화 — 필요하면 추가하되 전체 파일이 `clamp()` 중심이라는 점 유지.

### Testing Requirements
- 수동 시각 검수: `/prjt-blog/` 홈의 카드 호버 시 border 색 전환 + 2px translateY, `::before` 좌측 액센트 바 opacity 변화 확인.
- 변수 rename 시 전 파일 grep 필수(`rg -- "--bg|--text|--accent"` 등). Astro 템플릿의 인라인 `style="--accent: ..."` 도 같이 본다.

### Common Patterns
- 유틸 클래스: `.hero`, `.grid`, `.card`, `.prose`, `.tagline`, `.site-header`, `.site-footer`. 새 페이지는 이걸 먼저 재사용.
- 링크 hover는 `color` 트랜지션만 — 언더라인 토글은 의도적으로 안 씀.
- 폰트 사이즈/간격은 `rem` 기반, 부드러운 스케일은 `clamp(min, vw기반, max)`.

## Dependencies

### Internal
- 소비처: `src/layouts/Base.astro` (단독 import), 간접적으로 모든 `src/pages/*.astro`.

### External
- 없음 (Pretendard는 `Base.astro`에서 별도 import, 여기서는 `font-family`로만 참조).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
