import type { NextRequest } from "next/server";

/**
 * 아주 단순한 인메모리 레이트리미터 (IP당 1분에 N회).
 *
 * 우리 API는 요청 한 번에 Gemini를 2~3회 호출하기 때문에, 제한이 없으면 익명
 * 사용자가 루프만 돌려도 쿼터 소진·비용 폭탄으로 이어져요. 서버리스 환경에서는
 * 인스턴스별로 카운터가 따로 돌아서 완벽한 방어는 아니지만, 단일 인스턴스에서
 * 도는 단순 남용(스크립트 루프)은 충분히 막아줘요. 트래픽이 커지면 Upstash
 * Ratelimit이나 Vercel WAF 규칙으로 교체하면 돼요.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
// 오래된 항목이 무한히 쌓이지 않게 맵 크기에 상한을 둬요.
const MAX_TRACKED_IPS = 10_000;

const hits = new Map<string, number[]>();

export function getClientIp(req: NextRequest): string {
  // Vercel/프록시 뒤에서는 x-forwarded-for의 첫 번째 값이 실제 클라이언트 IP예요.
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** true를 반환하면 이번 요청을 429로 거절해야 해요. */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);

  if (!hits.has(ip) && hits.size >= MAX_TRACKED_IPS) {
    // 상한 도달 시 가장 오래 전에 등록된 키부터 버려요 (Map은 삽입 순서 유지).
    const oldest = hits.keys().next().value;
    if (oldest !== undefined) hits.delete(oldest);
  }
  hits.set(ip, recent);
  return false;
}
