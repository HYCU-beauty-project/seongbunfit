"use client";

import ArrowRightIcon from "@/components/ArrowRightIcon";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "피부 고민을 입력해주세요.",
  disabled,
}: Props) {
  return (
    <form
      className="flex items-center gap-2.5 border-t border-[var(--color-border)] px-4 py-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        전송
        <ArrowRightIcon />
      </button>
    </form>
  );
}
