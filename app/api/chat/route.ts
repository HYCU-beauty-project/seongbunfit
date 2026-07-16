import { NextRequest, NextResponse } from "next/server";
import { analyzeSkinConcern } from "@/lib/gemini/analyzer";
import { generateIntro } from "@/lib/gemini/intro";
import { getCategory } from "@/lib/ingredients";
import { applySafetyAdjustment } from "@/lib/safety";
import { mockLatency } from "@/lib/mockLatency";

/**
 * POST /api/chat — 피부 고민 텍스트를 받아 카테고리를 분류하고 성분 목록을 돌려줘요.
 *
 * 지금은 진짜 백엔드 없이, 이 라우트 자체가 "Mock API" 역할을 해요 — lib/ingredients.ts의
 * 더미 데이터를 그대로 응답으로 돌려주기 때문에, 프론트엔드(ChatWindow.tsx)는 이 응답
 * 형태(shape)만 보고 완전히 독립적으로 테스트할 수 있어요. 실제 백엔드가 붙어도
 * 이 응답 shape({categoryKey, label, intro, ingredients, safetyNotice, usedAi})는
 * 그대로 유지하면 프론트 코드를 거의 안 고쳐도 돼요.
 *
 * 로딩 상태 테스트: .env.local에 MOCK_LATENCY_MS=2000을 넣으면 인위적으로 지연을
 * 줄 수 있어요(lib/mockLatency.ts).
 */
export async function POST(req: NextRequest) {
  try {
    await mockLatency();
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text : "";

    if (!text.trim()) {
      return NextResponse.json({ error: "text가 비어있어요." }, { status: 400 });
    }

    const { categoryKey, usedAi, clarifyingQuestion } = await analyzeSkinConcern(text);

    if (clarifyingQuestion) {
      return NextResponse.json({ categoryKey: null, usedAi, clarifyingQuestion });
    }

    if (!categoryKey) {
      return NextResponse.json({ categoryKey: null, usedAi, unsupported: true });
    }

    const rawCategory = getCategory(categoryKey);

    // 안전장치: 자극 신호(이미 자극된 피부)나 조합 주의(레티놀+비타민C 등) 둘 중
    // 하나라도 감지되면, 자극 성분이 "추천" 배지를 달고 1순위로 나가지 않게 조정하고
    // 경고 문구를 추가해요. AI 분류 결과와 상관없이 항상 체크하는 마지막 안전장치예요.
    const { category, notice } = applySafetyAdjustment(rawCategory, text);

    const intro = await generateIntro(text, category);

    return NextResponse.json({
      categoryKey: category.key,
      label: category.label,
      intro,
      ingredients: category.ingredients,
      safetyNotice: notice,
      usedAi,
    });
  } catch (error) {
    console.error("[api/chat] error:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했어요." }, { status: 500 });
  }
}
