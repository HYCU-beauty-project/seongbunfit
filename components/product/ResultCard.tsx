"use client";

import { useRef, useState } from "react";
import type { Ingredient, ScoredProduct } from "@/types";
import IngredientTag from "@/components/IngredientTag";
import ArrowRightIcon from "@/components/ArrowRightIcon";

interface Props {
  rank: number;
  product: ScoredProduct;
  ingredient: Ingredient;
  isInCompare?: boolean;
  onToggleCompare?: () => void;
}

const rankLabel: Record<number, string> = {
  1: "추천 1위",
  2: "2위",
  3: "3위",
};

export default function ResultCard({
  rank,
  product,
  ingredient,
  isInCompare = false,
  onToggleCompare,
}: Props) {
  const pricePerMl = Math.round(product.price / product.volumeMl);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function handleShare() {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        filter: (node) =>
          !(node instanceof HTMLElement && node.dataset.exportIgnore === "true"),
      });
      const fileName = `성분핏-${product.brand}-${product.name}.png`;

      const nav = navigator as Navigator & {
        canShare?: (data?: { files?: File[] }) => boolean;
        share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
      };

      if (nav.canShare && nav.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, { type: "image/png" });
        if (nav.canShare({ files: [file] })) {
          await nav.share({ files: [file], title: `${product.brand} ${product.name}`, text: "성분핏 추천 결과" });
          return;
        }
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("[ResultCard] 이미지 생성 실패:", error);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div ref={cardRef} className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-white p-4">
      <div className="flex items-start gap-3">
        <div
          className="h-14 w-14 shrink-0 rounded-lg"
          style={{ backgroundColor: product.imageColor }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">
            {rankLabel[rank] ?? `${rank}위`}
          </span>
          <p className="mt-1 truncate text-[13.5px] font-semibold text-[var(--color-ink)]">
            {product.brand} {product.name}
          </p>
          <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-faint)]">
            가격 {product.price.toLocaleString()}원 · 용량 {product.volumeMl}ml · ml당 가격{" "}
            {pricePerMl.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* flex-1로 남는 공간을 채워서, 카드마다 추천 이유 길이가 달라도
          아래 버튼들이 항상 같은 위치에 오게 했어요. */}
      <div className="mt-3 flex-1 rounded-lg bg-[var(--color-primary-soft)]/60 px-3 py-2.5 text-[11.5px] text-[var(--color-ink-soft)] leading-relaxed">
        <div className="flex items-center gap-1.5">
          <IngredientTag ingredientId={ingredient.id} size={18} />
          <span className="text-[11.5px] font-semibold text-[var(--color-ink)]">{ingredient.name}</span>
        </div>
        <p className="mt-1.5">
          전성분 배치 순위 {product.actualPosition}번째 (배치 점수 {product.placementScore}점)
        </p>
        <p className="mt-0.5 flex items-center gap-1 font-semibold text-[var(--color-accent-text)]">
          <SparkleIcon />
          가성비 지수: {product.finalScore}
        </p>
        <p className="mt-1.5">
          <span className="font-medium text-[var(--color-ink)]">추천 이유 </span>
          {product.reason || "가성비 조건에 맞는 추천 제품이에요."}
        </p>
      </div>

      <div data-export-ignore="true" className="mt-3 flex gap-2">
        {onToggleCompare && (
          <button
            type="button"
            onClick={onToggleCompare}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11.5px] font-medium transition-colors ${
              isInCompare
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            }`}
          >
            <span aria-hidden>{isInCompare ? "✓" : "+"}</span>
            {isInCompare ? "비교함에 담김" : "비교함에 담기"}
          </button>
        )}
        <button
          type="button"
          onClick={handleShare}
          disabled={isExporting}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-2 text-[11.5px] font-medium text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
        >
          <span aria-hidden>⤓</span>
          {isExporting ? "저장 중…" : "이미지 저장"}
        </button>
      </div>

      <a
        href={product.purchaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] py-2.5 text-[12.5px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
      >
        구매하러 가기
        <ArrowRightIcon />
      </a>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="shrink-0"
    >
      <path d="M12 2.5c.9 4 2.2 6.3 4.5 7.5-2.3 1.2-3.6 3.5-4.5 7.5-.9-4-2.2-6.3-4.5-7.5 2.3-1.2 3.6-3.5 4.5-7.5Z" />
    </svg>
  );
}
