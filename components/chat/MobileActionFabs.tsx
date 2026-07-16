"use client";

import { useState } from "react";

interface Props {
  compareCount: number;
  onOpenCalc: () => void;
  onOpenCompare: () => void;
  onOpenContact: () => void;
}

export default function MobileActionFabs({ compareCount, onOpenCalc, onOpenCompare, onOpenContact }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-[76px] right-3 z-40 flex flex-col items-end gap-3">
      {open && (
        <>
          <SubFab
            label="문의하기"
            icon="💬"
            delay={0}
            onClick={() => {
              setOpen(false);
              onOpenContact();
            }}
          />
          <SubFab
            label={`비교함 ${compareCount > 0 ? `· ${compareCount}` : ""}`}
            icon="📊"
            delay={60}
            onClick={() => {
              setOpen(false);
              onOpenCompare();
            }}
          />
          <SubFab
            label="계산법 보기"
            icon="🧮"
            delay={120}
            onClick={() => {
              setOpen(false);
              onOpenCalc();
            }}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        className={`flex h-13 w-13 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition-transform active:scale-90 ${
          open ? "rotate-45" : ""
        }`}
        style={{ height: 52, width: 52, transitionDuration: "200ms" }}
      >
        <span aria-hidden className="text-[22px] leading-none">
          +
        </span>
      </button>
    </div>
  );
}

function SubFab({
  label,
  icon,
  delay,
  onClick,
}: {
  label: string;
  icon: string;
  delay: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="animate-fade-up flex items-center gap-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[16px] shadow-md border border-[var(--color-border)]"
      >
        {icon}
      </span>
      <span className="rounded-full bg-[var(--color-ink)] px-2.5 py-1 text-[11px] font-medium text-white shadow-md">
        {label}
      </span>
    </button>
  );
}
