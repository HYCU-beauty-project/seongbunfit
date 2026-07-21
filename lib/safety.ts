import type { Category, Ingredient } from "@/types";
import { getAllUniqueIngredients } from "./ingredients";

// 사용자 문장에 이 표현 있으면 "피부가 이미 자극된 상태"로 간주.
// AI 분류 결과와 상관없이(AI가 카테고리 잘못 골라도) 항상 체크해서
// 자극 성분이 1순위로 안 나가게 막는 마지막 안전장치.
// AI 문장에 의존 안 하고 코드로 직접 체크해서 절대 빠지거나 완화 안 되게 함
const IRRITATION_SIGNALS = [
  "따갑",
  "따가",
  "자극",
  "화끈",
  "붉어",
  "붉은기",
  "홍조",
  "가렵",
  "가려",
  "간지러",
  "간지럽",
  "예민",
  "쓰라",
  "화상",
  "벗겨",
  "각질패드",
  "필링",
];

export function hasIrritationSignal(text: string): boolean {
  return IRRITATION_SIGNALS.some((kw) => text.includes(kw));
}

// 임신·수유 언급하면 어떤 카테고리로 분류되든(예: "기미"만 보고 주름·탄력으로
// 잘못 분류돼도) 레티놀 같은 임신 중 비권장 성분(Ingredient.pregnancyUnsafe)은
// 항상 추천에서 제외. 오탐(false positive)보다 놓치는(false negative) 쪽이
// 훨씬 위험한 항목이라 표현을 넉넉히 잡음
const PREGNANCY_SIGNALS = ["임신", "임산부", "임신부", "예비맘", "예비 맘", "예비엄마", "수유", "모유"];

export function hasPregnancySignal(text: string): boolean {
  return PREGNANCY_SIGNALS.some((kw) => text.includes(kw));
}

// "이 성분 썼는데 좁쌀 났어요", "히알루론산 알레르기 있어요"처럼 사용자가
// 특정 성분명 직접 언급하며 부작용·알레르기 얘기하면 그 성분은 카테고리
// 분류 결과와 무관하게 추천에서 제외. "카테고리 태그 하나만 보고 하드코딩된
// 세트 그대로 띄우는" 문제 막는 안전장치
const NEGATIVE_REACTION_SIGNALS = [
  "부작용",
  "안맞",
  "안 맞",
  "안 받",
  "안받",
  "트러블 났",
  "트러블났",
  "뒤집어",
  "좁쌀",
  "여드름 났",
  "여드름났",
  "뾰루지 났",
  "뾰루지났",
  "뒤집혔",
  "알레르기",
  "알러지",
];

// DB 성분명은 "병풀추출물"처럼 정식 명칭인데 사용자는 "병풀"이나 마케팅에서
// 흔한 "시카" 같은 축약형/별칭으로 말함. 정식 명칭만 매칭하면 다 놓쳐서
// 접미어 뗀 형태와 알려진 별칭도 같이 확인함
const INGREDIENT_ALIASES: Record<string, string[]> = {
  centella: ["시카", "병풀"],
};

function ingredientNameVariants(ingredient: Ingredient): string[] {
  const variants = [ingredient.name];
  const stripped = ingredient.name.replace(/(추출물|엔피)$/, "");
  if (stripped !== ingredient.name && stripped.length >= 2) variants.push(stripped);
  const aliases = INGREDIENT_ALIASES[ingredient.id];
  if (aliases) variants.push(...aliases);
  return variants;
}

export function findComplainedIngredientIds(text: string): string[] {
  const hasNegativeSignal = NEGATIVE_REACTION_SIGNALS.some((kw) => text.includes(kw));
  if (!hasNegativeSignal) return [];
  return getAllUniqueIngredients()
    .filter((ingredient) => ingredientNameVariants(ingredient).some((variant) => text.includes(variant)))
    .map((ingredient) => ingredient.id);
}

// 활성 성분 두 개 이상을 "같이/함께 쓴다" 뉘앙스로 언급하면 병용 시 자극
// 알려진 조합에 한해 별도 주의 문구 띄움. 정확한 함량·배합 판단은 불가라서
// "순서/시간 나눠 쓰는 게 일반적" 수준으로만 안내. 확정적인 의학적 조언처럼
// 안 보이게 조심함
const KNOWN_CAUTION_PAIRS: { names: [string[], string[]]; notice: string }[] = [
  {
    names: [
      ["레티놀", "retinol"],
      ["비타민c", "비타민 c", "비타민씨"],
    ],
    notice:
      "💡 레티놀과 비타민C를 함께 언급해 주셨는데, 두 성분을 같은 시간에 같이 바르면 자극이 있을 수 있어요. " +
      "보통 아침엔 비타민C, 저녁엔 레티놀처럼 시간을 나눠 쓰는 걸 많이들 추천해요. 정확한 루틴은 피부과 상담을 받아보세요.",
  },
  {
    names: [
      ["레티놀", "retinol"],
      ["살리실산", "bha"],
    ],
    notice:
      "💡 레티놀과 살리실산을 함께 언급해 주셨는데, 두 성분을 한 번에 같이 쓰면 자극·건조가 심해질 수 있어요. " +
      "같은 루틴에 같이 쓰기보다는 요일을 나누거나 순서를 두는 걸 추천해요. 정확한 루틴은 피부과 상담을 받아보세요.",
  },
];

export function getCombinationCaution(text: string): string | null {
  const lower = text.toLowerCase();
  for (const pair of KNOWN_CAUTION_PAIRS) {
    const [groupA, groupB] = pair.names;
    const hasA = groupA.some((n) => lower.includes(n));
    const hasB = groupB.some((n) => lower.includes(n));
    if (hasA && hasB) return pair.notice;
  }
  return null;
}

export interface SafetyAdjustment {
  category: Category;
  notice: string | null;
}

/**
 * 자극 신호(이미 자극된 피부), 임신·수유, 사용자가 직접 언급한 부작용 성분, 조합
 * 주의(레티놀+비타민C 등) 중 하나라도 감지되면 해당 성분을 목록에서 아예 제거함
 *
 * 예전엔 "맨 뒤로 밀고 캡션에 경고 붙이는" 방식이었는데, 성분 카드가 기본
 * 접힌 상태라 caution 문구는 펼쳐야만 보임. 목록 끝에 있어도 얼핏 보면
 * 정상 추천 카드처럼 보이고, 배너에선 "제외했다" 해놓고 목록엔 그대로 있어서
 * 모순으로 보이는 문제 있었음. 그래서 아예 목록에서 빼는 방식으로 바꿈.
 * 제외된 성분은 카드 자체가 없고, 뭐가 왜 빠졌는지는 상단 notice 배너에
 * 이름 콕 집어 안내함
 *
 * notice는 화면에 별도 경고 박스로 항상 표시됨. AI가 생성하는 인사말과
 * 독립이라 AI 응답이 이상해도 이 경고만큼은 항상 그대로 노출됨
 */
export function applySafetyAdjustment(
  category: Category,
  text: string
): SafetyAdjustment {
  const irritated = hasIrritationSignal(text);
  const pregnant = hasPregnancySignal(text);
  const combinationNotice = getCombinationCaution(text);
  const complainedIds = findComplainedIngredientIds(text);

  const needsAdjustment =
    irritated || pregnant || combinationNotice !== null || complainedIds.length > 0;

  if (!needsAdjustment) return { category, notice: null };

  // 성분 하나가 여러 이유로 걸릴 수 있어서(예: 임신 중 + 레티놀=irritant도 true)
  // 우선순위 순으로 딱 하나의 이유만 고름. exclusionReason이 null 아니면 제외 대상
  function exclusionReason(ingredient: Ingredient): string | null {
    if (pregnant && ingredient.pregnancyUnsafe) {
      return "임신·수유 중에는 사용이 권장되지 않는 성분이에요.";
    }
    if (complainedIds.includes(ingredient.id)) {
      return "이미 트러블·알레르기 반응이 있었다고 하신 성분이에요.";
    }
    if (irritated && ingredient.irritant) {
      return "지금처럼 피부에 자극 증상이 있을 땐 권장하지 않는 성분이에요.";
    }
    return null;
  }

  const withReason = category.ingredients.map((ingredient) => ({
    ingredient,
    reason: exclusionReason(ingredient),
  }));

  const safe = withReason.filter((x) => x.reason === null).map((x) => x.ingredient);
  const excluded = withReason.filter((x) => x.reason !== null);
  const excludedNames = excluded.map((x) => x.ingredient.name);

  const notices = [
    pregnant
      ? "🚫 임신·수유 중이라고 말씀해 주셨어요. 레티놀(비타민A 유도체)처럼 임신·수유 중 사용이 " +
        "권장되지 않는 성분은 아래 목록에서 아예 제외했어요. 사용 중인 모든 성분은 산부인과·피부과 " +
        "상담 후 사용을 결정하는 게 안전해요."
      : null,
    irritated
      ? "⚠️ 지금 말씀하신 내용에 따가움·붉은기 같은 자극 증상이 있는 것 같아요. " +
        "각질 제거 성분(살리실산 등)이나 레티놀 같은 자극성 성분은 아래 목록에서 제외했어요. " +
        "증상이 심하거나 계속되면 피부과 상담을 받아보세요."
      : null,
    combinationNotice,
    complainedIds.length > 0
      ? "🚫 말씀하신 내용에 특정 성분을 사용하고 트러블·알레르기 반응이 있었다는 내용이 있어서, " +
        "그 성분은 아래 목록에서 제외했어요. 다시 사용하시기 전엔 꼭 성분명을 직접 확인해 주세요."
      : null,
    excludedNames.length > 0 ? `제외된 성분: ${excludedNames.join(", ")}` : null,
  ].filter((n): n is string => Boolean(n));

  // 안전한 성분이 하나도 안 남으면(카테고리 성분 3개 전부 걸리는 극단 케이스)
  // 빈 목록 보여주기보단 원래 목록 그대로 두고 경고만 강하게 띄움
  if (safe.length === 0) {
    return { category, notice: notices.join("\n\n") || null };
  }

  const adjusted: Category = {
    ...category,
    ingredients: safe.map((ingredient, idx) => ({
      ...ingredient,
      recommended: idx === 0,
    })),
  };

  return { category: adjusted, notice: notices.join("\n\n") || null };
}
