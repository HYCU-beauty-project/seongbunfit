import TermsContent from "@/components/TermsContent";

export default function MobileTermsPage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">이용약관</h1>
      <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
        프로토타입 버전 안내 사항이에요.
      </p>
      <div className="mt-6">
        <TermsContent />
      </div>
    </main>
  );
}
