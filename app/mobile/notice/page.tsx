import NoticeContent from "@/components/NoticeContent";

export default function MobileNoticePage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">공지사항</h1>
      <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
        성분핏의 새로운 소식을 알려드려요.
      </p>
      <div className="mt-6">
        <NoticeContent />
      </div>
    </main>
  );
}
