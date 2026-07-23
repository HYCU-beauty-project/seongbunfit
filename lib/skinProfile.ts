import type { Category, Ingredient, SkinBaseType } from "@/types";

// 피부타입 프로필. 유수분 축(baseType) + 민감도(sensitive) 2축.
// Gao 2021 대화형 추천 서베이의 "질문 기반 선호 유도"를 성분핏에 적용한 것.
// 얼굴 촬영 대신 설문으로 사용자 attribute를 물어서 프로필을 만듦
export interface SkinProfile {
  baseType: SkinBaseType;
  sensitive: boolean;
}

export function skinTypeLabel(profile: SkinProfile): string {
  const base =
    profile.baseType === "dry" ? "건성" : profile.baseType === "oily" ? "지성" : "복합성";
  return profile.sensitive ? `민감성 ${base}` : base;
}

// 설문 문항. Q1·Q2가 유수분 축(dry/oily/combination), Q3·Q4가 민감도 축.
// 각 선택지에 점수 부여해서 resolveSkinProfile이 집계함
export interface SkinQuestionOption {
  label: string;
  // 유수분 점수: 음수=건성 쪽, 양수=지성 쪽, tzone=복합성 신호
  moisture?: number;
  tzone?: boolean;
  // 민감도 점수: 높을수록 민감성
  sensitivity?: number;
}

export interface SkinQuestion {
  id: string;
  question: string;
  options: SkinQuestionOption[];
}

export const SKIN_QUESTIONS: SkinQuestion[] = [
  {
    id: "q1",
    question: "세안하고 30분쯤 지나면 피부가 어떤가요?",
    options: [
      { label: "당기고 거칠어요", moisture: -2 },
      { label: "T존만 번들거려요", tzone: true },
      { label: "전체적으로 번들거려요", moisture: 2 },
    ],
  },
  {
    id: "q2",
    question: "평소 유분기는 어느 정도인가요?",
    options: [
      { label: "거의 없어요, 오히려 각질이", moisture: -2 },
      { label: "T존만 유분기 있어요", tzone: true },
      { label: "하루 종일 번들거려요", moisture: 2 },
    ],
  },
  {
    id: "q3",
    question: "새 화장품을 바르면 붉어지거나 따가운가요?",
    options: [
      { label: "자주 그래요", sensitivity: 2 },
      { label: "가끔 그래요", sensitivity: 1 },
      { label: "거의 없어요", sensitivity: 0 },
    ],
  },
  {
    id: "q4",
    question: "환절기나 컨디션에 따라 피부가 예민해지나요?",
    options: [
      { label: "쉽게 예민해져요", sensitivity: 2 },
      { label: "가끔 그래요", sensitivity: 1 },
      { label: "큰 변화 없어요", sensitivity: 0 },
    ],
  },
];

// 각 문항에서 고른 선택지 인덱스 배열 → 프로필 판정.
// answers[i]는 SKIN_QUESTIONS[i]에서 고른 옵션 인덱스
export function resolveSkinProfile(answers: number[]): SkinProfile {
  let moisture = 0;
  let tzoneCount = 0;
  let sensitivity = 0;

  SKIN_QUESTIONS.forEach((q, i) => {
    const opt = q.options[answers[i]];
    if (!opt) return;
    if (opt.moisture) moisture += opt.moisture;
    if (opt.tzone) tzoneCount += 1;
    if (opt.sensitivity) sensitivity += opt.sensitivity;
  });

  // T존 신호가 있으면서 유수분이 한쪽으로 크게 안 쏠리면 복합성
  let baseType: SkinBaseType;
  if (tzoneCount >= 1 && Math.abs(moisture) <= 1) {
    baseType = "combination";
  } else if (moisture < 0) {
    baseType = "dry";
  } else if (moisture > 0) {
    baseType = "oily";
  } else {
    baseType = "combination";
  }

  return { baseType, sensitive: sensitivity >= 2 };
}

export interface SkinTypeAdjustment {
  category: Category;
  notice: string | null;
}

// 피부타입 프로필로 성분 "순서만" 재정렬함. safety.ts는 위험 성분을 제거(양보 불가)하지만
// 여기는 선호 문제라 제거 안 하고 하향/상향만. 그래서 반드시 applySafetyAdjustment
// "다음"에 호출해야 안전 제외를 못 되돌림.
// safety.ts와 같은 규약: 프로필 없으면 원본 그대로 반환, notice는 AI 문장과 독립
export function applySkinTypePreference(
  category: Category,
  profile: SkinProfile | null
): SkinTypeAdjustment {
  if (!profile) return { category, notice: null };

  // 성분마다 이 프로필에 얼마나 맞는지 점수. 높을수록 앞으로.
  // 안 맞아도 제거는 안 하고 뒤로만 보냄
  function fitScore(ing: Ingredient): number {
    let score = 0;
    if (ing.suitableFor?.includes(profile!.baseType)) score += 2;
    if (ing.cautionFor?.includes(profile!.baseType)) score -= 2;
    if (profile!.sensitive) {
      if (ing.sensitiveFriendly === true) score += 1;
      if (ing.sensitiveFriendly === false) score -= 2;
    }
    return score;
  }

  const scored = category.ingredients.map((ing, idx) => ({
    ing,
    score: fitScore(ing),
    idx, // 동점이면 원래 순서 유지용
  }));

  // 재정렬이 실제로 순서를 바꾸는지 확인. 다 동점이면 굳이 안내 안 띄움
  const anyDiff = scored.some((s) => s.score !== 0);
  if (!anyDiff) return { category, notice: null };

  scored.sort((a, b) => b.score - a.score || a.idx - b.idx);

  const reordered: Category = {
    ...category,
    ingredients: scored.map((s, idx) => ({
      ...s.ing,
      recommended: idx === 0, // 재정렬 후 첫 성분에 추천 배지 재부여
    })),
  };

  const label = skinTypeLabel(profile);
  const topName = reordered.ingredients[0].name;
  const notice =
    `${label} 피부에 맞춰 순서를 조정했어요. ${topName}처럼 잘 맞는 성분을 앞에 놓고, ` +
    `자극이 될 수 있는 성분은 뒤로 뒀어요.`;

  return { category: reordered, notice };
}
