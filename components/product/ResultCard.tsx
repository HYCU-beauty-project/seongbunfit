'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import type { Ingredient, ScoredProduct } from '@/types';
import IngredientTag from '@/components/IngredientTag';
import ArrowRightIcon from '@/components/ArrowRightIcon';
import ScoreBar from '@/components/ScoreBar';

interface Props {
    rank: number;
    product: ScoredProduct;
    ingredient: Ingredient;
    isInCompare?: boolean;
    onToggleCompare?: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    // true면(모바일) 카드에 요약만 보여주고 막대그래프·추천 이유는 "상세보기" 눌렀을 때
    // 바텀시트로 펼쳐요. false면(데스크톱) 예전처럼 카드 안에 전부 바로 보여줘요 —
    // 데스크톱은 카드 폭이 넓어서 다 펼쳐놔도 카드가 지나치게 길어지지 않아요.
    compact?: boolean;
}

const rankLabel: Record<number, string> = {
    1: '추천 1위',
    2: '2위',
    3: '3위',
};

export default function ResultCard({
    rank,
    product,
    ingredient,
    isInCompare = false,
    onToggleCompare,
    isFavorite = false,
    onToggleFavorite,
    compact = false,
}: Props) {
    const pricePerMl = Math.round(product.price / product.volumeMl);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    // 카드 한 장이 화면(특히 모바일)보다 길어지면 캐러셀로 넘겨봐도 카드 전체가
    // 한눈에 안 들어와요. 그래서 카드는 "요약"만 보여주고, 배치·가격·예산 막대그래프와
    // 추천 이유 같은 상세 내용은 "상세보기"를 눌렀을 때 바텀시트로 펼쳐서 보여줘요.
    const [showDetail, setShowDetail] = useState(false);

    async function handleShare() {
        if (!cardRef.current || isExporting) return;
        setIsExporting(true);
        try {
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(cardRef.current, {
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                filter: (node) => !(node instanceof HTMLElement && node.dataset.exportIgnore === 'true'),
            });
            const fileName = `성분핏-${product.brand}-${product.name}.png`;

            // ⚠️ "이미지 저장" 버튼은 이름 그대로 바로 다운로드만 해요.
            // (OS 공유창을 띄우는 navigator.share()는 CompareModal의
            // "저장/공유" 버튼에서만 써요 — 그쪽은 문구가 공유까지 약속하니까요.)
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            link.click();
        } catch (error) {
            console.error('[ResultCard] 이미지 생성 실패:', error);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <>
        <div
            ref={cardRef}
            className="flex h-full flex-col rounded-xl bg-white p-3.5 shadow-[inset_0_0_0_1.5px_var(--color-border)]">
            <div className="flex items-start gap-3">
                {/* 더미 제품이라 실사진이 없어서, 파스텔 배경(imageColor) 위에
            공용 세럼 아이콘을 얹은 플레이스홀더를 사용해요.
            나중에 실제 제품 사진(imageUrl)이 생기면 이 부분만 교체하면 돼요. */}
                <div
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: product.imageColor }}
                    aria-hidden>
                    <Image src="/images/serum-placeholder.png" alt="" width={32} height={32} className="opacity-80" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <span className="inline-block shrink-0 whitespace-nowrap rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">
                            {rankLabel[rank] ?? `${rank}위`}
                        </span>
                        {onToggleFavorite && (
                            <button
                                type="button"
                                data-export-ignore="true"
                                onClick={onToggleFavorite}
                                aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기에 담기'}
                                aria-pressed={isFavorite}
                                className={`shrink-0 text-[16px] leading-none transition-colors ${
                                    isFavorite ? 'text-amber-400' : 'text-[var(--color-ink-faint)] hover:text-amber-400'
                                }`}>
                                {isFavorite ? '★' : '☆'}
                            </button>
                        )}
                    </div>
                    <p className="mt-1 truncate text-[13.5px] font-semibold text-[var(--color-ink)]">
                        {product.brand} {product.name}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-faint)]">
                        가격 {product.price.toLocaleString()}원 · 용량 {product.volumeMl}ml · ml당 가격{' '}
                        {pricePerMl.toLocaleString()}원
                    </p>
                </div>
            </div>

            {compact ? (
                <>
                    {/* 요약 줄: 핵심 성분·가성비 점수만 보여주고, 막대그래프·추천 이유 같은
                상세 내용은 버튼을 눌러야 펼쳐지는 바텀시트로 옮겼어요 — 카드 높이가
                화면(모바일)을 넘지 않아서 캐러셀에서 카드 전체가 한눈에 들어와요.
                ⚠️ 성분명·점수·화살표를 한 줄에 다 욱여넣었더니 일부 실기기 브라우저에서
                성분명 칸이 극단적으로 좁게 계산되어 글자가 거의 안 보이는 문제가 있었어요.
                성분명은 그 자체로 한 줄을 통째로 쓰게 하고, 점수·상세보기는 아래 줄로
                내려서 성분명이 다른 요소와 폭을 다툴 일이 없게 했어요. */}
                    <button
                        type="button"
                        onClick={() => setShowDetail(true)}
                        aria-label="배치·가격·예산 점수와 추천 이유 상세 보기"
                        className="mt-2.5 block w-full rounded-lg bg-[var(--color-primary-soft)]/60 px-3 py-2 text-left transition-colors hover:bg-[var(--color-primary-soft)]">
                        <span className="flex items-center gap-1.5">
                            <IngredientTag ingredientId={ingredient.id} size={18} />
                            <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[var(--color-ink)]">
                                {ingredient.name}
                            </span>
                        </span>
                        <span className="mt-1.5 flex items-center justify-between gap-2">
                            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[12.5px] font-semibold text-[var(--color-accent-text)]">
                                <SparkleIcon />
                                {/* ⚠️ CSS의 white-space:nowrap이 일부 기기(브라우저 접근성 설정,
                            데이터 절약 모드 등)에서 무시되는 경우가 있어서, "가성비"와
                            점수 사이의 일반 공백을 줄바꿈이 아예 불가능한 줄바꿈 방지
                            공백(U+00A0)으로 바꿨어요. 이건 CSS가 아니라 글자 자체의
                            성질이라 어떤 환경에서도 그 지점에서 줄이 안 끊겨요. */}
                                가성비{'\u00A0'}
                                {product.finalScore}점
                            </span>
                            <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-[10.5px] font-medium text-[var(--color-primary)]">
                                상세보기
                                <ChevronDownIcon />
                            </span>
                        </span>
                    </button>

                    {/* 남는 공간을 채워서, 카드마다 요약 줄 아래 여백이 달라도
                아래 버튼들이 항상 같은 위치에 오게 했어요. */}
                    <div className="flex-1" />
                </>
            ) : (
                <div className="mt-2.5 flex-1 rounded-lg bg-[var(--color-primary-soft)]/60 px-3 py-2 text-[11.5px] text-[var(--color-ink-soft)] leading-relaxed">
                    <div className="flex items-center justify-between gap-1.5">
                        <span className="flex items-center gap-1.5">
                            <IngredientTag ingredientId={ingredient.id} size={18} />
                            <span className="text-[11.5px] font-semibold text-[var(--color-ink)]">{ingredient.name}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-accent-text)]">
                            <SparkleIcon />
                            {product.finalScore}
                        </span>
                    </div>

                    {/* 배치·가격·예산 세 점수를 한눈에 비교할 수 있도록 애니메이션 막대그래프로 보여줘요. */}
                    <div className="mt-1.5 space-y-1">
                        <ScoreBar
                            label={`배치 ${product.actualPosition}번째`}
                            value={product.placementScore}
                            color="var(--color-primary)"
                            delay={rank * 80}
                            size="sm"
                        />
                        <ScoreBar
                            label="ml당 가격"
                            value={product.priceScore}
                            color="var(--color-accent-deep)"
                            delay={rank * 80 + 50}
                            size="sm"
                        />
                        <ScoreBar
                            label="예산 여유"
                            value={product.budgetScore}
                            color="#c9a86a"
                            delay={rank * 80 + 100}
                            size="sm"
                        />
                    </div>

                    <p className="mt-1.5">
                        <span className="font-medium text-[var(--color-ink)]">추천 이유 </span>
                        {product.reason || '가성비 조건에 맞는 추천 제품이에요.'}
                    </p>
                </div>
            )}

            <div data-export-ignore="true" className="mt-2.5 flex gap-2">
                {onToggleCompare && (
                    <button
                        type="button"
                        onClick={onToggleCompare}
                        className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg py-1.5 text-[11.5px] font-medium transition-colors ${
                            isInCompare
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                        }`}>
                        <span aria-hidden>{isInCompare ? '✓' : '+'}</span>
                        {isInCompare ? `비교함에\u00A0담김` : `비교함\u00A0담기`}
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleShare}
                    disabled={isExporting}
                    className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--color-border)] py-1.5 text-[11.5px] font-medium text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50">
                    <span aria-hidden>⤓</span>
                    {isExporting ? '저장 중…' : `이미지\u00A0저장`}
                </button>
            </div>

            <a
                href={product.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] py-2 text-[12.5px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors">
                구매하러 가기
                <ArrowRightIcon />
            </a>
        </div>

        {/* 배치·가격·예산 막대그래프와 추천 이유는 카드 안에 상시 노출하지 않고,
            "상세보기"를 눌렀을 때만 아래에서 올라오는 바텀시트로 보여줘요. */}
        {compact && showDetail && (
            <div
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 sm:items-center sm:px-4"
                onClick={() => setShowDetail(false)}>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="animate-fade-up w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
                    <div className="flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                            {product.brand} {product.name}
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowDetail(false)}
                            aria-label="닫기"
                            className="text-[18px] leading-none text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors">
                            ✕
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-1.5 rounded-lg bg-[var(--color-primary-soft)]/60 px-3 py-2">
                        <span className="flex items-center gap-1.5">
                            <IngredientTag ingredientId={ingredient.id} size={18} />
                            <span className="text-[11.5px] font-semibold text-[var(--color-ink)]">{ingredient.name}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[12.5px] font-semibold text-[var(--color-accent-text)]">
                            <SparkleIcon />
                            가성비 {product.finalScore}점
                        </span>
                    </div>

                    <div className="mt-3 space-y-2">
                        <ScoreBar
                            label={`핵심성분 배치 (${product.actualPosition}번째)`}
                            value={product.placementScore}
                            color="var(--color-primary)"
                        />
                        <ScoreBar label="ml당 가격" value={product.priceScore} color="var(--color-accent-deep)" delay={50} />
                        <ScoreBar label="예산 여유" value={product.budgetScore} color="#c9a86a" delay={100} />
                    </div>

                    <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-ink-soft)]">
                        <span className="font-medium text-[var(--color-ink)]">추천 이유 </span>
                        {product.reason || '가성비 조건에 맞는 추천 제품이에요.'}
                    </p>
                </div>
            </div>
        )}
        </>
    );
}

function SparkleIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
            <path d="M12 2.5c.9 4 2.2 6.3 4.5 7.5-2.3 1.2-3.6 3.5-4.5 7.5-.9-4-2.2-6.3-4.5-7.5 2.3-1.2 3.6-3.5 4.5-7.5Z" />
        </svg>
    );
}

function ChevronDownIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="shrink-0">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
