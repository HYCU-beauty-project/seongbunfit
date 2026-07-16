/**
 * 로컬 개발 중 로딩 상태(TypingBubble 등)가 자연스러운지 테스트하기 위한
 * 인위적 지연이에요. 실제 서버 API를 거치면 0.5초~수 초 정도 지연이 생기는데,
 * 로컬에서는(특히 GEMINI_API_KEY가 없어서 키워드 매칭만 도는 경우) 거의 즉시
 * 응답이 와서 로딩 UI가 어색한지 확인할 방법이 없었어요.
 *
 * .env.local에 MOCK_LATENCY_MS=2000 같은 값을 넣으면 그만큼 딜레이가 생겨요.
 * 값을 안 넣으면(기본값) 지연이 전혀 없어요 — 배포 환경에 실수로 남아있어도
 * 안전해요.
 */
export async function mockLatency() {
  const ms = Number(process.env.MOCK_LATENCY_MS ?? 0);
  if (!ms || Number.isNaN(ms) || ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}
