"use client";

import type { Product } from "@/types";
import { getIngredient, getCategoriesForIngredient } from "@/lib/ingredients";
import ArrowRightIcon from "@/components/ArrowRightIcon";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: Props) {
  if (!product) return null;

  const ingredient = getIngredient(product.ingredientId);
  const relatedCategories = getCategoriesForIngredient(product.ingredientId);
  const pricePerMl = Math.round(product.price / product.volumeMl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 py-8" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div
          className="h-40 w-full shrink-0"
          style={{ backgroundColor: product.imageColor }}
          aria-hidden
        />
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            {relatedCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {relatedCategories.map((c) => (
                  <span
                    key={c.key}
                    className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--color-primary)]"
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            )}
            <h2 className="mt-2 text-[16px] font-bold text-[var(--color-ink)]">
              {product.brand} {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="shrink-0 text-[18px] leading-none text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-6 pt-4">
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-gray-50 py-2.5">
              <dt className="text-[10px] text-[var(--color-ink-faint)]">가격</dt>
              <dd className="mt-0.5 text-[13px] font-semibold text-[var(--color-ink)]">
                {product.price.toLocaleString()}원
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 py-2.5">
              <dt className="text-[10px] text-[var(--color-ink-faint)]">용량</dt>
              <dd className="mt-0.5 text-[13px] font-semibold text-[var(--color-ink)]">
                {product.volumeMl}ml
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 py-2.5">
              <dt className="text-[10px] text-[var(--color-ink-faint)]">ml당 가격</dt>
              <dd className="mt-0.5 text-[13px] font-semibold text-[var(--color-ink)]">
                {pricePerMl.toLocaleString()}원
              </dd>
            </div>
          </dl>

          {ingredient && (
            <div className="mt-4 rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-[12px] font-semibold text-[var(--color-primary)]">
                핵심 성분: {ingredient.name}{" "}
                <span className="font-normal text-[var(--color-ink-faint)]">
                  (기준위치 {ingredient.refPosition}번 · 이 제품 내 {product.actualPosition}번째)
                </span>
              </p>
              <p className="mt-2 text-[12.5px] text-[var(--color-ink)] leading-relaxed">
                {ingredient.effect}
              </p>
              <p className="mt-2 text-[11.5px] text-[var(--color-ink-soft)] leading-relaxed">
                <span className="font-medium text-[var(--color-ink)]">주의사항 </span>
                {ingredient.caution}
              </p>
            </div>
          )}

          <a
            href={product.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] py-3 text-[13px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            구매하러 가기
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
