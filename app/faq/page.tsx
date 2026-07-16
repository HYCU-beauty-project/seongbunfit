"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqContent from "@/components/FaqContent";
import ContactModal from "@/components/ContactModal";
import ArrowRightIcon from "@/components/ArrowRightIcon";

export default function FaqPage() {
  const [showContact, setShowContact] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-[22px] font-bold text-[var(--color-ink)]">FAQ</h1>
          <p className="mt-1.5 text-[13px] text-[var(--color-ink-faint)]">
            자주 묻는 질문을 모았어요.
          </p>
          <div className="mt-8">
            <FaqContent />
          </div>

          <div className="mt-8 rounded-2xl bg-[var(--color-primary-soft)]/50 p-6 text-center">
            <p className="text-[13px] text-[var(--color-ink)]">원하는 답을 못 찾으셨나요?</p>
            <button
              type="button"
              onClick={() => setShowContact(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-[12.5px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              문의하기
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>
      <Footer />

      <ContactModal open={showContact} onClose={() => setShowContact(false)} />
    </main>
  );
}
