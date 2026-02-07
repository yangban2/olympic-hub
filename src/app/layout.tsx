import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Olympic Hub - 2026 밀라노-코르티나 동계올림픽",
  description: "2026 밀라노-코르티나 동계올림픽 실시간 메달 현황, 일정, 뉴스를 한눈에 확인하세요. 한국 선수단 응원하기!",
  keywords: ["올림픽", "동계올림픽", "밀라노", "코르티나", "메달", "한국", "2026", "Olympics", "Winter Olympics"],
  authors: [{ name: "Olympic Hub" }],
  openGraph: {
    title: "Olympic Hub - 2026 동계올림픽",
    description: "실시간 메달 현황 & 일정 & 뉴스",
    url: "https://olympic-hub.naroo.app",
    siteName: "Olympic Hub",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olympic Hub - 2026 동계올림픽",
    description: "실시간 메달 현황 & 일정 & 뉴스",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5715489344967596"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
