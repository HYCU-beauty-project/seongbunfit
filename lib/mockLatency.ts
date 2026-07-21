/**
 * 로컬 개발 중 로딩 상태(TypingBubble 등) 테스트용 인위적 지연.
 * 실제 서버 API 거치면 0.5초~수 초 지연 생기는데, 로컬(특히 GEMINI_API_KEY
 * 없어서 키워드 매칭만 도는 경우)은 거의 즉시 응답이라 로딩 UI 확인이 안 됐음
 *
 * .env.local에 MOCK_LATENCY_MS=2000 넣으면 그만큼 딜레이 생김.
 * 값 안 넣으면 지연 없음이라 배포 환경에 실수로 남아도 안전함
 */
export async function mockLatency() {
  const ms = Number(process.env.MOCK_LATENCY_MS ?? 0);
  if (!ms || Number.isNaN(ms) || ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}
