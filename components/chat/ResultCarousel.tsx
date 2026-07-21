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
    // true면(모바일) 카드는 요약만, 상세는 바텀시트로 펼침
    compact?: boolean;
    // 한 화면에 보여줄 카드 개수. 모바일(좁은 채팅창)은 1 줘서 카드 하나
    // 풀와이드 슬라이드, 데스크톱(넓은 채팅창)은 2 줘서 2개 바로 보이고
    // 슬라이드하면 3번째 나오는 느낌
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
    // 예전엔 "카드 너비 × 인덱스"로 스크롤 위치 계산했는데 렌더링 타이밍 따라
    // clientWidth가 살짝 어긋나서 마지막 카드 오른쪽 테두리 미세하게 잘리는
    // 버그 있었음. 그래서 각 카드 DOM 실제 위치 직접 측정해서 스크롤하게 바꿈.
    // 계산에 의존 안 하니 오차 안 생김
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    // 카드가 한 화면에 다 들어가면(cardsPerView 이하) 화살표/점 없이 나란히,
    // 그보다 많을 때만 캐러셀 내비게이션 표시
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

        // 지금 스크롤 위치에서 트랙 왼쪽 경계에 가장 가까운 카드 찾아서
        // "현재 보고 있는 카드"로 표시 (점 인디케이터용)
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

    // cardsPerView 비율 폭을 Tailwind basis-*(flex-basis: %)로 했었는데,
    // overflow-x:auto 가로 스크롤 flex 컨테이너 안에서 사파리(iOS)가 퍼센트
    // flex-basis를 컨테이너 폭이 아니라 내용물 크기 기준으로 잘못 계산하는 버그 있음.
    // 크롬 데스크톱 시뮬레이터에선 재현 안 돼서 멀쩡해 보였는데 실제 아이폰에선
    // 카드가 훨씬 좁게 찌그러져서 세로로 길어짐. flex-basis 대신 width(%) 직접
    // 지정하면 이 버그 피할 수 있음
    const cardWidthClass = cardsPerView === 2 ? 'w-[calc(50%-5px)]' : 'w-full';

    return (
        <div>
            {/* 화살표를 좌우 전용 칸으로 뒀더니 그 칸 폭(안 보일 때도 자리 차지)만큼
          카드가 좁아 보였음. 트랙 위에 살짝 겹치는 오버레이로 바꿔서 그 폭을
          카드에 돌려줌. 화살표는 카드 중간 높이(점수 요약 박스 근처)에 떠서
          아래쪽 버튼들과 안 겹침 */}
            <div className="relative">
                <div
                    ref={trackRef}
                    onScroll={handleScroll}
                    className="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth">
                    {results.map((product, idx) => (
                        <div
                            key={product.id}
                            ref={(el) => {
                                cardRefs.current[idx] = el;
                            }}
                            className={`min-w-0 shrink-0 snap-start ${cardWidthClass}`}>
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
                    {/* 마지막 카드가 스크롤 영역 오른쪽 경계에 딱 맞닿으면 둥근
                        모서리(rounded-xl)가 서브픽셀 단위로 잘려 흐릿해 보일 때 있음.
                        스크롤 끝에 여백 살짝 둬서 경계에서 떨어지게 함 */}
                    <div className="w-2 shrink-0" aria-hidden />
                </div>

                {needsScroll && (
                    <button
                        type="button"
                        onClick={() => scrollToIndex(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        aria-label="이전 결과"
                        className="absolute left-1 top-[38%] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink-soft)] shadow-md border border-[var(--color-border)] disabled:invisible transition-opacity">
                        <ChevronIcon direction="left" />
                    </button>
                )}

                {needsScroll && (
                    <button
                        type="button"
                        onClick={() => scrollToIndex(activeIndex + 1)}
                        disabled={activeIndex >= maxIndex}
                        aria-label="다음 결과"
                        className="absolute right-1 top-[38%] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink-soft)] shadow-md border border-[var(--color-border)] disabled:invisible transition-opacity">
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
