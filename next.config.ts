// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // ✅ 정적 HTML로 내보내기 (Capacitor용)
  images: { unoptimized: true }, // ✅ 이미지 최적화 비활성화 (정적 호환)
};

export default nextConfig;
