// 성분마다 전용 아이콘 만들기엔 리소스 많이 들어서, 성분 ID 해시로
// 고정 색상 배정해서 가볍게 구분함. 같은 성분은 앱 어디서나 항상 같은 색.
// 나중에 진짜 성분별 아이콘 생기면 이 파일만 바꾸면 됨
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
