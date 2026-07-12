import { categories, matchCategory } from "@/lib/ingredients";
import type { CategoryKey } from "@/types";

export interface AnalyzeResult {
  // null = 5개 피부 고민 카테고리 중 어디에도 해당하지 않는 질문으로 판단됨
  categoryKey: CategoryKey | null;
  usedAi: boolean;
}

const SYSTEM_PROMPT = `당신은 화장품 성분 안내 챗봇 "성분핏"의 분석 엔진입니다.
사용자의 피부 고민 문장을 다음 5개 카테고리 중 하나로만 분류하세요: wrinkle(주름·탄력), brightening(미백·잡티), hydration(수분·건조), pore(모공·트러블), texture(피부결·광채).
반드시 카테고리 key 하나만 소문자 영문으로 답하세요. 화장품 성분 상담 이외의 질문(인사, 날씨, 의료 진단, 다른 주제 등)에는 "unsupported"라고만 답하세요.`;

// 무료 티어에서 쓸 수 있는 가벼운 분류 작업이라, Gemini 3 라인업 중 가장 가볍고 저렴한
// 모델이면 충분해요. gemini-2.5-flash는 2026년 7월 9일부터 신규 요청에 404를 반환하기
// 시작해서(공식 지원 종료 예정일 이전에 조기 중단된 사례) gemini-3.1-flash-lite로 바꿨어요.
// 모델명이 또 바뀌면 여기 하나만 고치면 됩니다 — 최신 목록은
// https://ai.google.dev/gemini-api/docs/models 에서 "Stable" 표시된 모델을 확인하세요.
const PRIMARY_MODEL = "gemini-3.1-flash-lite";

// Google이 계속 유지해주는 "최신 안정 모델" 별칭이에요. PRIMARY_MODEL이 또 조기 중단되는
// 사고가 나더라도(이번처럼) 자동으로 여기로 한 번 더 시도해서 서비스가 안 끊기게 해줘요.
const FALLBACK_MODEL = "gemini-flash-latest";

const UNSUPPORTED = "unsupported";

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

async function callGemini(model: string, apiKey: string, userText: string) {
  const response = await fetch(`${geminiUrl(model)}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 10,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    const error = new Error(`Gemini 응답 오류: ${response.status} ${errBody}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  const data = await response.json();
  const rawContent: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return rawContent
    .trim()
    .toLowerCase()
    .replace(/[`"'*_.!?]/g, ""); // 모델이 가끔 붙이는 마침표/따옴표/마크다운 기호 등을 제거
}

/**
 * 사용자의 자연어 피부 고민을 5개 카테고리 중 하나로 분류합니다.
 * GEMINI_API_KEY가 설정되어 있으면 Gemini로 분석하고,
 * 없으면 키워드 매칭(lib/ingredients.ts matchCategory)으로 폴백합니다.
 *
 * 관련 없는 문장("안녕", "오늘 날씨 어때" 등)은 categoryKey: null로 반환합니다.
 * 예전엔 이런 경우에도 강제로 카테고리 하나를 골라 보여줬는데, "안녕"에도
 * "주름 고민이시군요!"라고 확신에 차서 틀린 답을 하는 문제가 있었어요.
 *
 * LangChain 연동 시: 이 함수를 체인의 첫 단계(입력 분석)로 사용하고,
 * 이어서 DB 조회 -> 가성비 스코어링(lib/scoring/calculator.ts) -> 결과 요약 순으로 연결하면 됩니다.
 */
export async function analyzeSkinConcern(userText: string): Promise<AnalyzeResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      "[gemini analyzer] GEMINI_API_KEY가 감지되지 않았어요 — 키워드 매칭으로 동작해요. " +
        ".env.local에 키를 넣었다면 서버(npm run dev)를 재시작했는지 확인해 주세요."
    );
    return { categoryKey: matchCategory(userText)?.key ?? null, usedAi: false };
  }

  console.log(`[gemini analyzer] 키 감지됨 (${apiKey.slice(0, 6)}...${apiKey.slice(-4)}), ${PRIMARY_MODEL} 호출 중…`);

  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const raw = await callGemini(model, apiKey, userText);

      if (raw === UNSUPPORTED || raw.startsWith(UNSUPPORTED)) {
        console.log(`[gemini analyzer] ✅ ${model} 사용됨 — "${userText}" → 관련 없는 질문으로 판단`);
        return { categoryKey: null, usedAi: true };
      }

      const matched = categories.find(
        (c) => raw === c.key || raw.startsWith(c.key) || raw.includes(c.key)
      );

      if (matched) {
        console.log(`[gemini analyzer] ✅ ${model} 사용됨 — "${userText}" → ${matched.key}`);
        return { categoryKey: matched.key, usedAi: true };
      }

      console.warn(`[gemini analyzer] ${model} 응답을 알 수 없어 폴백 사용 — 받은 값(원문): "${raw}"`);
      return { categoryKey: matchCategory(userText)?.key ?? null, usedAi: false };
    } catch (error) {
      const status = (error as Error & { status?: number }).status;
      if (model === PRIMARY_MODEL && status === 404) {
        console.warn(
          `[gemini analyzer] ⚠️ ${PRIMARY_MODEL} 모델을 찾을 수 없어요(404) — ${FALLBACK_MODEL}로 한 번 더 시도해요.`
        );
        continue;
      }
      console.error(`[gemini analyzer] ❌ ${model} 호출 실패, 폴백 사용:`, error);
      return { categoryKey: matchCategory(userText)?.key ?? null, usedAi: false };
    }
  }

  return { categoryKey: matchCategory(userText)?.key ?? null, usedAi: false };
}
