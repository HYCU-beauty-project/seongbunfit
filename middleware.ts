import { NextRequest, NextResponse } from "next/server";

// 데스크톱 경로 → 그에 대응하는 /mobile 경로 매핑이에요.
// (app/mobile/chat-intro, app/mobile/programs처럼 데스크톱에 대응 경로가
// 없는 모바일 전용 페이지는 여기 넣지 않아요 — 리다이렉트 대상이 아니라서요.)
const MOBILE_REDIRECT_MAP: Record<string, string> = {
  "/": "/mobile",
  "/chat": "/mobile/chat",
  "/contact": "/mobile/contact",
  "/event": "/mobile/event",
  "/face-analysis": "/mobile/face-analysis",
  "/faq": "/mobile/faq",
  "/notice": "/mobile/notice",
  "/products": "/mobile/products",
  "/terms": "/mobile/terms",
};

// 흔한 모바일 기기 UA 패턴이에요. 아이패드는 최신 iOS에서 데스크톱 UA로 위장하는
// 경우가 많아서 일부러 안 넣었어요 — 아이패드는 화면이 넓어 데스크톱 레이아웃이
// 오히려 더 잘 맞아요.
const MOBILE_UA_REGEX = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const target = MOBILE_REDIRECT_MAP[pathname];
  if (!target) return NextResponse.next();

  const userAgent = req.headers.get("user-agent") ?? "";
  if (!MOBILE_UA_REGEX.test(userAgent)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = target;
  // ?concern=wrinkle 같은 쿼리스트링은 그대로 유지해서 넘겨줘요.
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // API, 정적 파일(_next), 이미지/아이콘/로고 등은 리다이렉트 대상에서 제외해요.
  // (사실 아래 매칭 로직 자체가 정확히 일치하는 경로만 리다이렉트하도록 짜여있어서
  // 이 필터가 없어도 안전하지만, 정적 파일 요청마다 미들웨어가 굳이 실행되지 않게
  // 성능상 미리 걸러주는 거예요.)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|logo|icons).*)"],
};
