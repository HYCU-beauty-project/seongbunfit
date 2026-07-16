import ContactContent from "@/components/ContactContent";

export default function MobileContactPage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">문의하기</h1>
      <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
        궁금한 점이나 제안하고 싶은 내용을 남겨주세요.
      </p>
      <div className="mt-6">
        <ContactContent />
      </div>
    </main>
  );
}
