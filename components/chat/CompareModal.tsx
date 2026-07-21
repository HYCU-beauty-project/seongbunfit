"use client";

import { useRef, useState } from "react";
import type { CompareItem } from "@/types";
import ScoreBar from "@/components/ScoreBar";

interface Props {
  open: boolean;
  items: CompareItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function CompareModal({ open, items, onClose, onRemove, onClearAll }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!open) return null;

  async function handleShareAll() {
    if (!captureRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        filter: (node) =>
          !(node instanceof HTMLElement && node.dataset.exportIgnore === "true"),
      });
      const fileName = `성분핏-비교-${items.length}개.png`;

      const nav = navigator as Navigator & {
        canShare?: (data?: { files?: File[] }) => boolean;
        share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
      };

      if (nav.canShare && nav.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, { type: "image/png" });
        if (nav.canShare({ files: [file] })) {
          await nav.share({ files: [file], title: "성분핏 비교 결과", text: "성분핏으로 비교한 제품들이에요" });
          return;
        }
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("[CompareModal] 이미지 생성 실패:", error);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 py-8" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">비교함 ({items.length})</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11.5px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
            >
              전체 비우기
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="text-[18px] leading-none text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[var(--color-ink-faint)]">
              비교함이 비어있어요. 추천 결과 카드에서 + 버튼을 눌러 담아보세요.
            </p>
          ) : (
            <div ref={captureRef} className="flex gap-3 bg-white">
              {items.map((item, idx) => {
                const p = item.product;
                const pricePerMl = Math.round(p.price / p.volumeMl);
                return (
                  <div
                    key={item.id}
                    className="flex h-full w-[190px] shrink-0 flex-col rounded-xl border border-[var(--color-border)] p-3"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[9.5px] font-medium text-[var(--color-primary)]">
                        {item.categoryLabel}
                      </span>
                      <button
                        type="button"
                        data-export-ignore="true"
                        onClick={() => onRemove(item.id)}
                        aria-label="비교함에서 빼기"
                        className="text-[13px] leading-none text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
                      >
                        ✕
                      </button>
                    </div>
                    <div
                      className="mt-2 h-10 w-10 rounded-lg"
                      style={{ backgroundColor: p.imageColor }}
                      aria-hidden
                    />
                    <p className="mt-2 text-[12px] font-semibold leading-snug text-[var(--color-ink)]">
                      {p.brand} {p.name}
                    </p>
                    <dl className="mt-2 space-y-1 text-[11px] text-[var(--color-ink-soft)]">
                      <Row label="핵심 성분" value={item.ingredientName} />
                      <Row label="가격" value={`${p.price.toLocaleString()}원`} />
                      <Row label="용량" value={`${p.volumeMl}ml`} />
                      <Row label="ml당 가격" value={`${pricePerMl.toLocaleString()}원`} />
                    </dl>

                    <div className="mt-2.5 space-y-1.5 border-t border-[var(--color-border)] pt-2.5">
                      <ScoreBar
                        label="배치 점수"
                        value={p.placementScore}
                        color="var(--color-primary)"
                        delay={idx * 70}
                        size="sm"
                      />
                      <ScoreBar
                        label="가격 점수"
                        value={p.priceScore}
                        color="var(--color-accent-deep)"
                        delay={idx * 70 + 50}
                        size="sm"
                      />
                      <ScoreBar
                        label="예산 점수"
                        value={p.budgetScore}
                        color="#c9a86a"
                        delay={idx * 70 + 100}
                        size="sm"
                      />
                      <ScoreBar
                        label="가성비 지수"
                        value={p.finalScore}
                        color="var(--color-accent-text)"
                        delay={idx * 70 + 150}
                        size="sm"
                      />
                    </div>

                    {/* mt-auto로 카드 하단 고정. 제품명 줄바꿈 등으로 카드마다 내용
                        길이 달라도 "구매하러 가기" 버튼은 항상 같은 세로 위치에 옴
                        (부모가 flex라 카드 높이는 이미 서로 같음) */}
                    <div className="mt-auto pt-2.5">
                      <a
                        href={p.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-export-ignore="true"
                        className="block rounded-lg bg-[var(--color-primary)] py-1.5 text-center text-[11px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                      >
                        구매하러 가기
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] px-6 py-4">
            <button
              type="button"
              onClick={handleShareAll}
              disabled={isExporting}
              className="w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-[13px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
            >
              {isExporting ? "이미지 만드는 중…" : "비교 결과 이미지로 저장/공유"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-1">
      <dt className="text-[var(--color-ink-faint)]">{label}</dt>
      <dd className={strong ? "font-semibold text-[var(--color-accent-text)]" : "text-[var(--color-ink)]"}>
        {value}
      </dd>
    </div>
  );
}
