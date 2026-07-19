import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: '성분핏 | IngredientFit',
    description: '전성분 배치와 가격을 분석해 가성비 좋은 세럼을 추천하는 AI 큐레이션 서비스',
};

// ⚠️ 이게 없으면 실제 모바일 기기는 페이지를 "가짜로 넓은 화면"(보통 980px)
// 기준으로 렌더링한 다음 화면에 맞게 축소해서 보여줘요. 그러면 카드가 실제
// 디자인 크기보다 훨씬 작게, 화면 오른쪽으로 쏠려 보이는 현상이 생겨요.
// DevTools의 기기 에뮬레이션은 이 설정 유무와 무관하게 항상 올바르게
// 보여주기 때문에, 에뮬레이터에서는 멀쩡한데 실제 기기에서만 깨지는
// 전형적인 원인이에요.
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="h-full antialiased">
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
