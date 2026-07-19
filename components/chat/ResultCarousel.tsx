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
    // 한 화면에 보여줄 카드 개수예요. 모바일(좁은 채팅창)에선 1을 줘서 카드 하나가
    // 풀와이드로 슬라이드되게 하고, 데스크톱(넓은 채팅창)에선 2를 줘서 "2개는 바로
    // 보이고, 슬라이드하면 3번째가 나오는" 느낌을 줘요.
    cardsPerView?: 1 | 2;
}

const GAP_PX = 10; // gap-2.5 = 10px

export default function ResultCarousel({
    results,
    ingredient,
    compareIds,
    onToggleCompare,
    favoriteIds = [],
    onToggleFavorite,
    cardsPerView = 1,
}: Props) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // 카드 개수가 한 화면에 다 들어가면(cardsPerView 이하) 화살표/점 없이 그냥
    // 나란히 보여주고, 그보다 많을 때만 캐러셀 내비게이션을 보여줘요.
    const needsScroll = results.length > cardsPerView;
    const maxIndex = Math.max(0, results.length - cardsPerView);

    function getStepWidth() {
        const track = trackRef.current;
        if (!track) return 0;
        // 카드 1개 + gap 만큼을 한 스텝으로 스크롤해요. 그래야 2개 보기 모드에서도
        // 한 번에 카드 1개씩만 밀려나면서 다음 카드가 자연스럽게 "슬라이드"돼요.
        return (track.clientWidth - GAP_PX * (cardsPerView - 1)) / cardsPerView + GAP_PX;
    }

    function scrollToIndex(idx: number) {
        const track = trackRef.current;
        if (!track) return;
        const clamped = Math.max(0, Math.min(maxIndex, idx));
        track.scrollTo({ left: clamped * getStepWidth(), behavior: 'smooth' });
        setActiveIndex(clamped);
    }

    function handleScroll() {
        const track = trackRef.current;
        const stepWidth = getStepWidth();
        if (!track || stepWidth === 0) return;
        const idx = Math.round(track.scrollLeft / stepWidth);
        setActiveIndex(Math.max(0, Math.min(maxIndex, idx)));
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
                        className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--color-ink-soft)] shadow-md border border-[var(--color-border)] disabled:opacity-30 transition-opacity">
                        <ChevronIcon direction="left" />
                    </button>
                )}

                <div
                    ref={trackRef}
                    onScroll={handleScroll}
                    className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth">
                    {results.map((product, idx) => (
                        <div key={product.id} className={`min-w-0 shrink-0 snap-start ${cardBasisClass}`}>
                            <ResultCard
                                rank={idx + 1}
                                product={product}
                                ingredient={ingredient}
                                isInCompare={compareIds.includes(product.id)}
                                onToggleCompare={() => onToggleCompare(product)}
                                isFavorite={favoriteIds.includes(product.id)}
                                onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(product) : undefined}
                            />
                        </div>
                    ))}
                </div>

                {needsScroll && (
                    <button
                        type="button"
                        onClick={() => scrollToIndex(activeIndex + 1)}
                        disabled={activeIndex >= maxIndex}
                        aria-label="다음 결과"
                        className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--color-ink-soft)] shadow-md border border-[var(--color-border)] disabled:opacity-30 transition-opacity">
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
