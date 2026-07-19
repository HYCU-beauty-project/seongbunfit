import type { BudgetOption, Ingredient, Product, ScoredProduct } from '@/types';
import { getProductsForIngredient } from '@/lib/products';

/**
 * 최종 점수 = (핵심성분 배치점수 × 0.60) + (ml당 가격점수 × 0.30) + (예산점수 × 0.10)
 * 팀 기획서(성분핏.pdf) 기준 가중치이며, 랜딩페이지 초기 시안에 있던 50/30/20 문구와
 * 다르길래 확인 결과 60/30/10으로 최종 확정되었습니다 (2026.07.12).
 */
export const SCORE_WEIGHTS = {
    placement: 0.6,
    price: 0.3,
    budget: 0.1,
};

// 배치 점수: 실제위치 / 기준위치 배수에 따른 구간 점수
// x1.0 이하 -> 100, x3.0 -> 20, x3.0 초과 -> 0 (구간 보간)
export function placementScore(actualPosition: number, refPosition: number): number {
    const multiplier = actualPosition / refPosition;
    if (multiplier <= 1.0) return 100;
    if (multiplier <= 1.5) return 80;
    if (multiplier <= 2.0) return 60;
    if (multiplier <= 2.5) return 40;
    if (multiplier <= 3.0) return 20;
    return 0;
}

// ml당 가격 점수: 후보군 내 최저 ml당가 대비 상대 점수
export function priceScoreOf(pricePerMl: number, lowestPricePerMl: number): number {
    if (pricePerMl <= 0) return 0;
    return Math.min(100, Math.round((lowestPricePerMl / pricePerMl) * 100));
}

// 예산 점수: 예산 대비 여유율. 예산 초과 제품은 후보에서 제외(별도 처리).
export function budgetScoreOf(price: number, budget: BudgetOption): number {
    if (budget.max === Infinity) return 100; // 상한 없음 -> 항상 여유
    if (price > budget.max) return 0; // 방어적 처리 (실제로는 사전 필터링됨)
    const surplusRatio = (budget.max - price) / budget.max;
    return Math.round(Math.max(0, Math.min(1, surplusRatio)) * 100);
}

export function scoreProducts(candidates: Product[], ingredient: Ingredient, budget: BudgetOption): ScoredProduct[] {
    // 예산 초과 제품은 완전히 제외
    const withinBudget = candidates.filter((p) => p.price <= budget.max && p.price >= budget.min);
    if (withinBudget.length === 0) return [];

    const withPricePerMl = withinBudget.map((p) => ({
        ...p,
        pricePerMl: p.price / p.volumeMl,
    }));
    const lowestPricePerMl = Math.min(...withPricePerMl.map((p) => p.pricePerMl));

    const scored: ScoredProduct[] = withPricePerMl.map((p) => {
        const placement = placementScore(p.actualPosition, ingredient.refPosition);
        const price = priceScoreOf(p.pricePerMl, lowestPricePerMl);
        const budgetSc = budgetScoreOf(p.price, budget);
        const finalScore =
            placement * SCORE_WEIGHTS.placement + price * SCORE_WEIGHTS.price + budgetSc * SCORE_WEIGHTS.budget;

        return {
            ...p,
            placementScore: placement,
            priceScore: price,
            budgetScore: budgetSc,
            finalScore: Math.round(finalScore * 1000) / 1000,
        };
    });

    return scored.sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * ⚠️ getProductsForIngredient가 이제 Supabase를 조회하는 비동기 함수라
 * 이 함수도 async로 바뀌었습니다. 호출하는 쪽(API 라우트 등)에서
 * 반드시 await getTop3(...) 형태로 사용해주세요.
 */
export async function getTop3(ingredient: Ingredient, budget: BudgetOption): Promise<ScoredProduct[]> {
    const candidates = await getProductsForIngredient(ingredient.id);
    return scoreProducts(candidates, ingredient, budget).slice(0, 3);
}

export function reasonFor(product: ScoredProduct, ingredient: Ingredient): string {
    const parts: string[] = [];
    if (product.placementScore >= 80) {
        parts.push(`${ingredient.name}이 전성분표 상위에 배치되어 있으며`);
    } else if (product.placementScore >= 40) {
        parts.push(`${ingredient.name}이 준수한 위치에 배치되어 있으며`);
    } else {
        parts.push(`${ingredient.name}이 포함되어 있으며`);
    }
    if (product.priceScore >= 80) {
        parts.push('동일 후보 제품 중 ml당 가격이 가장 낮은 편이라 가격 대비 성분 효율이 우수합니다.');
    } else if (product.priceScore >= 50) {
        parts.push('ml당 가격도 준수한 수준이라 가성비가 좋습니다.');
    } else {
        parts.push('예산 범위 안에서 무난한 선택지입니다.');
    }
    return parts.join(' ');
}
