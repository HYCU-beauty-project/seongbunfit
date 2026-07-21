import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "성분핏 | IngredientFit",
  description: "전성분 배치와 가격을 분석해 가성비 좋은 세럼을 추천하는 AI 큐레이션 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      {/* Pretendard: 전체 가변 폰트(~2MB) 말고 dynamic subset 씀.
          실제 쓰인 글자 구간(unicode-range)만 조각으로 받아서 첫 렌더 훨씬 빠름.
          Gmarket Sans(@font-face, globals.css)도 같은 CDN이라 preconnect 공유 */}
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
