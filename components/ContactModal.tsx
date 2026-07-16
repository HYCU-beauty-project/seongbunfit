"use client";

import ContactContent from "@/components/ContactContent";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 py-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[var(--color-ink)]">문의하기</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-[18px] leading-none text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
          >
            ✕
          </button>
        </div>
        <ContactContent onCancel={onClose} />
      </div>
    </div>
  );
}
