// 성분마다 전용 아이콘을 만들기엔 리소스가 많이 들어서, 성분 ID를 해시해서
// 고정된 색상을 배정하는 방식으로 가볍게 시각적 구분을 줘요. 같은 성분은 앱 어디서나
// 항상 같은 색으로 보여요. 나중에 진짜 성분별 아이콘이 생기면 이 파일만 바꾸면 돼요.
const PALETTE = [
  "#534ab7", // 성분핏 메인 보라
  "#7c6fdb",
  "#a99ce0",
  "#5b9bd5",
  "#4fb0a5",
  "#e0a458",
  "#d97a6c",
  "#c26bb0",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getIngredientColor(ingredientId: string): string {
  return PALETTE[hashString(ingredientId) % PALETTE.length];
}
