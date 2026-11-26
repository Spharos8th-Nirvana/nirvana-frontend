import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

// 피그마 디자인 시스템 글꼴: 본문·라벨은 Noto Sans KR, 영문 큰 제목은 Inter
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "NIRVANA",
    template: "%s | NIRVANA",
  },
  description: "한국 사찰 체험 프로그램 예약 플랫폼 NIRVANA",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
