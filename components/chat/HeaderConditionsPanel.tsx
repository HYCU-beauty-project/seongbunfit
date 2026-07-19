'use client';

import type { BudgetOption, Category, Ingredient } from '@/types';

interface Props {
    category: Category | null;
    ingredient: Ingredient | null;
    budget: BudgetOption | null;
    onEditCategory?: () => void;
    onEditIngredient?: () => void;
    onEditBudget?: () => void;
    onRestart: () => void;
    onClose: () => void;
}

// 모바일 채팅창 헤더의 화살표를 눌렀을 때 아래로 펼쳐지는 패널이에요.
// "선택한 조건"이 대화가 길어지면 스크롤 없이는 아예 안 보이던 문제와,
// "처음부터 다시 시작하기" 버튼을 찾을 수 없던 문제를 함께 해결해요 — 언제든
// 헤더의 화살표만 누르면 바로 확인할 수 있어요.
export default function HeaderConditionsPanel({
    category,
    ingredient,
    budget,
    onEditCategory,
    onEditIngredient,
    onEditBudget,
    onRestart,
    onClose,
}: Props) {
    const rows: { label: string; value: string | null; onEdit?: () => void }[] = [
        { label: '고민', value: category?.label ?? null, onEdit: onEditCategory },
        { label: '성분', value: ingredient?.name ?? null, onEdit: onEditIngredient },
        { label: '예산', value: budget?.label ?? null, onEdit: onEditBudget },
    ];

    return (
        <div className="animate-fade-up absolute left-0 right-0 top-full z-40 border-b border-[var(--color-border)] bg-white px-4 py-3.5 shadow-md">
            <p className="text-[11px] font-semibold text-[var(--color-ink-soft)]">선택한 조건</p>
            <dl className="mt-2 space-y-2">
                {rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                        <dt className="text-[11.5px] text-[var(--color-ink-faint)]">{row.label}</dt>
                        <dd>
                            {row.value ? (
                                row.onEdit ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            row.onEdit?.();
                                            onClose();
                                        }}
                                        className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]">
                                        {row.value} ✎
                                    </button>
                                ) : (
                                    <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]">
                                        {row.value}
                                    </span>
                                )
                            ) : (
                                <span className="text-[11px] text-[var(--color-ink-faint)]">-</span>
                            )}
                        </dd>
                    </div>
                ))}
            </dl>

            <button
                type="button"
                onClick={() => {
                    onRestart();
                    onClose();
                }}
                className="mt-3 w-full rounded-lg border border-[var(--color-border)] bg-white py-2 text-[11.5px] font-medium text-[var(--color-ink-soft)] hover:bg-gray-50 transition-colors">
                처음부터 다시 시작하기
            </button>
        </div>
    );
}
