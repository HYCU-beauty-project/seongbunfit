"use client";

import type { BudgetOption, Category, Ingredient } from "@/types";

interface DetailProps {
  mode: "detail";
  ingredient: Ingredient;
}

interface ConditionsProps {
  mode: "conditions";
  category: Category | null;
  ingredient: Ingredient | null;
  budget: BudgetOption | null;
  onEditCategory?: () => void;
  onEditIngredient?: () => void;
  onEditBudget?: () => void;
}

type Props = DetailProps | ConditionsProps;

export default function SidePanel(props: Props) {
  if (props.mode === "detail") {
    const { ingredient } = props;
    return (
      <div
        key={ingredient.id}
        className="animate-fade-up overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm"
      >
        <div className="relative py-3.5 pl-6 pr-4">
          <span
            aria-hidden
            className="absolute left-3 top-3.5 bottom-3.5 w-1 rounded-full bg-[var(--color-primary)]"
          />
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            지금 보는 성분
          </p>
          <p className="mt-0.5 text-[16px] font-bold text-[var(--color-ink)]">{ingredient.name}</p>
        </div>
        <dl className="space-y-3 px-4 pb-4">
          <div>
            <dt className="text-[11px] font-semibold text-[var(--color-ink-soft)]">효능</dt>
            <dd className="mt-0.5 text-[12.5px] text-[var(--color-ink)] leading-relaxed">
              {ingredient.effect}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[var(--color-ink-soft)]">주의사항</dt>
            <dd className="mt-0.5 text-[12.5px] text-[var(--color-ink)] leading-relaxed">
              {ingredient.caution}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[var(--color-ink-soft)]">적합 피부</dt>
            <dd className="mt-0.5 text-[12.5px] text-[var(--color-ink)] leading-relaxed">
              {ingredient.goodFor}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  const { category, ingredient, budget, onEditCategory, onEditIngredient, onEditBudget } = props;
  const rows: { label: string; value: string | null; onEdit?: () => void }[] = [
    { label: "고민", value: category?.label ?? null, onEdit: onEditCategory },
    { label: "성분", value: ingredient?.name ?? null, onEdit: onEditIngredient },
    { label: "예산", value: budget?.label ?? null, onEdit: onEditBudget },
  ];

  return (
    <div className="animate-fade-up rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <p className="text-[12px] font-semibold text-[var(--color-ink-soft)]">선택한 조건</p>
      <dl className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <dt className="text-[12px] font-medium text-[var(--color-ink-soft)]">{row.label}</dt>
            <dd>
              {row.value ? (
                row.onEdit ? (
                  <button
                    type="button"
                    onClick={row.onEdit}
                    className="group inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                    title={`${row.label} 다시 선택하기`}
                  >
                    {row.value}
                    <span aria-hidden className="text-[9px] opacity-70 group-hover:opacity-100">
                      ✎
                    </span>
                  </button>
                ) : (
                  <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--color-primary)]">
                    {row.value}
                  </span>
                )
              ) : (
                <span className="text-[11.5px] text-[var(--color-ink-faint)]">-</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[10.5px] text-[var(--color-ink-faint)]">
        태그를 누르면 해당 항목만 다시 선택할 수 있어요.
      </p>
    </div>
  );
}
