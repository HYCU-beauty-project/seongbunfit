export default function EventContent() {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-6 py-14 text-center">
      <p className="text-[14px] font-semibold text-[var(--color-ink)]">
        현재 진행 중인 이벤트가 없어요
      </p>
      <p className="mt-2 text-[12.5px] text-[var(--color-ink-faint)] leading-relaxed">
        오픈 기념 이벤트를 준비하고 있어요. 소식은 공지사항에서 가장 먼저 알려드릴게요!
      </p>
    </div>
  );
}
