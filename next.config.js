// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",      // ← 이것 때문에 out/ 에 정적파일 뽑아줌
  images: {
    unoptimized: true,   // 정적 export일 때 이미지 오류 안 나게
  },
};

module.exports = nextConfig;
