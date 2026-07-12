// app/main/page.tsx
// 성분핏 메인 페이지

import Image from "next/image";
import Link from "next/link";

// 임시 공지사항
const notices = [
  "성분핏 서비스 테스트 오픈 안내(2026년 6월)",
  "성분핏 서비스 베타 오픈 안내(2026년 6월)",
  "2026년도 성분핏 등록 화장품 목록 및 서비스 안내",
];

// 임시 진행사항 디자인 
const steps = [
  {
    number: "1",
    title: "고민 입력",
    desc: "피부 고민을 입력하거나 선택해 분석을 시작합니다.",
  },
  {
    number: "2",
    title: "성분 추천",
    desc: "입력한 고민에 맞는 핵심 성분을 추천드립니다.",
  },
  {
    number: "3",
    title: "예산 설정",
    desc: "원하는 예산을 선택해 추천 범위를 설정합니다.",
  },
  {
    number: "4",
    title: "TOP3 결과",
    desc: "가성비를 분석해 맞춤 제품 TOP3를 추천합니다.",
  },
];

export default function MainPage() {
  return (
    <main className="main-page">
      <section className="mobile-container main-container">
        {/* 상단 헤더 */}
        <header className="main-header">
          {/* 좌측 로고 + 텍스트 */}
          <div className="header-brand">
            <Image
              src="/logo/color-logo.png"
              alt="성분핏 로고"
              width={40}
              height={32}
              className="header-symbol"
              priority
            />

            <span className="header-brand-text">seongbunfit</span>
          </div>

          {/* 우측 햄버거 메뉴 */}
          <button className="menu-button" type="button" aria-label="메뉴 열기">
            <span />
            <span />
            <span />
          </button>
        </header>

        {/* 히어로 영역 */}
        <section className="hero-section">
          <div className="hero-image-box">
            <Image
              src="/images/hero-serum_2.jpg"
              alt="세럼 이미지"
              width={420}
              height={360}
              className="hero-image"
              priority
            />
          </div>

          <div className="hero-content">
            <h1>
              비슷한 성분 구성,
              <br />
              <strong>가격이 3배</strong>일 필요 없어요
            </h1>

            <p>
              전성분 배치 순서와 가격을 함께 분석해<br>
              </br>
              가격 대비 합리적인 화장품을 찾아드려요
            </p>

            <Link href="/chat-intro" className="primary-button">
              AI 추천 시작
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* 성분핏 소개 */}
        <section className="intro-section">
          <h2>
            광고성 리뷰 말고
            <br />
            <strong>데이터로 비교하세요</strong>
          </h2>

          <div className="compare-card">
            <div className="compare-column active">
              <h3>성분핏</h3>
              <ul>
                <li>✓ 전성분 위치 기준</li>
                <li>✓ 1ml당 가격 비교</li>
                <li>✓ 가성비 점수 산출</li>
                <li>✓ AI 맞춤 추천</li>
              </ul>
            </div>

            <div className="compare-column">
              <h3>타사</h3>
              <ul>
                <li>× 광고성 리뷰 중심</li>
                <li>× 가격 비교 불명확</li>
                <li>× 성분 설명 부족</li>
                <li>× 성분 분석 기능 없음</li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================
              가성비 산출 방식
          ========================= */}
          <section className="score-section">
            <h2>가성비 산출 방식</h2>

            <p>
              성분 위치, ml당 가격, 예산 여유율을 기준으로 계산합니다.
            </p>

            {/* 임시 그래프 (나중에 일러스트 이미지로 교체 예정) */}
            <div className="score-visual">

              {/* 핵심 성분 */}
              <div className="score-bar">

                <div className="score-bar-top">
                  <span>핵심 성분 위치</span>
                  <strong>60%</strong>
                </div>

                <div className="score-bar-track">
                  <div
                    className="score-bar-fill"
                    style={{ width: "60%" }}
                  />
                </div>

              </div>

              {/* 가격 */}
              <div className="score-bar">

                <div className="score-bar-top">
                  <span>가격 점수</span>
                  <strong>30%</strong>
                </div>

                <div className="score-bar-track">
                  <div
                    className="score-bar-fill price"
                    style={{ width: "30%" }}
                  />
                </div>

              </div>

              {/* 예산 */}
              <div className="score-bar">

                <div className="score-bar-top">
                  <span>예산 여유</span>
                  <strong>10%</strong>
                </div>

                <div className="score-bar-track">
                  <div
                    className="score-bar-fill budget"
                    style={{ width: "10%" }}
                  />
                </div>

              </div>

            </div>

            {/* 아래 설명 */}
            <div className="score-list">
              <span>핵심 성분 위치 60%</span>
              <span>가격 점수 30%</span>
              <span>예산 여유 10%</span>
            </div>

          </section>

        {/* 서비스 한눈에 보기 */}
        <section className="steps-section">
          <h2>서비스 한눈에 보기</h2>

          <div className="step-list">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="step-placeholder" />
              </article>
            ))}
          </div>
        </section>

        {/* 공지사항 */}
        <section className="notice-section">
          <h2>안내사항</h2>

          <div className="notice-list">
            {notices.map((notice, index) => (
              <div className="notice-item" key={index}>
                <span>공지</span>
                <p>{notice}</p>
                <strong>!</strong>
              </div>
            ))}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="main-footer">
          <h2>성분핏</h2>
          <p>
            성분핏 프로젝트팀 
            <br />
            서울특별시 성동구
            <br />
            이메일: help@seongbunfit.com
          </p>

          <small>
            COPYRIGHT © YUCI AI PLAYGROUND
            <br />
            ALL RIGHTS RESERVED.
          </small>
        </footer>
      </section>
    </main>
  );
}