import { categories, matchCategory } from "@/lib/ingredients";
import type { CategoryKey } from "@/types";

export interface AnalyzeResult {
  categoryKey: CategoryKey;
  usedAi: boolean;
}

const SYSTEM_PROMPT = `당신은 화장품 성분 안내 챗봇 "성분핏"의 분석 엔진입니다.
사용자의 피부 고민 문장을 다음 5개 카테고리 중 하나로만 분류하세요: wrinkle(주름·탄력), brightening(미백·잡티), hydration(수분·건조), pore(모공·트러블), texture(피부결·광채).
반드시 카테고리 key 하나만 소문자 영문으로 답하세요. 화장품 성분 상담 이외의 질문(의료 진단, 다른 주제 등)에는 "unsupported"라고만 답하세요.`;

/**
 * 사용자의 자연어 피부 고민을 5개 카테고리 중 하나로 분류합니다.
 * OPENAI_API_KEY가 설정되어 있으면 GPT-4o로 분석하고,
 * 없으면 키워드 매칭(lib/ingredients.ts matchCategory)으로 폴백합니다.
 *
 * LangChain 연동 시: 이 함수를 체인의 첫 단계(입력 분석)로 사용하고,
 * 이어서 DB 조회 -> 가성비 스코어링(lib/scoring/calculator.ts) -> 결과 요약 순으로 연결하면 됩니다.
 */
export async function analyzeSkinConcern(userText: string): Promise<AnalyzeResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn(
      "[openai analyzer] OPENAI_API_KEY가 감지되지 않았어요 — 키워드 매칭으로 동작해요. " +
        ".env.local에 키를 넣었다면 서버(npm run dev)를 재시작했는지 확인해 주세요."
    );
    return { categoryKey: matchCategory(userText).key, usedAi: false };
  }

  console.log(`[openai analyzer] 키 감지됨 (${apiKey.slice(0, 7)}...${apiKey.slice(-4)}), GPT-4o 호출 중…`);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0,
        max_tokens: 10,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userText },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      throw new Error(`OpenAI 응답 오류: ${response.status} ${errBody}`);
    }

    const data = await response.json();
    const raw = (data.choices?.[0]?.message?.content ?? "")
      .trim()
      .toLowerCase()
      .replace(/[`"'*_.!?]/g, ""); // 모델이 가끔 붙이는 마침표/따옴표/마크다운 기호 등을 제거
    const matched = categories.find(
      (c) => raw === c.key || raw.startsWith(c.key) || raw.includes(c.key)
    );

    if (matched) {
      console.log(`[openai analyzer] ✅ GPT-4o 사용됨 — "${userText}" → ${matched.key}`);
      return { categoryKey: matched.key, usedAi: true };
    }
    console.warn(
      `[openai analyzer] GPT-4o 응답을 알 수 없어 폴백 사용 — 받은 값(원문): "${data.choices?.[0]?.message?.content}"`
    );
    return { categoryKey: matchCategory(userText).key, usedAi: false };
  } catch (error) {
    console.error("[openai analyzer] ❌ GPT-4o 호출 실패, 폴백 사용:", error);
    return { categoryKey: matchCategory(userText).key, usedAi: false };
  }
}
