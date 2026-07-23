/**
 * 최종 점수 = (핵심성분 배치점수 × 0.60) + (ml당 가격점수 × 0.30) + (예산점수 × 0.10)
 * 팀 기획서(성분핏.pdf) 기준 가중치. 랜딩페이지 초기 시안의 50/30/20 문구와
 * 다르길래 확인해보니 60/30/10으로 최종 확정됨 (2026.07.12)
 *
 * calculator.ts에서 분리한 이유: ScoreExplainer(클라이언트 컴포넌트)가 이 상수만
 * 필요한데, calculator를 통째로 import하면 products.ts → supabase-js까지 딸려와서
 * 채팅 페이지 초기 번들이 커짐. 의존성 0인 이 파일로 빼서 양쪽이 여기서만 가져감
 */
export const SCORE_WEIGHTS = {
    placement: 0.6,
    price: 0.3,
    budget: 0.1,
};
