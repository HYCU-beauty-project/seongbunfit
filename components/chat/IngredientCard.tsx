"use client";

import { useState } from "react";
import type { Ingredient } from "@/types";
import IngredientTag from "@/components/IngredientTag";

interface Props {
  ingredient: Ingredient;
  selected: boolean;
  onSelect: () => void;
  onPreview?: () => void;
  // 모바일에서는 호버가 없어서, 카드를 탭하면 바로 선택/다음 단계로 넘어가버리면
  // 효능·주의사항을 확인할 방법이 없어요. compact 모드에서는 카드를 탭하면 정보만 펼치고,
  // "이 성분으로 선택하기" 버튼을 따로 눌러야 실제로 선택되게 분리했어요.
  compact?: boolean;
}

export default function IngredientCard({ ingredient, selected, onSelect, onPreview, compact = false }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div
        className={`w-full rounded-xl border-2 p-3.5 transition-colors ${
          expanded
            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
            : "border-[var(--color-border)] bg-white"
        }`}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-start justify-between gap-2 text-left"
        >
          <div>
            <div className="flex items-center gap-2">
              <IngredientTag ingredientId={ingredient.id} size={22} />
              <span className="text-[13.5px] font-semibold text-[var(--color-ink)]">
                {ingredient.name}
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-[var(--color-ink-soft)] leading-relaxed">
              {ingredient.effect}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {ingredient.recommended && (
              <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-medium text-white">
                추천
              </span>
            )}
            <span
              aria-hidden
              className={`flex h-5 w-5 items-center justify-center text-[var(--color-ink-faint)] transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
        </button>

        {expanded && (
          <div className="animate-fade-up mt-3 space-y-2 border-t border-[var(--color-primary)]/20 pt-3">
            <DetailRow label="주의사항" value={ingredient.caution} />
            <DetailRow label="적합 피부" value={ingredient.goodFor} />
            <button
              type="button"
              onClick={onSelect}
              className="mt-1 w-full rounded-lg bg-[var(--color-primary)] py-2 text-[12px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              이 성분으로 선택하기
            </button>
          </div>
        )}
      </div>
    );
  }

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
        <span className="flex items-center gap-2 text-[13.5px] font-semibold text-[var(--color-ink)]">
          <IngredientTag ingredientId={ingredient.id} size={22} />
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-2.5 py-2">
      <p className="text-[10.5px] font-semibold text-[var(--color-ink-soft)]">{label}</p>
      <p className="mt-0.5 text-[11.5px] text-[var(--color-ink)] leading-relaxed">{value}</p>
    </div>
  );
}
