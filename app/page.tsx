import Link from "next/link";
import Header from "@/components/Header";

const steps = [
  { icon: "chat", title: "고민 입력", desc: "피부 고민을 선택하거나 입력" },
  { icon: "search", title: "성분 추천", desc: "AI가 핵심 성분을 제안" },
  { icon: "calc", title: "예산 설정", desc: "예산 범위를 선택" },
  { icon: "mail", title: "TOP3 결과", desc: "최적의 화장품 추천" },
];

const goodPoints = [
  "전성분 배치 순서 기반",
  "ml 당 가격 비교",
  "가성비 지수 산출",
  "AI 대화형 추천",
];

const badPoints = ["광고성 리뷰 혼재", "가격 비교 없음", "성분 효율 미제공", "성분 검색만 가능"];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-[32px] md:text-[38px] font-bold leading-[1.3] text-[var(--color-ink)]">
            비슷한 성분 구성,
            <br />
            <span className="text-[var(--color-primary)]">가격이 3배일</span>
            <br />
            필요 없어요
          </h1>
          <p className="mt-4 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
            전성분 배치 순서와 가격을 함께 분석해
            <br />
            가격 대비 합리적인 화장품을 찾아드려요
          </p>
          <Link
            href="/chat"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-[13.5px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            AI 추천 시작
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[var(--color-primary-soft)] to-[#dcd8f7]" />
          <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#f4efe6] to-[#e9e2d3] mt-6" />
        </div>
      </section>

      {/* How it works */}
      <section id="service" className="border-t border-[var(--color-border)] py-14">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-[20px] font-semibold text-[var(--color-ink)]">
            서비스 한 눈에 보기
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {steps.map((step, idx) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <StepIcon name={step.icon} />
                </span>
                <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                  {idx + 1}. {step.title}
                </p>
                <p className="text-[11.5px] text-[var(--color-ink-faint)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="bg-[var(--color-primary-soft)]/50 py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-[20px] font-bold leading-relaxed text-[var(--color-ink)]">
              광고성 리뷰 말고
              <br />
              <span className="text-[var(--color-primary)]">데이터로</span> 비교하세요
            </h2>
            <p className="mt-2 text-[12.5px] text-[var(--color-ink-faint)]">
              화장품법상 전성분 표기 기준에 근거한
              <br />
              객관적 지표로 가성비를 측정해요
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 max-w-lg mx-auto">
            <div className="rounded-2xl bg-white border-2 border-[var(--color-primary)] p-5">
              <p className="text-[12.5px] font-semibold text-[var(--color-primary)]">성분핏</p>
              <ul className="mt-3 space-y-2">
                {goodPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[12.5px] text-[var(--color-ink)]">
                    <span className="text-[var(--color-primary)]">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white border border-[var(--color-border)] p-5">
              <p className="text-[12.5px] font-semibold text-[var(--color-ink-faint)]">기존 앱</p>
              <ul className="mt-3 space-y-2">
                {badPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[12.5px] text-[var(--color-ink-faint)]">
                    <span>✕</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring formula */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">가성비 지수 산출 방식</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ScoreBadge label="전성분 배치 점수 60%" />
            <span className="text-[var(--color-primary)] font-semibold">+</span>
            <ScoreBadge label="ml 당 가격 점수 30%" />
            <span className="text-[var(--color-primary)] font-semibold">+</span>
            <ScoreBadge label="예산 적합 점수 10%" />
          </div>
          <p className="mt-4 text-[11.5px] text-[var(--color-ink-faint)]">
            베이스 성분(정제수, 글리세린 등) 포함, 전체 전성분 순위 기준
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-14 rounded-3xl bg-[var(--color-primary)] px-8 py-10 md:mx-auto md:max-w-5xl flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="text-center md:text-left text-[17px] font-semibold leading-relaxed text-white">
          지금 내 피부 고민에 맞는
          <br />
          화장품을 찾아보세요
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-[13.5px] font-medium text-[var(--color-primary)] hover:bg-white/90 transition-colors shrink-0"
        >
          AI 추천 시작
          <span aria-hidden>→</span>
        </Link>
      </section>

      <Footer />
    </main>
  );
}

function ScoreBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[12.5px] font-medium text-[var(--color-ink)]">
      {label}
    </span>
  );
}

function StepIcon({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "chat":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1.5-4.5A8.5 8.5 0 1 1 21 11.5Z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "calc":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    default:
      return null;
  }
}

function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[var(--color-ink-faint)]">
        <span className="font-medium text-[var(--color-ink-soft)]">성분핏</span>
        <nav className="flex gap-5">
          <Link href="/terms" className="hover:text-[var(--color-ink)] transition-colors">
            이용약관
          </Link>
          <Link href="/faq" className="hover:text-[var(--color-ink)] transition-colors">
            FAQ
          </Link>
          <Link href="/notice" className="hover:text-[var(--color-ink)] transition-colors">
            공지사항
          </Link>
        </nav>
      </div>
    </footer>
  );
}
