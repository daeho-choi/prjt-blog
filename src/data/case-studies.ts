export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  role: string;
  year: string;
  accent: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'tikit',
    title: 'TIKIT',
    subtitle: '티켓처럼 공유하는 한국어 이벤트 초대장. 3주 만에 혼자 런칭한 웹 서비스.',
    role: '기획 · 개발 · 디자인 (1인)',
    year: '2026',
    accent: '#818CF8',
  },
  {
    slug: 'boombim',
    title: '붐빔 BoomBim',
    subtitle: '오프라인의 복작거림을 온라인에서도 — 실시간 혼잡도 공유.',
    role: 'PM · 기획',
    year: '2025',
    accent: '#FF6B35',
  },
  {
    slug: 'lokit',
    title: 'LOKIT',
    subtitle: '잠긴 선물카드를 링크로 주고받는 모바일 웹. 이벤트를 게임으로.',
    role: 'PM · 기획',
    year: '2025',
    accent: '#00FFD1',
  },
];
