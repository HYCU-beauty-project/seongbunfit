"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { products } from "@/lib/products";
import { categories, getAllUniqueIngredients, getCategory, getIngredient } from "@/lib/ingredients";
import type { CategoryKey, Product } from "@/types";
import ProductDetailModal from "@/components/product/ProductDetailModal";
import RequestProductModal from "@/components/RequestProductModal";

const PAGE_SIZE = 9;

type SortKey =
  | "name"
  | "priceAsc"
  | "priceDesc"
  | "pricePerMlAsc"
  | "pricePerMlDesc"
  | "volumeAsc"
  | "volumeDesc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name", label: "기본순" },
  { value: "pricePerMlAsc", label: "ml당 가격 낮은순" },
  { value: "pricePerMlDesc", label: "ml당 가격 높은순" },
  { value: "priceAsc", label: "전체 가격 낮은순" },
  { value: "priceDesc", label: "전체 가격 높은순" },
  { value: "volumeAsc", label: "용량 작은순" },
  { value: "volumeDesc", label: "용량 큰순" },
];

function sortProducts(list: Product[], sortKey: SortKey): Product[] {
  const arr = [...list];
  switch (sortKey) {
    case "priceAsc":
      return arr.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return arr.sort((a, b) => b.price - a.price);
    case "pricePerMlAsc":
      return arr.sort((a, b) => a.price / a.volumeMl - b.price / b.volumeMl);
    case "pricePerMlDesc":
      return arr.sort((a, b) => b.price / b.volumeMl - a.price / a.volumeMl);
    case "volumeAsc":
      return arr.sort((a, b) => a.volumeMl - b.volumeMl);
    case "volumeDesc":
      return arr.sort((a, b) => b.volumeMl - a.volumeMl);
    default:
      return arr.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
}

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<CategoryKey | "all">("all");
  const [filterIngredient, setFilterIngredient] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const availableIngredients =
    filterCategory === "all" ? getAllUniqueIngredients() : getCategory(filterCategory).ingredients;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const ingredientName = getIngredient(p.ingredientId)?.name ?? "";
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        ingredientName.toLowerCase().includes(q);
      const matchesIngredient = filterIngredient === "all" || p.ingredientId === filterIngredient;
      const matchesCategory =
        filterCategory === "all" ||
        getCategory(filterCategory).ingredients.some((i) => i.id === p.ingredientId);
      return matchesQuery && matchesIngredient && matchesCategory;
    });
    list = sortProducts(list, sortKey);
    return list;
  }, [query, filterCategory, filterIngredient, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetToFirstPage() {
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-[var(--color-ink)]">화장품 검색</h1>
            <p className="mt-1.5 text-[13px] text-[var(--color-ink-faint)]">
              성분핏 DB에 등록된 세럼 {products.length}종을 바로 검색해보세요. 채팅 없이도 둘러볼 수
              있어요.
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-[12.5px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors shrink-0"
          >
            내 고민에 맞게 AI로 추천받기
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetToFirstPage();
            }}
            placeholder="제품명, 브랜드, 성분명으로 검색 (예: 레티놀, 셀루틴)"
            className="w-full max-w-md rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />

          <div className="flex flex-wrap gap-2.5">
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value as CategoryKey | "all");
                setFilterIngredient("all");
                resetToFirstPage();
              }}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12.5px] text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="all">전체 고민</option>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={filterIngredient}
              onChange={(e) => {
                setFilterIngredient(e.target.value);
                resetToFirstPage();
              }}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12.5px] text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="all">전체 성분</option>
              {availableIngredients.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>

            <select
              value={sortKey}
              onChange={(e) => {
                setSortKey(e.target.value as SortKey);
                resetToFirstPage();
              }}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12.5px] text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {(filterCategory !== "all" || filterIngredient !== "all" || sortKey !== "name" || query) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilterCategory("all");
                  setFilterIngredient("all");
                  setSortKey("name");
                  resetToFirstPage();
                }}
                className="rounded-lg px-3 py-2 text-[12.5px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
              >
                필터 초기화
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-[11.5px] text-[var(--color-ink-faint)]">{filtered.length}개 제품</p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center">
            <p className="text-[13.5px] font-medium text-[var(--color-ink)]">
              조건에 맞는 제품을 찾지 못했어요.
            </p>
            <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
              아직 DB에 없는 제품일 수 있어요. 추가해달라고 요청해보세요.
            </p>
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-[12.5px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              이 제품 추가 요청하기
              <span aria-hidden>→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((p) => {
                const ingredient = getIngredient(p.ingredientId);
                const pricePerMl = Math.round(p.price / p.volumeMl);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProduct(p)}
                    className="rounded-xl border border-[var(--color-border)] p-4 text-left hover:border-[var(--color-primary)] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="h-12 w-12 shrink-0 rounded-lg"
                        style={{ backgroundColor: p.imageColor }}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
                          {p.brand} {p.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--color-ink-faint)]">
                          {p.price.toLocaleString()}원 · {p.volumeMl}ml · ml당 {pricePerMl.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                    {ingredient && (
                      <span className="mt-3 inline-block rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]">
                        핵심 성분: {ingredient.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg px-2.5 py-1.5 text-[12px] text-[var(--color-ink-soft)] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← 이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`h-7 w-7 rounded-lg text-[12px] font-medium transition-colors ${
                      n === currentPage
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-ink-soft)] hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg px-2.5 py-1.5 text-[12px] text-[var(--color-ink-soft)] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  다음 →
                </button>
              </div>
            )}

            <div className="mt-10 rounded-2xl bg-[var(--color-primary-soft)]/50 p-6 text-center">
              <p className="text-[13px] text-[var(--color-ink)]">
                찾는 제품이 목록에 없나요? 추가해달라고 알려주세요.
              </p>
              <button
                type="button"
                onClick={() => setShowRequestModal(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-primary)] px-4 py-2 text-[12.5px] font-medium text-[var(--color-primary)] hover:bg-white transition-colors"
              >
                제품 추가 요청하기
                <span aria-hidden>→</span>
              </button>
            </div>
          </>
        )}
      </section>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <RequestProductModal
        open={showRequestModal}
        initialName={query}
        onClose={() => setShowRequestModal(false)}
      />
    </main>
  );
}
