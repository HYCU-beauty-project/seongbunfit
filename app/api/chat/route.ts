import { NextRequest, NextResponse } from "next/server";
import { analyzeSkinConcern } from "@/lib/gemini/analyzer";
import { generateIntro } from "@/lib/gemini/intro";
import { getCategory } from "@/lib/ingredients";
import { applySafetyAdjustment } from "@/lib/safety";
import { mockLatency } from "@/lib/mockLatency";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";

// 고민 문장 최대 길이. 이보다 길면 프롬프트 부풀리는 남용에 가까움
// (토큰 비용·지연 증폭) → 서버에서 거절
const MAX_TEXT_LENGTH = 500;

/**
 * POST /api/chat: 피부 고민 텍스트 받아서 카테고리 분류 + 성분 목록 응답
 *
 * 아직 진짜 백엔드 없음. 이 라우트가 Mock API 역할로 lib/ingredients.ts 더미 데이터를
 * 그대로 돌려줌. 프론트(ChatWindow.tsx)는 응답 shape만 보고 독립 테스트 가능.
 * 나중에 실제 백엔드 붙어도 shape({categoryKey, label, intro, ingredients,
 * safetyNotice, usedAi})만 유지하면 프론트 거의 안 고쳐도 됨
 *
 * 로딩 테스트: .env.local에 MOCK_LATENCY_MS=2000 넣으면 지연 걸림 (lib/mockLatency.ts)
 */
export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(getClientIp(req))) {
      return NextResponse.json(
        { error: "요청이 너무 잦아요. 잠시 후 다시 시도해 주세요." },
        { status: 429 },
      );
    }

    await mockLatency();
    // 본문이 JSON 아니면 500 말고 400으로
    const body = await req.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text : "";

    if (!text.trim()) {
      return NextResponse.json({ error: "text가 비어있어요." }, { status: 400 });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `고민은 ${MAX_TEXT_LENGTH}자 이내로 입력해 주세요.` },
        { status: 400 },
      );
    }

    const { categoryKey, usedAi, clarifyingQuestion } = await analyzeSkinConcern(text);

    if (clarifyingQuestion) {
      return NextResponse.json({ categoryKey: null, usedAi, clarifyingQuestion });
    }

    if (!categoryKey) {
      return NextResponse.json({ categoryKey: null, usedAi, unsupported: true });
    }

    const rawCategory = getCategory(categoryKey);

    // 자극 신호(이미 자극된 피부)나 조합 주의(레티놀+비타민C 등) 감지되면
    // 자극 성분이 "추천" 배지 달고 1순위로 안 나가게 조정 + 경고 문구 추가.
    // AI 분류 결과와 상관없이 항상 도는 마지막 안전장치임
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
