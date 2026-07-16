"use client";

import { getIngredientInCategory, getAllUniqueIngredients } from "@/lib/ingredients";
import { getBudget } from "@/lib/budgets";
import { SCORE_WEIGHTS } from "@/lib/scoring/calculator";
import type { AiResultMessage } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  latestResult?: AiResultMessage;
}

export default function ScoreExplainer({ open, onClose, latestResult }: Props) {
  if (!open) return null;

  const ingredient = latestResult
    ? getIngredientInCategory(latestResult.categoryKey, latestResult.ingredientId)
    : undefined;
  const budget = latestResult ? getBudget(latestResult.budgetId) : undefined;
  const hasResults = latestResult && latestResult.results.length > 0 && ingredient;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 py-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">
            가성비 지수는 이렇게 계산돼요
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors text-[18px] leading-none"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-[var(--color-primary-soft)] p-4 text-center">
          <p className="text-[13px] font-medium text-[var(--color-ink)]">
            최종 점수 = 배치 점수 × {SCORE_WEIGHTS.placement} + 가격 점수 × {SCORE_WEIGHTS.price} +
            예산 점수 × {SCORE_WEIGHTS.budget}
          </p>
        </div>

        <dl className="mt-4 space-y-3">
          <FactorRow
            title={`전성분 배치 점수 (${SCORE_WEIGHTS.placement * 100}%)`}
            desc="실제 성분 위치 ÷ 기준 위치 배수로 계산해요. 1.0배 이하면 100점, 배수가 커질수록 점수가 떨어져 3.0배를 넘으면 0점이 돼요. 성분이 전성분표 앞쪽에 있을수록(=함량이 높을수록) 유리해요."
          />
          <FactorRow
            title={`용량 대비 가격 점수 (${SCORE_WEIGHTS.price * 100}%)`}
            desc="같이 비교 중인 후보 제품들 중 ml당 가격이 가장 저렴한 제품을 100점 기준으로 놓고, 그보다 비싼 제품은 상대적으로 낮은 점수를 받아요."
          />
          <FactorRow
            title={`예산 적합 점수 (${SCORE_WEIGHTS.budget * 100}%)`}
            desc="설정한 예산 대비 얼마나 여유가 있는지를 점수화해요. 예산을 초과하는 제품은 아예 후보에서 제외돼요."
          />
        </dl>

        {hasResults ? (
          <div className="mt-5">
            <p className="text-[12px] font-semibold text-[var(--color-ink-faint)]">
              지금 추천받은 {ingredient!.name} · {budget!.label} 결과 기준 실제 계산값
            </p>
            <div className="mt-2.5 space-y-2.5">
              {latestResult!.results.map((product, idx) => (
                <div key={product.id} className="rounded-lg border border-[var(--color-border)] p-3">
                  <p className="text-[12.5px] font-semibold text-[var(--color-ink)]">
                    {idx + 1}위 · {product.brand} {product.name}
                  </p>
                  <div className="mt-1.5 grid grid-cols-3 gap-2 text-center">
                    <ScoreCell
                      label={`배치 (${product.actualPosition}/${ingredient!.refPosition}번)`}
                      value={product.placementScore}
                    />
                    <ScoreCell
                      label={`ml당 ${Math.round(product.price / product.volumeMl).toLocaleString()}원`}
                      value={product.priceScore}
                    />
                    <ScoreCell label="예산 여유" value={product.budgetScore} />
                  </div>
                  <p className="mt-2 text-center text-[11.5px] text-[var(--color-ink-soft)]">
                    {product.placementScore} × {SCORE_WEIGHTS.placement} + {product.priceScore} ×{" "}
                    {SCORE_WEIGHTS.price} + {product.budgetScore} × {SCORE_WEIGHTS.budget} ={" "}
                    <span className="font-semibold text-[var(--color-accent-text)]">
                      {product.finalScore}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-5 rounded-lg bg-gray-50 px-3 py-3 text-[12px] text-[var(--color-ink-faint)]">
            성분과 예산을 선택해서 추천 결과를 받아보시면, 그 결과의 실제 계산값을 여기서 바로
            확인하실 수 있어요.
          </p>
        )}

        <div className="mt-6 border-t border-[var(--color-border)] pt-5">
          <p className="text-[12.5px] font-semibold text-[var(--color-ink)]">
            성분마다 기준위치가 왜 다른가요?
          </p>
          <p className="mt-1.5 text-[12px] text-[var(--color-ink-soft)] leading-relaxed">
            나이아신아마이드처럼 적은 양으로도 효과가 있는 성분은 기준위치가 낮고(7번),
            세라마이드처럼 어느 정도 함량이 필요한 성분은 기준위치가 높아요(25번). 그래서 같은
            &ldquo;전성분표 10번째&rdquo;라도 어떤 성분이냐에 따라 배치 점수가 달라져요. 아래는
            전체 성분의 기준위치 전체 목록이에요.
          </p>

          <div className="mt-3 overflow-hidden rounded-lg border border-[var(--color-border)]">
            <div className="grid grid-cols-[1fr_auto] gap-x-3 bg-gray-50 px-3 py-2 text-[10.5px] font-medium text-[var(--color-ink-faint)]">
              <span>성분명</span>
              <span>기준위치</span>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {getAllUniqueIngredients().map((ing) => (
                <div
                  key={ing.id}
                  className="grid grid-cols-[1fr_auto] gap-x-3 px-3 py-2 text-[12px] text-[var(--color-ink)]"
                >
                  <span>{ing.name}</span>
                  <span className="font-medium text-[var(--color-ink-soft)]">{ing.refPosition}번</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[10.5px] text-[var(--color-ink-faint)]">
            * 정제수·글리세린 등 베이스 성분도 포함한 전체 전성분 리스트 기준 순번이에요. 기준위치
            숫자들은 이미 베이스 성분이 앞쪽에 오는 것을 감안해서 정해져 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}

function FactorRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <dt className="text-[12.5px] font-semibold text-[var(--color-ink)]">{title}</dt>
      <dd className="mt-0.5 text-[12px] text-[var(--color-ink-soft)] leading-relaxed">{desc}</dd>
    </div>
  );
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-gray-50 px-1.5 py-2">
      <p className="text-[10px] text-[var(--color-ink-faint)] leading-tight">{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold text-[var(--color-ink)]">{value}점</p>
    </div>
  );
}
