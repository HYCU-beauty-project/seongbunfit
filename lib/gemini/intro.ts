import type { Category } from "@/types";

const MODEL = "gemini-3.1-flash-lite";
const FALLBACK_MODEL = "gemini-flash-latest";

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

const SYSTEM_PROMPT = `당신은 화장품 성분 추천 챗봇 "성분핏"입니다.
사용자가 방금 말한 피부 고민 문장과, 이미 분류된 카테고리가 주어집니다.
사용자의 표현을 자연스럽게 반영해서, 공감하며 성분을 보여주겠다는 1~2문장짜리 인사말을 작성하세요.

사용자가 특정 질문을 했다면(예: "같이 써도 되나요", "순서가 어떻게 되나요", "루틴을 어떻게 짜야 하나요")
그 질문을 못 본 척 무시하지 말고, "성분 조합이나 사용 순서까지는 제가 정확히 답해드리기 어려워서
아래 성분 정보의 주의사항을 참고해주세요" 정도로 짧게 짚어주세요. 성분 간 궁합이나 안전성을
당신이 직접 판단해서 답하지 마세요(정확하지 않을 수 있어요).

존댓말을 쓰고, 마크다운이나 따옴표 없이 순수 텍스트로만 답하세요. 성분 이름은 언급하지 마세요.`;

/**
 * 사용자가 실제로 쓴 표현을 반영한 자연스러운 인트로 문장을 AI가 생성합니다.
 * 예: "피부가 따가워요" → "따가움이 느껴지시는군요! 자극 완화에 도움이 될 성분을 보여드릴게요."
 * 키가 없거나 실패하면 category.intro 고정 템플릿으로 폴백해요.
 */
export async function generateIntro(userText: string, category: Category): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const fallback = category.intro;
  if (!apiKey) return fallback;

  const prompt = `사용자 문장: "${userText}"\n분류된 카테고리: ${category.label}`;

  for (const model of [MODEL, FALLBACK_MODEL]) {
    try {
      // 키를 쿼리스트링에 넣으면 프록시·로그에 남을 수 있어서 헤더로 보내요(Google 권장).
      // 8초 안에 응답이 없으면 끊고 템플릿 인사말로 폴백해요.
      const response = await fetch(geminiUrl(model), {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 220 },
        }),
      });

      if (!response.ok) {
        if (model === MODEL && response.status === 404) continue;
        throw new Error(`Gemini 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const text: string = candidate?.content?.parts?.[0]?.text?.trim() ?? "";

      // finishReason이 MAX_TOKENS면 문장이 중간에 잘렸다는 뜻이라, 어색하게 끊긴 문장을
      // 그대로 보여주는 대신 안전하게 템플릿으로 폴백해요.
      if (candidate?.finishReason === "MAX_TOKENS") {
        console.warn("[gemini intro] 응답이 토큰 한도로 잘려서 템플릿으로 폴백:", text);
        return fallback;
      }

      return text || fallback;
    } catch (error) {
      console.error("[gemini intro] 인트로 생성 실패, 템플릿으로 폴백:", error);
      return fallback;
    }
  }

  return fallback;
}
