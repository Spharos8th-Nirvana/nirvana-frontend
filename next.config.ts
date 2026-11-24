import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image로 불러올 수 있는 외부 이미지 주소. 임시 데이터의 이미지 호스트입니다.
    // 실제 API 이미지(media 서비스)의 주소가 정해지면 여기에 추가합니다.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
