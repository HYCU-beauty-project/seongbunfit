// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 네트워크 IP 접속 허용
  allowedDevOrigins: ["192.168.0.14:3000"],
};

export default nextConfig;