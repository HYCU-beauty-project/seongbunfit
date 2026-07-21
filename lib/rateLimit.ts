import type { NextRequest } from "next/server";

/**
 * 아주 단순한 인메모리 레이트리미터 (IP당 1분에 N회)
 *
 * 우리 API는 요청 한 번에 Gemini 2~3회 호출이라 제한 없으면 익명 사용자가
 * 루프만 돌려도 쿼터 소진·비용 폭탄 됨. 서버리스에선 인스턴스별로 카운터가
 * 따로 돌아서 완벽한 방어는 아니지만 단일 인스턴스에서 도는 단순 남용
 * (스크립트 루프)은 충분히 막아줌. 트래픽 커지면 Upstash Ratelimit이나
 * Vercel WAF 규칙으로 바꾸면 됨
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
// 오래된 항목 무한히 안 쌓이게 맵 크기에 상한 둠
const MAX_TRACKED_IPS = 10_000;

const hits = new Map<string, number[]>();

export function getClientIp(req: NextRequest): string {
  // Vercel/프록시 뒤에선 x-forwarded-for 첫 번째 값이 실제 클라이언트 IP임
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** true 반환하면 이번 요청 429로 거절해야 함 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);

  if (!hits.has(ip) && hits.size >= MAX_TRACKED_IPS) {
    // 상한 도달하면 가장 오래된 키부터 버림 (Map은 삽입 순서 유지)
    const oldest = hits.keys().next().value;
    if (oldest !== undefined) hits.delete(oldest);
  }
  hits.set(ip, recent);
  return false;
}
