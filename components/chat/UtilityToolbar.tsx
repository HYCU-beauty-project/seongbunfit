"use client";

interface Props {
  onOpenCalc: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  favoriteCount: number;
  onOpenFavorites: () => void;
  onOpenContact: () => void;
}

export default function UtilityToolbar({
  onOpenCalc,
  compareCount,
  onOpenCompare,
  favoriteCount,
  onOpenFavorites,
  onOpenContact,
}: Props) {
  return (
    <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
      <button
        type="button"
        onClick={onOpenCalc}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left text-[12px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-primary-soft)] transition-colors"
      >
        <span aria-hidden>🧮</span>
        가성비 계산법 보기
      </button>
      <button
        type="button"
        onClick={onOpenCompare}
        className="flex w-full items-center justify-between gap-2.5 px-3.5 py-3 text-left text-[12px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-primary-soft)] transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span aria-hidden>📊</span>
          비교함
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
            compareCount > 0
              ? "bg-[var(--color-primary)] text-white"
              : "bg-gray-100 text-[var(--color-ink-faint)]"
          }`}
        >
          {compareCount}
        </span>
      </button>
      <button
        type="button"
        onClick={onOpenFavorites}
        className="flex w-full items-center justify-between gap-2.5 px-3.5 py-3 text-left text-[12px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-primary-soft)] transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span aria-hidden>⭐</span>
          즐겨찾기
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
            favoriteCount > 0
              ? "bg-[var(--color-primary)] text-white"
              : "bg-gray-100 text-[var(--color-ink-faint)]"
          }`}
        >
          {favoriteCount}
        </span>
      </button>
      <button
        type="button"
        onClick={onOpenContact}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left text-[12px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-primary-soft)] transition-colors"
      >
        <span aria-hidden>💬</span>
        문의하기
      </button>
    </div>
  );
}
