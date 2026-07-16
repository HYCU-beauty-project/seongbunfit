"use client";

import { useState } from "react";
import FaqContent from "@/components/FaqContent";
import ArrowRightIcon from "@/components/ArrowRightIcon";
import ContactModal from "@/components/ContactModal";

export default function MobileFaqPage() {
  const [showContact, setShowContact] = useState(false);

  return (
    <main className="px-5 py-8">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">FAQ</h1>
      <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
        자주 묻는 질문을 모았어요.
      </p>
      <div className="mt-6">
        <FaqContent />
      </div>

      <div className="mt-8 rounded-2xl bg-[var(--color-primary-soft)]/50 p-5 text-center">
        <p className="text-[12.5px] text-[var(--color-ink)]">원하는 답을 못 찾으셨나요?</p>
        <button
          type="button"
          onClick={() => setShowContact(true)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-[12px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          문의하기
          <ArrowRightIcon />
        </button>
      </div>

      <ContactModal open={showContact} onClose={() => setShowContact(false)} />
    </main>
  );
}
