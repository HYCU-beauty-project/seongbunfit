import { categories, matchCategory } from "@/lib/ingredients";
import type { CategoryKey } from "@/types";

export interface AnalyzeResult {
  // null = 5개 피부 고민 카테고리 중 어디에도 해당하지 않는 질문으로 판단됨
  categoryKey: CategoryKey | null;
  usedAi: boolean;
  // 값이 있으면: 분류하기엔 너무 모호해서 AI가 되물어봐야 하는 상황이에요.
  // 이 경우 categoryKey는 항상 null이에요.
  clarifyingQuestion?: string;
}

const SYSTEM_PROMPT = `당신은 화장품 성분 안내 챗봇 "성분핏"의 분석 엔진입니다.
사용자가 자유롭게 쓴 피부 고민 문장을 이해해서, 아래 5개 카테고리 중 의미상 가장 가까운 하나로
분류하세요. 정확히 같은 단어가 없어도, 증상이나 상황을 보고 의미로 유추해서 판단하세요.

- wrinkle (주름·탄력): 나이가 들며 생기는 주름, 탄력 저하, 눈가/팔자 주름, 피부가 처지거나
  늘어지는 느낌, 안티에이징 관련 고민 전반
- brightening (미백·잡티): 기미, 잡티, 색소침착, 칙칙한 피부톤, 얼룩덜룩함, 톤을 밝히고 싶은
  고민 전반
- hydration (수분·건조): 피부가 당기거나 푸석함, 속건조, 수분 부족, 각질이 일어남, 메마른 느낌
- pore (모공·트러블): 넓은 모공, 여드름, 뾰루지, 블랙헤드, 피지 과다, 따가움·화끈거림·자극감·
  예민함·붉은기·홍조·가려움 같은 자극/트러블 증상 전반
- texture (피부결·광채): 피부결이 거칠거나 울퉁불퉁함, 광채·윤기 부족, 생기 없어 보이는 고민

분류 예시 (표현이 달라도 의미로 판단하세요):
"요즘 얼굴이 우중충해 보여요" → brightening
"세안 후에 얼굴이 땅기고 갈라질 것 같아요" → hydration
"코 주변이 오돌토돌해요" → pore
"자고 일어나면 얼굴이 푸석하고 칙칙해요" (여러 증상이 섞이면 가장 먼저 언급된 것을 우선) → hydration
"화장이 자꾸 뜨고 결이 안 좋아요" → texture

피부/화장품과 조금이라도 관련된 문장이면 최대한 5개 중 하나로 분류하세요. "unsupported"는
피부 고민과 전혀 무관한 문장(인사, 날씨, 잡담, 의료 진단 요청 등)에만 사용하세요.

피부 관련 얘기이긴 한데 너무 짧거나 막연해서 5개 중 어디에도 확신을 가지고 분류할 수 없다면
(예: "고민이 있어요", "피부가 안 좋아요", "관리하고 싶어요"처럼 구체적 증상이 없는 경우),
카테고리를 억지로 고르지 말고 아래 형식으로 짧고 친근한 되물음 질문을 하세요:
clarify: <질문 한 문장>
예: clarify: 어떤 부분이 가장 신경 쓰이세요? 주름, 트러블, 건조함처럼 편하게 말씀해주셔도 좋아요.

반드시 다음 중 하나의 형식으로만 답하세요: 카테고리 key(wrinkle/brightening/hydration/pore/texture),
"unsupported", 또는 "clarify: 질문". 다른 설명은 절대 붙이지 마세요.`;

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
        maxOutputTokens: 150,
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
  const candidate = data.candidates?.[0];
  const rawContent: string = candidate?.content?.parts?.[0]?.text ?? "";
  const truncated = candidate?.finishReason === "MAX_TOKENS";
  return { text: rawContent.trim(), truncated };
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
      const { text: raw, truncated } = await callGemini(model, apiKey, userText);
      const cleaned = raw
        .toLowerCase()
        .replace(/[`"'*_]/g, "")
        .trim();

      if (cleaned.startsWith("clarify")) {
        const question = raw.replace(/^clarify:?\s*/i, "").trim();
        // 되물음 문장이 토큰 한도로 중간에 잘렸으면, 어색하게 끊긴 질문을 보여주는 대신
        // 안전하게 키워드 매칭 폴백으로 넘어가요.
        if (question && !truncated) {
          console.log(`[gemini analyzer] ✅ ${model} 사용됨 — "${userText}" → 되물음: "${question}"`);
          return { categoryKey: null, usedAi: true, clarifyingQuestion: question };
        }
        if (truncated) {
          console.warn(`[gemini analyzer] 되물음 응답이 토큰 한도로 잘려서 폴백:`, question);
        }
      }

      const normalized = cleaned.replace(/[.!?]/g, "");
      if (normalized === UNSUPPORTED || normalized.startsWith(UNSUPPORTED)) {
        console.log(`[gemini analyzer] ✅ ${model} 사용됨 — "${userText}" → 관련 없는 질문으로 판단`);
        return { categoryKey: null, usedAi: true };
      }

      const matched = categories.find(
        (c) => normalized === c.key || normalized.startsWith(c.key) || normalized.includes(c.key)
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
