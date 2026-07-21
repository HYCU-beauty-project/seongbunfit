// 카테고리(피부 고민) 키
export type CategoryKey =
  | "wrinkle"
  | "brightening"
  | "hydration"
  | "pore"
  | "texture";

export interface Ingredient {
  id: string;
  name: string;
  refPosition: number; // 기준 위치 (해당 성분이 "충분히 앞쪽"이라 판단하는 기준 순번)
  effect: string;
  caution: string;
  goodFor: string;
  recommended?: boolean;
  // 자극/각질제거 성분(살리실산, 레티놀 등). 이미 자극된 피부엔 1순위 추천하면
  // 안 되는 성분. lib/safety.ts에서 이 값 보고 순위 조정함
  irritant?: boolean;
  // 임신·수유 중 비권장 성분(레티놀=비타민A 유도체 등).
  // lib/safety.ts에서 임신·수유 언급 감지되면 이 값 가진 성분 강제 제외.
  // 카테고리 분류 결과와 무관하게 항상 적용되는 안전장치임
  pregnancyUnsafe?: boolean;
}

export interface Category {
  key: CategoryKey;
  label: string;
  keywords: string[];
  intro: string;
  ingredients: Ingredient[];
}

// 예산 구간
export interface BudgetOption {
  id: string;
  label: string;
  min: number;
  max: number; // Infinity 허용 (무제한 상한)
}

// 더미 제품 데이터
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number; // 원
  volumeMl: number;
  ingredientId: string; // 핵심 성분 id
  actualPosition: number; // 베이스 성분 포함, 전체 전성분 리스트 기준 실제 배치 순번
  purchaseUrl: string;
  imageColor: string; // 더미 썸네일용 배경색
}

export interface ScoredProduct extends Product {
  placementScore: number;
  priceScore: number;
  budgetScore: number;
  finalScore: number;
  pricePerMl: number;
  reason?: string;
}

// 채팅 메시지
export interface UserMessage {
  id: string;
  role: "user";
  text: string;
  createdAt: number;
}

export interface AiIntroMessage {
  id: string;
  role: "ai";
  kind: "intro";
  text: string;
  createdAt: number;
}

export interface AiIngredientsMessage {
  id: string;
  role: "ai";
  kind: "ingredients";
  categoryKey: CategoryKey;
  intro?: string;
  // 서버에서 안전 조정(자극 성분 순위 내림) 적용된 실제 성분 목록.
  // 없으면(예전 대화 기록) categoryKey로 정적 데이터 다시 조회해서 폴백
  ingredients?: Ingredient[];
  safetyNotice?: string;
  usedAi?: boolean;
  createdAt: number;
}

export interface AiBudgetPromptMessage {
  id: string;
  role: "ai";
  kind: "budget-prompt";
  ingredientName: string;
  createdAt: number;
}

export interface AiResultMessage {
  id: string;
  role: "ai";
  kind: "result";
  categoryKey: CategoryKey;
  ingredientId: string;
  budgetId: string;
  results: ScoredProduct[];
  createdAt: number;
}

export interface AiTextMessage {
  id: string;
  role: "ai";
  kind: "text";
  text: string;
  createdAt: number;
}

export type ChatMessage =
  | UserMessage
  | AiIntroMessage
  | AiIngredientsMessage
  | AiBudgetPromptMessage
  | AiResultMessage
  | AiTextMessage;

export interface SelectedConditions {
  categoryKey: CategoryKey | null;
  ingredientId: string | null;
  budgetId: string | null;
}

// 비교함에 담긴 항목
export interface CompareItem {
  id: string; // = product.id (유니크)
  product: ScoredProduct;
  ingredientName: string;
  categoryLabel: string;
  addedAt: number;
}

// 즐겨찾기에 담긴 항목. 구조는 비교함과 같은데 목적이 달라서 타입 분리함
export interface FavoriteItem {
  id: string; // = product.id (유니크)
  product: ScoredProduct;
  ingredientName: string;
  categoryLabel: string;
  addedAt: number;
}
