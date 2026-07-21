import type { Ingredient, ScoredProduct } from "@/types";
import { reasonFor } from "@/lib/scoring/calculator";

const MODEL = "gemini-3.1-flash-lite";
const FALLBACK_MODEL = "gemini-flash-latest";

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

const SYSTEM_PROMPT = `당신은 화장품 성분 추천 챗봇 "성분핏"의 추천 이유 작성 담당입니다.
아래로 주어지는 실제 계산된 데이터(성분 배치 순위, 점수, 가격)만 근거로 1~2문장의 짧고
친근한 한국어 추천 이유를 작성하세요. 데이터에 없는 효과나 성분 함량(%)을 지어내지 마세요.
존댓말을 쓰고, 마크다운이나 따옴표 없이 순수 텍스트로만 답하세요.`;

/**
 * 계산된 점수를 근거로 AI가 자연스러운 추천 이유 문장을 생성합니다.
 * GEMINI_API_KEY가 없거나 호출에 실패하면 lib/scoring/calculator.ts의 템플릿 문장으로 폴백해요.
 * (숫자 계산 자체는 AI가 하지 않아요 — scoreProducts()가 이미 계산해둔 값을 "설명"만 맡겨요.
 * 그래야 AI가 점수를 잘못 지어내는 일 없이, 진짜 계산된 데이터에 기반한 설명이 나와요.)
 */
export async function generateReason(product: ScoredProduct, ingredient: Ingredient): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const fallback = reasonFor(product, ingredient);

  if (!apiKey) return fallback;

  const dataSummary = `성분: ${ingredient.name}
전성분 배치 순번: ${product.actualPosition}번째 (기준 ${ingredient.refPosition}번째, 배치 점수 ${product.placementScore}점)
용량 대비 가격 점수: ${product.priceScore}점 (ml당 ${Math.round(product.price / product.volumeMl)}원)
예산 적합 점수: ${product.budgetScore}점
최종 가성비 지수: ${product.finalScore}점
제품: ${product.brand} ${product.name}, ${product.price.toLocaleString()}원, ${product.volumeMl}ml`;

  for (const model of [MODEL, FALLBACK_MODEL]) {
    try {
      // 키를 쿼리스트링에 넣으면 프록시·로그에 남을 수 있어서 헤더로 보내요(Google 권장).
      // 8초 안에 응답이 없으면 끊고 템플릿 추천 이유로 폴백해요.
      const response = await fetch(geminiUrl(model), {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: dataSummary }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 200 },
        }),
      });

      if (!response.ok) {
        if (model === MODEL && response.status === 404) continue; // 모델 조기 중단 대비 폴백 모델로 재시도
        throw new Error(`Gemini 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const text: string = candidate?.content?.parts?.[0]?.text?.trim() ?? "";

      if (candidate?.finishReason === "MAX_TOKENS") {
        console.warn("[gemini reasoning] 응답이 토큰 한도로 잘려서 템플릿으로 폴백:", text);
        return fallback;
      }

      if (text) return text;
      return fallback;
    } catch (error) {
      console.error("[gemini reasoning] 추천 이유 생성 실패, 템플릿으로 폴백:", error);
      return fallback;
    }
  }

  return fallback;
}
