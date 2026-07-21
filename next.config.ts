import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next dev는 기본으로 localhost 이외 주소 차단함.
  // 같은 와이파이 다른 기기(휴대폰 등)로 테스트하려면 여기에 정확한 호스트/IP
  // 추가해야 함 (CIDR 대역 표기는 지원 안 함).
  // IP 바뀌면(공유기 재할당 등) 여기도 같이 바꿔야 함. 터미널에 뜨는
  // "Network: http://..." 주소 그대로 넣으면 됨
  allowedDevOrigins: ["172.30.1.67"],
};

export default nextConfig;
