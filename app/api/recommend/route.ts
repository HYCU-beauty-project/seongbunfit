import { NextRequest, NextResponse } from 'next/server';
import { getIngredient } from '@/lib/ingredients';
import { findBudget } from '@/lib/budgets';
import { getTop3 } from '@/lib/scoring/calculator';
import { generateReason } from '@/lib/gemini/reasoning';
import { mockLatency } from '@/lib/mockLatency';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

/**
 * POST /api/recommend — 성분+예산을 받아 가성비 TOP3 제품을 계산해서 돌려줘요.
 *
 * 지금은 lib/products.ts의 더미 데이터로 계산한 결과를 Mock API처럼 돌려줘요.
 * 응답 shape({ingredient, budget, results: ScoredProduct[]})는 실제 Supabase 연동
 * 후에도 그대로 유지할 수 있게 설계했어요 — 데이터 소스만 lib/products.ts에서
 * Supabase 쿼리로 바뀌고, scoreProducts() 계산 로직과 응답 형태는 안 바뀌어요.
 * 자세한 테이블 구조는 lib/supabase/schema.sql 참고하세요.
 */
export async function POST(req: NextRequest) {
    try {
        if (isRateLimited(getClientIp(req))) {
            return NextResponse.json(
                { error: '요청이 너무 잦아요. 잠시 후 다시 시도해 주세요.' },
                { status: 429 },
            );
        }

        await mockLatency();
        // 본문이 JSON이 아니면 500이 아니라 400으로 응답해요.
        const body = await req.json().catch(() => null);
        const ingredientId = typeof body?.ingredientId === 'string' ? body.ingredientId : '';
        const budgetId = typeof body?.budgetId === 'string' ? body.budgetId : '';

        const ingredient = getIngredient(ingredientId);
        if (!ingredient) {
            return NextResponse.json({ error: '존재하지 않는 성분이에요.' }, { status: 400 });
        }
        // 미지의 budgetId를 조용히 기본 예산으로 바꾸면 틀린 결과가 200으로 나가요.
        const budget = findBudget(budgetId);
        if (!budget) {
            return NextResponse.json({ error: '존재하지 않는 예산 범위예요.' }, { status: 400 });
        }

        // TODO(Supabase 연동 시): getTop3는 현재 lib/products.ts 더미 데이터를 사용합니다.
        // Supabase 연동 후에는 product_ingredients 테이블에서 candidates를 조회해
        // scoreProducts(candidates, ingredient, budget)를 그대로 재사용하면 됩니다.
        const top3 = await getTop3(ingredient, budget);

        // 점수 계산은 이미 끝난 값을 그대로 두고, "설명 문장"만 AI에게 맡겨요.
        // AI가 숫자를 직접 계산하게 하면 환각 위험이 있어서, 계산된 값을 근거로 문장만
        // 자연스럽게 다듬는 역할로 한정했어요. 키가 없거나 실패하면 템플릿으로 조용히 폴백돼요.
        const results = await Promise.all(
            top3.map(async (product) => ({
                ...product,
                reason: await generateReason(product, ingredient),
            })),
        );

        return NextResponse.json({ ingredient, budget, results });
    } catch (error) {
        console.error('[api/recommend] error:', error);
        return NextResponse.json({ error: '추천 계산 중 오류가 발생했어요.' }, { status: 500 });
    }
}
