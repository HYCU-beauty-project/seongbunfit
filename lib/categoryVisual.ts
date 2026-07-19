// 고민(카테고리)마다 작은 점 색을 고정 배정해요. 성분 색(ingredientVisual.ts)과는
// 완전히 별도의 보조 팔레트예요 — 성분 색은 카드 전체를 크게 물들이는 "주 색상",
// 이 점은 "같은 성분이라도 어떤 고민으로 저장했는지"를 살짝 덧붙여주는 "보조 신호"라
// 서로 튀지 않게 채도를 낮춰뒀어요.
//
// 카테고리 5종이 고정되어 있어서(lib/ingredients.ts) 해시 대신 라벨 기준으로
// 직접 배정했어요. 카테고리 라벨이 바뀌면 이 매핑도 같이 업데이트해주세요.
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
