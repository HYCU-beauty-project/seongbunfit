"use client";

import { useState } from "react";
import type { BudgetOption, Category, Ingredient } from "@/types";

interface Props {
  category: Category | null;
  ingredient: Ingredient | null;
  budget: BudgetOption | null;
  onEditCategory?: () => void;
  onEditIngredient?: () => void;
  onEditBudget?: () => void;
}

export default function CompactConditionsBar({
  category,
  ingredient,
  budget,
  onEditCategory,
  onEditIngredient,
  onEditBudget,
}: Props) {
  const [open, setOpen] = useState(false);

  const summary = [category?.label, ingredient?.name, budget?.label].filter(Boolean).join(" · ");

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
      >
        <span className="min-w-0 truncate text-[11.5px] text-[var(--color-ink-soft)]">
          <span className="mr-2 font-medium text-[var(--color-ink)]">선택한 조건</span>
          {summary || "-"}
        </span>
        <span
          aria-hidden
          className={`flex h-6 w-6 shrink-0 items-center justify-center text-[var(--color-ink-faint)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className="animate-fade-up space-y-2 border-t border-[var(--color-border)] px-3.5 py-3">
          <ConditionRow label="고민" value={category?.label ?? null} onEdit={onEditCategory} />
          <ConditionRow label="성분" value={ingredient?.name ?? null} onEdit={onEditIngredient} />
          <ConditionRow label="예산" value={budget?.label ?? null} onEdit={onEditBudget} />
          <p className="text-[10px] text-[var(--color-ink-faint)]">
            태그를 누르면 해당 항목만 다시 선택할 수 있어요.
          </p>
        </div>
      )}
    </div>
  );
}

function ConditionRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string | null;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[var(--color-ink-faint)]">{label}</span>
      {value ? (
        onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]"
          >
            {value} ✎
          </button>
        ) : (
          <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]">
            {value}
          </span>
        )
      ) : (
        <span className="text-[11px] text-[var(--color-ink-faint)]">-</span>
      )}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
