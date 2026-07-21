// 고민(카테고리)마다 작은 점 색 고정 배정. 성분 색(ingredientVisual.ts)과는
// 별도의 보조 팔레트임. 성분 색은 카드 전체 물들이는 주 색상이고
// 이 점은 "같은 성분이라도 어떤 고민으로 저장했는지" 덧붙이는 보조 신호라서
// 안 튀게 채도 낮춰둠
//
// 카테고리 5종 고정이라(lib/ingredients.ts) 해시 대신 라벨 기준으로 직접 배정
// 카테고리 라벨 바뀌면 이 매핑도 같이 업데이트해야 함
const CATEGORY_COLORS: Record<string, string> = {
  "주름·탄력": "#8b5cf6",
  "미백·잡티": "#f0ad4e",
  "수분·건조": "#4a9fd8",
  "모공·트러블": "#3fb37f",
  "피부결·광채": "#e0699a",
};

const FALLBACK_COLOR = "#94a3b8";

export function getCategoryColor(categoryLabel: string | null | undefined): string {
  if (!categoryLabel) return FALLBACK_COLOR;
  return CATEGORY_COLORS[categoryLabel] ?? FALLBACK_COLOR;
}
