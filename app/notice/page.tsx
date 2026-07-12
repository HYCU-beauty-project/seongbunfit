import Header from "@/components/Header";

const notices = [
  {
    date: "2026.07.11",
    title: "성분핏 프로토타입 오픈",
    body: "AI 기반 창업 프로젝트 경진대회 제출을 위한 프로토타입이 오픈되었어요. 세럼 카테고리 한정, 더미 데이터 기반으로 동작합니다.",
  },
  {
    date: "2026.05.25",
    title: "팀 AI Playground 프로젝트 시작",
    body: "성분핏(IngredientFit) 프로젝트가 시작되었어요. 전성분 배치 기반 가성비 추천 서비스를 목표로 개발 중입니다.",
  },
];

export default function NoticePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-[22px] font-bold text-[var(--color-ink)]">공지사항</h1>
        <p className="mt-1.5 text-[13px] text-[var(--color-ink-faint)]">
          성분핏의 새로운 소식을 알려드려요.
        </p>

        <div className="mt-8 space-y-2.5">
          {notices.map((n) => (
            <details
              key={n.title}
              className="group rounded-xl border border-[var(--color-border)] px-4 py-3.5 open:bg-[var(--color-primary-soft)]/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-[11px] text-[var(--color-ink-faint)]">{n.date}</span>
                  <span className="mt-0.5 block text-[13.5px] font-medium text-[var(--color-ink)]">
                    {n.title}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-[var(--color-ink-faint)] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-[12.5px] text-[var(--color-ink-soft)] leading-relaxed">
                {n.body}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
