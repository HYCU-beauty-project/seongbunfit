"use client";

import type { Ingredient } from "@/types";

interface Props {
  ingredient: Ingredient;
  selected: boolean;
  onSelect: () => void;
  onPreview?: () => void;
}

export default function IngredientCard({ ingredient, selected, onSelect, onPreview }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onPreview}
      onFocus={onPreview}
      className={`w-full text-left rounded-xl border-2 p-3.5 transition-colors ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13.5px] font-semibold text-[var(--color-ink)]">
          {ingredient.name}
        </span>
        {ingredient.recommended && (
          <span className="shrink-0 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-medium text-white">
            추천
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[12px] text-[var(--color-ink-soft)] leading-relaxed">
        {ingredient.effect}
      </p>
    </button>
  );
}
