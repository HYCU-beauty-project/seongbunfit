"use client";

import { useRef, useState } from "react";
import type { Ingredient, ScoredProduct } from "@/types";
import ResultCard from "@/components/product/ResultCard";

interface Props {
  results: ScoredProduct[];
  ingredient: Ingredient;
  compareIds: string[];
  onToggleCompare: (product: ScoredProduct) => void;
}

export default function ResultCarousel({ results, ingredient, compareIds, onToggleCompare }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToIndex(idx: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(results.length - 1, idx));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(idx);
  }

  return (
    <div>
      {/* 화살표를 카드 위에 겹쳐 올리지 않고, 별도 좌우 칸으로 분리해서
          카드 안쪽 버튼(비교함/구매하러 가기)과 안 붙어 보이게 했어요. */}
      <div className="flex items-center gap-2">
        {results.length > 1 && (
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="이전 결과"
            className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--color-ink-soft)] shadow-md border border-[var(--color-border)] disabled:opacity-30 transition-opacity"
          >
            <ChevronIcon direction="left" />
          </button>
        )}

        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {results.map((product, idx) => (
            <div key={product.id} className="w-full shrink-0 snap-center">
              <ResultCard
                rank={idx + 1}
                product={product}
                ingredient={ingredient}
                isInCompare={compareIds.includes(product.id)}
                onToggleCompare={() => onToggleCompare(product)}
              />
            </div>
          ))}
        </div>

        {results.length > 1 && (
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === results.length - 1}
            aria-label="다음 결과"
            className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--color-ink-soft)] shadow-md border border-[var(--color-border)] disabled:opacity-30 transition-opacity"
          >
            <ChevronIcon direction="right" />
          </button>
        )}
      </div>

      {results.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {results.map((product, idx) => (
            <button
              key={product.id}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`${idx + 1}번째 결과 보기`}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex ? "w-4 bg-[var(--color-primary)]" : "w-1.5 bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}
