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
  // 자극/각질제거 성분(살리실산, 레티놀 등) — 이미 피부가 자극된 상태일 땐
  // 이 성분을 1순위로 추천하면 안 돼요. lib/safety.ts에서 이 값을 보고 순위를 조정해요.
  irritant?: boolean;
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
  // 서버에서 안전 조정(자극 성분 순위 내림)이 적용된 실제 성분 목록이에요.
  // 없으면(예전 대화 기록) categoryKey로 정적 데이터를 다시 조회해서 폴백해요.
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
