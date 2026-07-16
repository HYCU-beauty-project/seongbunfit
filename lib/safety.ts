import type { Category } from "@/types";

// 사용자 문장에 이 표현이 있으면 "피부가 이미 자극된 상태"로 간주해요.
// AI 분류 결과와 상관없이(=AI가 카테고리를 잘못 골라도) 항상 체크해서, 어떤
// 카테고리로 분류되든 자극 성분이 1순위로 나가지 않게 막는 마지막 안전장치예요.
// AI가 생성하는 문장에 의존하지 않고 코드로 직접 체크해서, 절대 빠지거나
// 완화되지 않게 했어요.
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

// 사용자가 두 가지 이상의 활성 성분을 "같이/함께 쓴다"는 뉘앙스로 언급하면, 병용 시
// 자극이 있을 수 있는 잘 알려진 조합에 한해 별도 주의 문구를 띄워요. 정확한 함량·배합
// 판단은 저희가 할 수 없어서, "이런 조합은 순서/시간을 나눠 쓰는 게 일반적으로 권장돼요"
// 정도로 안전하게만 안내해요 — 확정적인 의학적 조언처럼 보이지 않게 조심했어요.
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
 * 자극 신호(이미 자극된 피부)나 조합 주의(레티놀+비타민C 등)가 감지되면, 살리실산·
 * 레티놀처럼 자극을 줄 수 있는 성분(Ingredient.irritant === true)이 "추천" 배지를
 * 달고 1순위로 나가지 않도록 순서를 조정해요. 경고 문구만 띄우고 정작 그 성분을 여전히
 * 1순위로 추천하면 모순이라, 두 안전장치를 하나로 합쳤어요.
 *
 * notice는 화면에 별도 경고 박스로 항상 표시돼요 — AI가 생성하는 인사말 문장과는
 * 독립적이라, AI 응답이 이상하게 나와도 이 경고만큼은 항상 그대로 노출돼요.
 */
export function applySafetyAdjustment(
  category: Category,
  text: string
): SafetyAdjustment {
  const irritated = hasIrritationSignal(text);
  const combinationNotice = getCombinationCaution(text);
  const needsAdjustment = irritated || combinationNotice !== null;

  const notices = [
    irritated
      ? "⚠️ 지금 말씀하신 내용에 따가움·붉은기 같은 자극 증상이 있는 것 같아요. " +
        "각질 제거 성분(살리실산 등)이나 레티놀 같은 자극성 성분은 피부가 진정된 후에 사용을 권장해요. " +
        "증상이 심하거나 계속되면 피부과 상담을 받아보세요."
      : null,
    combinationNotice,
  ].filter((n): n is string => Boolean(n));

  if (!needsAdjustment) return { category, notice: null };

  const hasIrritant = category.ingredients.some((i) => i.irritant);
  if (!hasIrritant) return { category, notice: notices.join("\n\n") || null };

  const safeFirst = category.ingredients.find((i) => !i.irritant);

  const adjusted: Category = {
    ...category,
    ingredients: category.ingredients.map((ingredient) => ({
      ...ingredient,
      recommended: safeFirst ? ingredient.id === safeFirst.id : !ingredient.irritant,
    })),
  };

  return { category: adjusted, notice: notices.join("\n\n") || null };
}
