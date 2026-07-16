import IngredientTag from "@/components/IngredientTag";

export default function ResultUIShowcase() {
  return (
    <div className="relative mx-auto max-w-[340px]">
      {/* 실제 채팅 결과 카드를 그대로 재현한 목업이에요(스크린샷이 아니라 같은 스타일의
          컴포넌트예요 — 그래서 나중에 UI가 바뀌면 여기도 자동으로 최신 모습을 반영해요). */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 shrink-0 rounded-lg bg-[#eef0e0]" aria-hidden />
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">
              추천 1위
            </span>
            <p className="mt-1 truncate text-[13.5px] font-semibold text-[var(--color-ink)]">
              바이옴 퓨어 비타민 세럼
            </p>
            <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-faint)]">
              가격 11,200원 · 용량 20ml · ml당 560원
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-[var(--color-primary-soft)]/60 px-3 py-2.5 text-[11.5px] text-[var(--color-ink-soft)] leading-relaxed">
          <div className="flex items-center gap-1.5">
            <IngredientTag ingredientId="vitaminc" size={18} />
            <span className="text-[11.5px] font-semibold text-[var(--color-ink)]">비타민C</span>
          </div>
          <p className="mt-1.5">전성분 배치 순위 9번째 (배치 점수 100점)</p>
          <p className="mt-0.5 flex items-center gap-1 font-semibold text-[var(--color-accent-text)]">
            <SparkleIcon />
            가성비 지수: 93.8
          </p>
        </div>

        <div className="mt-3 rounded-lg bg-[var(--color-primary)] py-2.5 text-center text-[12px] font-medium text-white">
          구매하러 가기 →
        </div>
      </div>

      {/* 말풍선 주석 */}
      <Callout className="-left-4 top-2 md:-left-10">
        광고 없이 배치 순위로만 판단해요
      </Callout>
      <Callout className="-right-4 top-24 md:-right-14">가성비 지수를 숫자로 바로 확인</Callout>
      <Callout className="-left-6 bottom-6 md:-left-16">이 성분 때문에 추천한다고 알려드려요</Callout>
    </div>
  );
}

function Callout({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <div
      className={`absolute hidden w-[150px] rounded-xl bg-[var(--color-ink)] px-3 py-2 text-[11px] leading-snug text-white shadow-md sm:block ${className}`}
    >
      {children}
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M12 2.5c.9 4 2.2 6.3 4.5 7.5-2.3 1.2-3.6 3.5-4.5 7.5-.9-4-2.2-6.3-4.5-7.5 2.3-1.2 3.6-3.5 4.5-7.5Z" />
    </svg>
  );
}
