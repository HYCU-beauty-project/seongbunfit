"use client";

import { useState } from "react";

const CONTACT_EMAIL = "help@seongbunfit.com";

export default function ContactButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="animate-fade-up absolute bottom-[60px] right-0 w-64 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-lg">
          <p className="text-[12.5px] font-semibold text-[var(--color-ink)]">문의하기</p>
          <p className="mt-1 text-[11.5px] text-[var(--color-ink-faint)] leading-relaxed">
            서비스 이용 중 궁금한 점이 있으시면 이메일로 문의해주세요.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] py-2 text-[12px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="문의하기"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1.5-4.5A8.5 8.5 0 1 1 21 11.5Z" />
          <path d="M12 8v4M12 15h.01" />
        </svg>
      </button>
    </div>
  );
}
