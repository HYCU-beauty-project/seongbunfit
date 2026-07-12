"use client";

import { useState } from "react";
import Button from "./Button";
import TermsContent from "@/components/TermsContent";

const POINTS = [
  { text: "전성분 배치 순서 기반이며 정확한 성분 함량이 아닙니다", emphasize: false },
  { text: "의료적 진단·처방을 대체하지 않습니다", emphasize: true },
  { text: "구매 전 제품 정보와 성분을 직접 확인해 주세요", emphasize: false },
];

interface Props {
  open: boolean;
  onAgree: () => void;
  onBack: () => void;
}

export default function Modal({ open, onAgree, onBack }: Props) {
  const [showTerms, setShowTerms] = useState(false);

  if (!open) return null;

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-16">
      <div className="animate-fade-up w-full max-w-md rounded-2xl bg-white shadow-sm p-7">
        <h2 className="text-[17px] font-semibold text-[var(--color-ink)]">
          서비스 이용 전 아래 내용을 확인해 주세요
        </h2>
        <p className="mt-1.5 text-[13px] text-[var(--color-ink-faint)]">
          아래 내용에 동의하시면 서비스를 이용할 수 있어요
        </p>

        <ul className="mt-5 space-y-2.5 rounded-xl bg-[var(--color-primary-soft)] p-4">
          {POINTS.map((point) => (
            <li
              key={point.text}
              className={`flex items-start gap-2 text-[13px] ${
                point.emphasize ? "text-[var(--color-primary)]" : "text-[var(--color-ink)]"
              }`}
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-[10px]"
              >
                ✓
              </span>
              <span className={point.emphasize ? "font-bold" : "font-medium"}>{point.text}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setShowTerms(true)}
          className="mt-4 block w-full text-center text-[12px] text-[var(--color-ink-faint)] underline decoration-[var(--color-border)] underline-offset-2 hover:text-[var(--color-ink-soft)] transition-colors"
        >
          이용약관 전문 보기 →
        </button>

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            돌아가기
          </Button>
          <Button variant="primary" className="flex-[1.4]" onClick={onAgree}>
            동의하고 시작하기
            <span aria-hidden>→</span>
          </Button>
        </div>
      </div>

      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 py-8"
          onClick={() => setShowTerms(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-up flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">이용약관</h3>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                aria-label="닫기"
                className="text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors text-[18px] leading-none"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <TermsContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
