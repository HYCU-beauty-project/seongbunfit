import EventContent from "@/components/EventContent";

export default function MobileEventPage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">이벤트</h1>
      <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
        성분핏의 다양한 이벤트를 확인해보세요.
      </p>
      <div className="mt-6">
        <EventContent />
      </div>
    </main>
  );
}
