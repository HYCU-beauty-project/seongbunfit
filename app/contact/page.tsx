import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactContent from "@/components/ContactContent";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        <div className="mx-auto max-w-md">
          <h1 className="text-[22px] font-bold text-[var(--color-ink)]">문의하기</h1>
          <p className="mt-1.5 text-[13px] text-[var(--color-ink-faint)]">
            궁금한 점이나 제안하고 싶은 내용을 남겨주세요.
          </p>
          <div className="mt-8">
            <ContactContent />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
