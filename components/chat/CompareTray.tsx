"use client";

import { useState } from "react";

interface Props {
  count: number;
  onOpen: () => void;
}

export default function CompareTray({ count, onOpen }: Props) {
  const [showTip, setShowTip] = useState(false);
  const empty = count === 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        disabled={empty}
        className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-[12px] font-medium transition-colors ${
          empty
            ? "border-dashed border-[var(--color-border)] text-[var(--color-ink-faint)]"
            : "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span aria-hidden>📊</span>
          비교함
        </span>
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10.5px] font-semibold ${
            empty ? "bg-gray-100 text-[var(--color-ink-faint)]" : "bg-white text-[var(--color-primary)]"
          }`}
        >
          {count}
        </span>
      </button>

      {showTip && (
        <div className="animate-fade-up absolute left-0 right-0 top-full z-30 mt-2 rounded-lg bg-[var(--color-ink)] px-3 py-2.5 text-[11px] leading-relaxed text-white shadow-lg">
          결과 카드의 <span className="font-semibold">+</span> 버튼으로 최대 4개까지 담아
          나란히 비교하고, 비교 결과를 이미지로 저장/공유할 수 있어요.
          <span className="absolute -top-1 left-6 h-2 w-2 rotate-45 bg-[var(--color-ink)]" />
        </div>
      )}
    </div>
  );
}
