import Header from "@/components/Header";
import TermsContent from "@/components/TermsContent";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-[22px] font-bold text-[var(--color-ink)]">이용약관</h1>
        <p className="mt-1.5 text-[13px] text-[var(--color-ink-faint)]">
          프로토타입 버전 안내 사항이에요.
        </p>
        <div className="mt-8">
          <TermsContent />
        </div>
      </section>
    </main>
  );
}
