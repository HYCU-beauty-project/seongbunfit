import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventContent from "@/components/EventContent";

export default function EventPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        <h1 className="text-[22px] font-bold text-[var(--color-ink)]">이벤트</h1>
        <p className="mt-1.5 text-[13px] text-[var(--color-ink-faint)]">
          성분핏의 다양한 이벤트를 확인해보세요.
        </p>
        <div className="mt-8">
          <EventContent />
        </div>
      </section>
      <Footer />
    </main>
  );
}
