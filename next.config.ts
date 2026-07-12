import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next dev는 기본적으로 localhost 이외의 주소를 차단해요.
  // 같은 와이파이의 다른 기기(휴대폰 등)나 IP로 접속해서 테스트하려면
  // 여기에 정확한 호스트/IP를 추가하세요 (CIDR 대역 표기는 지원하지 않아요).
  // IP가 바뀌면(공유기 재할당 등) 여기도 같이 바꿔줘야 해요 — 터미널에 뜨는
  // "Network: http://..." 주소를 그대로 넣으면 돼요.
  allowedDevOrigins: ["172.30.1.67"],
};

export default nextConfig;
