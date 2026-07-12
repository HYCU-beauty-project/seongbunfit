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
