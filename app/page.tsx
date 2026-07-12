// 인트로 페이지
// 시작하기 버튼 클릭 시 메인 페이지로 이동
"use client";

import Image from "next/image";

export default function IntroPage() {
  // 시작하기 버튼 클릭 이벤트
  const handleStart = () => {
    alert("버튼 클릭됨");
    window.location.href = window.location.origin + "/main";
  };

  return (
    <main className="intro-page">
      <div className="mobile-container intro-container">
        {/* 로고 */}
        <Image
          src="/logo/white-logo.png"
          alt="성분핏 로고"
          width={120}
          height={120}
          priority
          className="intro-logo"
        />

        {/* 서비스명 */}
        <h1 className="intro-title">성분핏</h1>

        {/* 설명 */}
        <p className="intro-subtitle">
          비슷한 성분,
          <br />
          더 합리적인 선택
        </p>

        {/* 시작하기 버튼 */}
        <button type="button" className="intro-button" onClick={handleStart}>
          시작하기
          <span>→</span>
        </button>
      </div>
    </main>
  );
}