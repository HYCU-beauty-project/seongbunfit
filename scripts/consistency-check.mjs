/**
 * AI 분류 일관성 검증 스크립트 (MVP)
 *
 * 같은 고민 문장을 /api/chat에 여러 번 보내서 분류 결과가 매번 같은지(일치율 %)
 * 측정함. 분류 단계는 temperature 0 고정이라(README "AI 분석 일관성 검증" 참고)
 * 명확한 문장은 일치율 100% 나와야 정상
 *
 * 사용법:
 *   npm run dev          # 별도 터미널에서 서버 먼저 실행
 *   npm run consistency
 *
 * 환경변수:
 *   BASE_URL  대상 서버 (기본 http://localhost:3000)
 *   REPEATS   문장당 반복 횟수 (기본 4. 5문장 × 4회 = 총 20회로 분당 레이트리밋 한도 내)
 */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const REPEATS = Number(process.env.REPEATS ?? 4);
// 서버 레이트리밋(IP당 분당 20회) 안 걸리게 호출 사이에 잠깐 쉼
const DELAY_MS = 500;

// 카테고리별 대표 고민 4개 + 일부러 모호하게 쓴 문장 1개.
// 모호한 문장은 특정 카테고리로 강제 분류 안 되고 되물음(clarify)이나
// 미지원(unsupported)으로 "일관되게" 처리되는지 보는 용도
const TEST_SENTENCES = [
  { label: "주름(명확)", text: "눈가 주름이 고민이에요" },
  { label: "미백(명확)", text: "기미랑 잡티 때문에 피부톤이 칙칙해요" },
  { label: "수분(명확)", text: "세안하고 나면 피부가 심하게 당겨요" },
  { label: "모공(명확)", text: "코 주변 모공이 넓어서 화장이 떠요" },
  { label: "모호한 문장", text: "피부가 그냥 좀 별로예요" },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 응답을 "분류 결과" 하나로 요약. 카테고리 키 / clarify(되물음) / unsupported(미지원)
function classify(data) {
  if (data.clarifyingQuestion) return "clarify(되물음)";
  if (data.categoryKey) return data.categoryKey;
  return "unsupported(미지원)";
}

async function callChat(text) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (res.status === 429) return { rateLimited: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { data: await res.json() };
}

async function main() {
  console.log(`\n성분핏 AI 분류 일관성 검증 — ${BASE_URL}, 문장당 ${REPEATS}회 반복\n`);

  // 서버 떠 있는지 먼저 확인
  try {
    await fetch(BASE_URL, { signal: AbortSignal.timeout(3000) });
  } catch {
    console.error(`서버(${BASE_URL})에 연결할 수 없어요. 먼저 "npm run dev"로 서버를 실행해 주세요.`);
    process.exit(1);
  }

  const rows = [];
  let anyAiUsed = false;

  for (const { label, text } of TEST_SENTENCES) {
    const outcomes = [];
    let usedAiCount = 0;

    for (let i = 0; i < REPEATS; i++) {
      const result = await callChat(text);
      if (result.rateLimited) {
        console.warn(`  ⚠️ 레이트리밋(429) — 60초 대기 후 재시도해요...`);
        await sleep(60_000);
        i--;
        continue;
      }
      outcomes.push(classify(result.data));
      if (result.data.usedAi) usedAiCount++;
      await sleep(DELAY_MS);
    }

    // 최빈값(가장 많이 나온 결과) 기준으로 일치율 계산
    const counts = new Map();
    for (const o of outcomes) counts.set(o, (counts.get(o) ?? 0) + 1);
    const [mode, modeCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const agreement = Math.round((modeCount / outcomes.length) * 100);
    const aiUsed = usedAiCount === outcomes.length;
    if (usedAiCount > 0) anyAiUsed = true;

    rows.push({
      문장: label,
      "최빈 결과": mode,
      "일치율": `${agreement}%`,
      "응답 분포": [...counts.entries()].map(([k, v]) => `${k}×${v}`).join(", "),
      "AI 사용": aiUsed ? "✨ Gemini" : usedAiCount > 0 ? "⚠️ 일부만" : "🔤 키워드",
    });
    console.log(`  [${label}] ${agreement}% 일치 (${mode})`);
  }

  console.log("");
  console.table(rows);

  if (!anyAiUsed) {
    console.warn(
      "⚠️ 모든 응답이 키워드 매칭 폴백이었어요 — GEMINI_API_KEY 없이 나온 100%는\n" +
        "   AI 일관성 검증으로 볼 수 없어요. .env.local에 키를 넣고 다시 실행해 주세요.",
    );
  }

  const clearRows = rows.filter((r) => r.문장.includes("명확"));
  const allClearConsistent = clearRows.every((r) => r.일치율 === "100%");
  console.log(
    allClearConsistent
      ? "✅ 명확한 문장 전부 일치율 100% — 분류 재현성 통과"
      : "❌ 명확한 문장 중 일치율 100% 미만이 있어요 — temperature 설정과 프롬프트를 점검해 주세요",
  );
  process.exitCode = allClearConsistent ? 0 : 1;
}

main().catch((error) => {
  console.error("검증 실행 중 오류:", error);
  process.exit(1);
});
