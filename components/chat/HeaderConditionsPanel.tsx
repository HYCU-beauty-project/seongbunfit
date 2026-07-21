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

// 모바일 채팅창 헤더 화살표 누르면 아래로 펼쳐지는 패널.
// 대화 길어지면 "선택한 조건"이랑 "처음부터 다시 시작하기"가
// 스크롤 없이는 안 보여서, 헤더에서 바로 열 수 있게 만듦
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
