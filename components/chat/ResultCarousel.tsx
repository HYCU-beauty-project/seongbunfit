'use client';

import { useRef, useState } from 'react';
import type { Ingredient, ScoredProduct } from '@/types';
import ResultCard from '@/components/product/ResultCard';

interface Props {
    results: ScoredProduct[];
    ingredient: Ingredient;
    compareIds: string[];
    onToggleCompare: (product: ScoredProduct) => void;
    favoriteIds?: string[];
    onToggleFavorite?: (product: ScoredProduct) => void;
    // true면(모바일) 카드가 요약만 보여주고 상세는 바텀시트로 펼쳐요.
    compact?: boolean;
    // 한 화면에 보여줄 카드 개수예요. 모바일(좁은 채팅창)에선 1을 줘서 카드 하나가
    // 풀와이드로 슬라이드되게 하고, 데스크톱(넓은 채팅창)에선 2를 줘서 "2개는 바로
    // 보이고, 슬라이드하면 3번째가 나오는" 느낌을 줘요.
    cardsPerView?: 1 | 2;
}

export default function ResultCarousel({
    results,
    ingredient,
    compareIds,
    onToggleCompare,
    favoriteIds = [],
    onToggleFavorite,
    compact = false,
    cardsPerView = 1,
}: Props) {
    const trackRef = useRef<HTMLDivElement>(null);
    // ⚠️ 예전에는 "카드 너비 × 인덱스"로 스크롤 위치를 계산했는데, 렌더링 타이밍에
    // 따라 clientWidth가 아주 살짝 어긋나서 마지막 카드 오른쪽 테두리가 미세하게
    // 잘려 보이는 문제가 있었어요. 그래서 각 카드 DOM의 실제 위치를 직접 측정해서
    // 스크롤하는 방식으로 바꿨어요 — 계산에 의존하지 않으니 오차가 안 생겨요.
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    // 카드 개수가 한 화면에 다 들어가면(cardsPerView 이하) 화살표/점 없이 그냥
    // 나란히 보여주고, 그보다 많을 때만 캐러셀 내비게이션을 보여줘요.
    const needsScroll = results.length > cardsPerView;
    const maxIndex = Math.max(0, results.length - cardsPerView);

    function scrollToIndex(idx: number) {
        const track = trackRef.current;
        const clamped = Math.max(0, Math.min(maxIndex, idx));
        const card = cardRefs.current[clamped];
        if (!track || !card) return;

        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const targetLeft = track.scrollLeft + (cardRect.left - trackRect.left);

        track.scrollTo({ left: targetLeft, behavior: 'smooth' });
        setActiveIndex(clamped);
    }

    function handleScroll() {
        const track = trackRef.current;
        if (!track) return;

        // 지금 스크롤 위치에서 트랙의 왼쪽 경계에 가장 가까운 카드를 찾아서
        // 그 카드를 "현재 보고 있는 카드"로 표시해요(점 인디케이터용).
        const trackRect = track.getBoundingClientRect();
        let closestIdx = 0;
        let closestDist = Infinity;
        cardRefs.current.forEach((card, idx) => {
            if (!card) return;
            const dist = Math.abs(card.getBoundingClientRect().left - trackRect.left);
            if (dist < closestDist) {
                closestDist = dist;
                closestIdx = idx;
            }
        });
        setActiveIndex(Math.max(0, Math.min(maxIndex, closestIdx)));
    }

    const cardBasisClass = cardsPerView === 2 ? 'basis-[calc(50%-5px)]' : 'basis-full';

    return (
        <div>
            {/* 화살표를 카드 위에 겹쳐 올리지 않고, 별도 좌우 칸으로 분리해서
          카드 안쪽 버튼(비교함/구매하러 가기)과 안 붙어 보이게 했어요. */}
            <div className="flex items-center gap-2">
                {needsScroll && (
                    <button
                        type="button"
                        onClick={() => scrollToIndex(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        aria-label="이전 결과"
                        className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--color-ink-soft)] shadow-md border border-[var(--color-border)] disabled:invisible transition-opacity">
                        <ChevronIcon direction="left" />
                    </button>
                )}

                <div
                    ref={trackRef}
                    onScroll={handleScroll}
                    className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth">
                    {results.map((product, idx) => (
                        <div
                            key={product.id}
                            ref={(el) => {
                                cardRefs.current[idx] = el;
                            }}
                            className={`min-w-0 shrink-0 snap-start ${cardBasisClass}`}>
                            <ResultCard
                                rank={idx + 1}
                                product={product}
                                ingredient={ingredient}
                                isInCompare={compareIds.includes(product.id)}
                                onToggleCompare={() => onToggleCompare(product)}
                                isFavorite={favoriteIds.includes(product.id)}
                                onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(product) : undefined}
                                compact={compact}
                            />
                        </div>
                    ))}
                    {/* 마지막 카드가 스크롤 가능 영역의 오른쪽 경계에 정확히 맞닿으면,
                        둥근 모서리(rounded-xl)가 서브픽셀 단위로 잘려서 흐릿하게 보이는
                        경우가 있어요. 스크롤 끝에 약간의 여백을 둬서 그 경계에서 살짝
                        떨어지게 했어요. */}
                    <div className="w-2 shrink-0" aria-hidden />
                </div>

                {needsScroll && (
                    <button
                        type="button"
                        onClick={() => scrollToIndex(activeIndex + 1)}
                        disabled={activeIndex >= maxIndex}
                        aria-label="다음 결과"
                        className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--color-ink-soft)] shadow-md border border-[var(--color-border)] disabled:invisible transition-opacity">
                        <ChevronIcon direction="right" />
                    </button>
                )}
            </div>

            {needsScroll && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                    {Array.from({ length: maxIndex + 1 }, (_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => scrollToIndex(idx)}
                            aria-label={`${idx + 1}번째 위치로 이동`}
                            className={`h-1.5 rounded-full transition-all ${
                                idx === activeIndex ? 'w-4 bg-[var(--color-primary)]' : 'w-1.5 bg-[var(--color-border)]'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
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
            aria-hidden>
            {direction === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
        </svg>
    );
}
