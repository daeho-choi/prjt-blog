# Design Audit — 2026-04-17

블로그를 구성하는 5개 스타일 시스템(Astro global + CV + 3개 PRD)의 디자인 토큰을 비교한 결과. 목표는 공통 `tokens.css`로 뽑아낼 항목과, 페이지별 정체성으로 남겨둘 항목을 가르는 것.

## 비교표

### 1. Color

| File | BG | Surface | Border | Text | Muted | Accent |
|------|----|---------|--------|------|-------|--------|
| `global.css` | `#0a0a0b` | `#16161a` | `#26262b` | `#f4f4f5` | `#a1a1aa` | `#818cf8` |
| `pm_portfolio.html` | `#0b0d10` | `#12151a` | `#1e232b` | `#eaecef` | `#8b949e` | `#7dd3fc` |
| `prd_Tikit.html` | `#0a0a0b` | `#17171a` | `#26262b` | `#f4f4f5` | `#a1a1aa` | `#818CF8` |
| `prd_boombim.html` | `#0d0d0d` | `#1a1a1a` | `#3a3a3a` | `#f0f0f0` | `#888` | `#FF6B35` |
| `prd_lokit.html` | `#08090c` | `#0f1117` | `#232733` | `#f3f4f6` | `#9ca3af` | `#00FFD1` |

### 2. Font

| File | Display | Body | Mono |
|------|---------|------|------|
| `global.css` | (body 상속) | Pretendard Variable | JetBrains Mono / SF Mono |
| `pm_portfolio.html` | (body 상속) | Pretendard Variable | JetBrains Mono |
| `prd_Tikit.html` | (body 상속) | Pretendard Variable | JetBrains Mono / SF Mono |
| `prd_boombim.html` | **Outfit** | **Noto Sans KR** | Space Mono |
| `prd_lokit.html` | **Outfit** | **Noto Sans KR** | JetBrains Mono |

### 3. Type scale

| File | h1 | h2 | h3 | body | fluid? |
|------|----|----|----|------|--------|
| `global.css` | clamp(2.25–3.5rem) / 800 | clamp(1.5–2rem) / 700 | 1.125rem / 600 | 17px | ✓ |
| `pm_portfolio.html` | clamp(48–84px) / 800 | 26px / 700 | varies | 15px | ✓ (h1만) |
| `prd_Tikit.html` | clamp(3–7rem) / 700 | clamp(1.8–2.5rem) / 800 | 1rem / 700 | 14px | ✓ |
| `prd_boombim.html` | clamp(3.5–8rem) / 900 | clamp(1.8–2.5rem) / 900 | 1.4rem / 700 | 16px | ✓ |
| `prd_lokit.html` | clamp(3–7rem) / 700 | clamp(1.8–2.5rem) / 800 | 1rem / 700 | 16px | ✓ |

### 4. Spacing

| File | Section V-pad | Container | Card pad | Grid gap |
|------|---------------|-----------|----------|----------|
| `global.css` | clamp(3–5rem) | 960px | 1.75rem | clamp(1–1.5rem) |
| `pm_portfolio.html` | 48px | 1200px | 18px | 1px |
| `prd_Tikit.html` | 80px | 900px | 28px | 20px |
| `prd_boombim.html` | 80px | 900px | 28px | 20px |
| `prd_lokit.html` | 80px | 900px | 28px | 20px |

### 5. Shape

| File | Radius (panel) | Radius (pill) | Shadow |
|------|----------------|---------------|--------|
| `global.css` | 14px | 999px | 0 8px 24px, accent-tint glow |
| `pm_portfolio.html` | 4px | 999px | implicit on hover |
| `prd_Tikit.html` | 20px | 999px | 0 40px 80px -20px |
| `prd_boombim.html` | 12–16px | 999px | 0 8px 32px (fire tint) |
| `prd_lokit.html` | 12px | 50% (avatar) | 0 8px 32px (cyan tint) |

### 6. Accent (페이지별 정체성)

| File | Accent | 용도 |
|------|--------|------|
| `global.css` | #818cf8 (indigo) + #e879f9 (fuchsia) | 사이트 전역 |
| `pm_portfolio.html` | #7dd3fc (sky) | CV 공간 전용 |
| `prd_Tikit.html` | #818CF8 + #E879F9 + #FF8C42 + #22D3EE | sprint별 배지 |
| `prd_boombim.html` | #FF6B35 (fire) | 프로젝트 시그니처 |
| `prd_lokit.html` | #00FFD1 (neon cyan) | 프로젝트 시그니처 |

## 통합 후보 토큰 제안

**공통화(→ `tokens.css`)해도 시각적 편차 거의 없는 항목**

| 토큰 | 값 | 영향 있는 파일 | 편차 |
|------|----|----------------|------|
| `--color-bg` | `#0a0a0b` | boombim #0d0d0d, lokit #08090c | 눈에 안 띄는 미세 차 |
| `--color-surface` | `#16161a` | boombim #1a1a1a, lokit #0f1117 | 체감 거의 없음 |
| `--color-border` | `#26262b` | boombim #3a3a3a, lokit #232733 | boombim은 약간 더 밝아지는 변화 |
| `--color-text` | `#f4f4f5` | 전부 유사 | 편차 무 |
| `--color-text-muted` | `#a1a1aa` | 전부 유사 | 편차 무 |
| `--font-mono` | `JetBrains Mono / SF Mono / Menlo / monospace` | boombim이 Space Mono에서 바뀜 | boombim 표기 글자가 살짝 달라짐 |
| `--radius-panel` | `12px` | Astro 14 → 12, Tikit 20 → 12, CV 4 → 12 | CV는 체감 변화 있음(날카로움 → 둥글) |
| `--radius-pill` | `999px` | 전부 동일 | — |
| `--shadow-panel` | `0 8px 24px -6px rgba(0,0,0,0.5)` | Tikit 더 진한 그림자, PRD 각자 accent tint 그림자 사용 | **페이지별 유지 권장** |

**페이지별로 유지 권장**
- `--accent` (각 프로젝트 시그니처 컬러 — 브랜드 식별의 핵심)
- Display font (boombim/lokit의 Outfit은 의도된 감성)
- h1/h2의 사이즈·무게 (페이지 hero가 각자의 시그니처 표현)
- Section v-padding (Astro는 fluid, PRD는 80px 고정 — 이건 페이지 밀도 차라 유지)

## 권장 진행 순서

1. **이 리포트 머지** (변경 없음, 기록만)
2. `src/styles/tokens.css` 추가 — 위 9개 공통 토큰 정의
3. `global.css`가 tokens.css import 하도록 수정
4. `copy-case-studies.mjs`가 각 PRD HTML에 `<link rel="stylesheet" href="/prjt-blog/tokens.css">` 주입 + 각 `<style>` 블록의 중복 색상/radius 변수 선언을 `tokens.css`의 것을 쓰도록 덮어쓰기
5. 시각 회귀(regression) 체크 — 주요 페이지 4종 캡처 비교

## 열린 결정 사항

진행 전 확인하고 싶은 사항:

1. **body font 통일 범위**: 현재 boombim/lokit은 Noto Sans KR + Outfit을 쓰고, Tikit/CV는 Pretendard. 통일한다면 Pretendard로 가는 게 자연스러우나, boombim/lokit의 감성이 바뀜. 그대로 둬도 됩니다 (페이지별 시그니처로 처리).
2. **radius-panel 기준**: 12px 로 합의할지 14px 로 합의할지 (Astro 기준인 14px 가 편할 수 있음).
3. **shadow 공통화 범위**: 기본 패널 shadow 하나만 공통화하고, accent-tint shadow 는 페이지별로 두는 방안 권장. 반대 의견 있으시면 말씀 주세요.

## 방향 레퍼런스 — Studio Hazey (`studiohazey.com`)

"여백 + 단순한 타이포 + 정갈한 가독성"을 목표로 Hazey의 에디토리얼 감각을 참고한다. 그대로 복제는 아니고 가독 구조와 여백 리듬만 빌려옴.

### 차용할 요소
- **브래킷 kicker** — `[ DEVELOPMENT PM · 7 YEARS ]`처럼 대괄호로 감싼 에디토리얼 라벨
- **2톤 헤드라인** — 한 줄은 primary 흰색, 다른 한 줄은 muted로 흐리게 받쳐 리듬을 만듦
- **비대칭 2열 섹션** — 좌측(작은 kicker + 큰 제목) / 우측(본문 문단). About, Case Studies intro, CV 섹션 헤드에 적용
- **넉넉한 섹션 패딩 + 본문 line-height** — 호흡 공간 확대
- **`↗` / `→` 기호** — 외부 링크와 CTA에 방향 affordance 일관 부여
- **햄버거 메뉴 옵션** — 모바일(선택적으로 데스크톱도)에서 풀스크린 오버레이로 전환해 인지도 확보

### 유지하는 것
- 다크 테마 + 앰비언트 글로우 — 이미 같은 방향
- 각 케이스 스터디의 **고유 accent 컬러** — 프로젝트 정체성의 핵심이므로 통일하지 않음
- Pretendard 본문 폰트 — 한국어 가독이 최우선

### 바꾸는 것 (이 PR에서 바로 적용)
- **그라디언트 이름 강조 제거** — 랜딩·About의 "최대호"에 걸린 3색 그라디언트를 해제하고 기본 text 색으로 내림. 시그니처 색 없이도 큰 타이포 + 2톤 레이아웃으로 충분히 식별되며, "내용이 잘 읽히는 방향"에 부합.

### 뒤따르는 단계 (후속 PR)
1. 섹션 라벨 일괄 브래킷화 `[ LIKE THIS ]`
2. 랜딩 히어로 2톤 리듬 적용 (한 줄 white / 한 줄 muted)
3. About·CV·Case Studies intro 섹션을 비대칭 2열로 재편
4. 모든 외부/내부 링크에 `↗` 또는 `→` 일관 부여
5. 공용 `tokens.css` 추출 후 standalone HTML들이 동일 토큰을 참조하도록 이관
