import type { Category, Ingredient } from "@/types";

// Supabase 연동 시 이 파일이 ingredients 테이블이 됨.
// 지금은 categories 배열 안에 성분 중첩(카테고리당 3개)이지만
// 실제 테이블에선 ingredients가 독립 행이고 category_key 컬럼으로 연결됨.
// 전체 스키마는 lib/supabase/schema.sql 참고
export const categories: Category[] = [
  {
    key: "wrinkle",
    label: "주름·탄력",
    keywords: ["주름", "탄력", "눈가", "팔자", "처짐", "노화", "안티에이징", "늘어짐", "쳐짐"],
    intro: "주름·탄력 고민이시군요! 아래 성분 중 관심 있는 걸 선택해주세요.",
    ingredients: [
      {
        id: "retinol",
        name: "레티놀",
        refPosition: 12,
        effect: "주름 개선 대표 성분. 피부 재생 촉진, 초반 자극 주의.",
        caution: "초반 자극·각질 가능, 자외선 차단 필수. 피부가 이미 붉거나 따가운 상태라면 진정 후 사용하세요.",
        goodFor: "일반~지성, 저농도(0.01~0.3%)부터 권장",
        recommended: true,
        irritant: true,
        pregnancyUnsafe: true,
      },
      {
        id: "adenosine",
        name: "아데노신",
        refPosition: 15,
        effect: "식약처 인정 주름 개선 성분. 자극이 적어 민감성에도 적합.",
        caution: "비교적 순해 대부분 피부에 사용 가능해요.",
        goodFor: "민감성 피부의 주름 케어",
      },
      {
        id: "peptide",
        name: "펩타이드",
        refPosition: 12,
        effect: "콜라겐 합성 자극, 탄력 개선. 순해서 꾸준히 사용 가능.",
        caution: "특별한 주의사항은 적은 편이에요.",
        goodFor: "탄력이 떨어지기 시작한 피부",
      },
    ],
  },
  {
    key: "brightening",
    label: "미백·잡티",
    keywords: ["미백", "잡티", "기미", "색소", "톤", "칙칙"],
    intro: "미백·잡티 고민이시군요! 아래 성분 중 관심 있는 걸 선택해주세요.",
    ingredients: [
      {
        id: "vitaminc",
        name: "비타민C",
        refPosition: 10,
        effect: "멜라닌 생성을 억제해 잡티와 톤을 개선해요.",
        caution: "산화되기 쉬워 밀폐 용기 제품을 고르세요.",
        goodFor: "잡티, 칙칙한 피부톤이 고민인 피부",
        recommended: true,
      },
      {
        id: "niacinamide",
        name: "나이아신아마이드",
        refPosition: 7,
        effect: "색소침착 개선과 피부 장벽 강화에 효과적이에요.",
        caution: "고농도 제품은 초기 홍조가 있을 수 있어요.",
        goodFor: "잡티, 모공이 함께 고민인 피부",
      },
      {
        id: "arbutin",
        name: "알부틴",
        refPosition: 15,
        effect: "미백 기능성 고시 성분으로 색소 개선에 도움을 줘요.",
        caution: "임산부는 사용 전 확인이 필요해요.",
        goodFor: "기미, 색소침착이 고민인 피부",
      },
    ],
  },
  {
    key: "hydration",
    label: "수분·건조",
    keywords: ["수분", "건조", "당김", "속건조", "보습", "푸석", "메마름"],
    intro: "수분·건조 고민이시군요! 아래 성분 중 관심 있는 걸 선택해주세요.",
    ingredients: [
      {
        id: "hyaluronic",
        name: "히알루론산",
        refPosition: 20,
        effect: "자기 무게의 수백 배 수분을 끌어당겨 보습해요.",
        caution: "건조한 환경에서는 로션과 함께 사용하세요.",
        goodFor: "속건조, 당김이 심한 피부",
        recommended: true,
      },
      {
        id: "ceramide",
        name: "세라마이드엔피",
        refPosition: 25,
        effect: "피부 장벽을 채워 수분 손실을 막아줘요.",
        caution: "유분감이 있을 수 있어 지성 피부는 소량 사용하세요.",
        goodFor: "장벽이 약해진 예민 건성 피부",
      },
      {
        id: "panthenol",
        name: "판테놀",
        refPosition: 12,
        effect: "진정과 보습을 동시에 챙길 수 있어요.",
        caution: "특별한 주의사항은 적은 편이에요.",
        goodFor: "예민하고 건조한 피부",
      },
    ],
  },
  {
    key: "pore",
    label: "모공·트러블",
    keywords: ["모공", "트러블", "여드름", "블랙헤드", "피지", "뾰루지", "따가", "자극", "화끈", "예민", "붉어", "붉은기", "홍조", "가려", "간지러", "간지럽"],
    intro: "모공·트러블 고민이시군요! 아래 성분 중 관심 있는 걸 선택해주세요.",
    ingredients: [
      {
        id: "salicylic",
        name: "살리실산",
        refPosition: 15,
        effect: "모공 속 노폐물을 녹여 트러블 완화에 도움을 줘요.",
        caution: "각질이 얇아질 수 있어 자외선 차단이 중요해요. 피부가 이미 붉거나 따가운 상태라면 진정 후 사용하세요.",
        goodFor: "블랙헤드, 트러블이 잦은 지성 피부",
        recommended: true,
        irritant: true,
      },
      {
        id: "centella",
        name: "병풀추출물",
        refPosition: 10,
        effect: "진정 효과가 뛰어나 트러블 후 케어에 좋아요.",
        caution: "특별한 주의사항은 적은 편이에요.",
        goodFor: "트러블 후 예민해진 피부",
      },
      {
        id: "niacinamide",
        name: "나이아신아마이드",
        refPosition: 7,
        effect: "피지 분비를 조절하고 모공을 관리해줘요.",
        caution: "고농도 제품은 초기 홍조가 있을 수 있어요.",
        goodFor: "넓은 모공, 번들거림이 고민인 피부",
      },
    ],
  },
  {
    key: "texture",
    label: "피부결·광채",
    keywords: ["피부결", "광채", "윤광", "결", "생기"],
    intro: "피부결·광채 고민이시군요! 아래 성분 중 관심 있는 걸 선택해주세요.",
    ingredients: [
      {
        id: "niacinamide",
        name: "나이아신아마이드",
        refPosition: 7,
        effect: "피부결을 정돈하고 톤을 균일하게 해줘요.",
        caution: "고농도 제품은 초기 홍조가 있을 수 있어요.",
        goodFor: "결이 거칠고 칙칙한 피부",
        recommended: true,
      },
      {
        id: "vitaminc",
        name: "비타민C",
        refPosition: 10,
        effect: "항산화 작용으로 맑고 생기있는 피부를 만들어줘요.",
        caution: "산화되기 쉬워 밀폐 용기 제품을 고르세요.",
        goodFor: "생기 없고 칙칙한 피부",
      },
      {
        id: "panthenol",
        name: "판테놀",
        refPosition: 12,
        effect: "결을 부드럽게 정돈하고 광채를 더해줘요.",
        caution: "특별한 주의사항은 적은 편이에요.",
        goodFor: "거칠고 예민한 피부결",
      },
    ],
  },
];

// 키워드 하나도 안 맞으면 null 반환 (예: "안녕 오늘 날씨 어때" 같은 무관한 문장).
// 예전엔 해시로 아무 카테고리나 강제로 골랐는데, 그러면 "안녕"에도
// "주름 고민이시군요!" 라고 확신에 차서 틀리는 문제 있어서 없앰
export function matchCategory(input: string): Category | null {
  const normalized = input.trim();
  for (const category of categories) {
    if (category.keywords.some((kw) => normalized.includes(kw))) {
      return category;
    }
  }
  return null;
}

export function getCategory(key: string): Category {
  return categories.find((c) => c.key === key) ?? categories[0];
}

export function getIngredient(id: string): Ingredient | undefined {
  for (const category of categories) {
    const found = category.ingredients.find((i) => i.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getIngredientInCategory(
  categoryKey: string,
  ingredientId: string
): Ingredient | undefined {
  return getCategory(categoryKey).ingredients.find((i) => i.id === ingredientId);
}

// 특정 성분이 속한 카테고리(피부 고민) 목록. 나이아신아마이드처럼 여러 카테고리에 걸친 성분도 있음
export function getCategoriesForIngredient(ingredientId: string): Category[] {
  return categories.filter((c) => c.ingredients.some((i) => i.id === ingredientId));
}

// 카테고리 간 중복(예: 나이아신아마이드) 제거한 전체 성분 목록. 기준위치 참고표에 사용
export function getAllUniqueIngredients(): Ingredient[] {
  const seen = new Map<string, Ingredient>();
  for (const category of categories) {
    for (const ingredient of category.ingredients) {
      if (!seen.has(ingredient.id)) seen.set(ingredient.id, ingredient);
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.refPosition - b.refPosition);
}
