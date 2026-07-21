import { NextRequest, NextResponse } from 'next/server';
import { getIngredient } from '@/lib/ingredients';
import { findBudget } from '@/lib/budgets';
import { getTop3 } from '@/lib/scoring/calculator';
import { generateReason } from '@/lib/gemini/reasoning';
import { mockLatency } from '@/lib/mockLatency';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

/**
 * POST /api/recommend: 성분+예산 받아서 가성비 TOP3 제품 계산해서 응답
 *
 * 지금은 lib/products.ts 더미 데이터로 계산한 Mock API임.
 * 응답 shape({ingredient, budget, results: ScoredProduct[]})는 Supabase 연동 후에도
 * 유지 가능하게 설계함. 데이터 소스만 Supabase 쿼리로 바뀌고
 * scoreProducts() 계산 로직과 응답 형태는 그대로.
 * 테이블 구조는 lib/supabase/schema.sql 참고
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
        // 본문이 JSON 아니면 500 말고 400으로
        const body = await req.json().catch(() => null);
        const ingredientId = typeof body?.ingredientId === 'string' ? body.ingredientId : '';
        const budgetId = typeof body?.budgetId === 'string' ? body.budgetId : '';

        const ingredient = getIngredient(ingredientId);
        if (!ingredient) {
            return NextResponse.json({ error: '존재하지 않는 성분이에요.' }, { status: 400 });
        }
        // 모르는 budgetId를 조용히 기본 예산으로 바꾸면 틀린 결과가 200으로 나감
        const budget = findBudget(budgetId);
        if (!budget) {
            return NextResponse.json({ error: '존재하지 않는 예산 범위예요.' }, { status: 400 });
        }

        // TODO(Supabase 연동 시): getTop3는 지금 lib/products.ts 더미 데이터 씀.
        // 연동 후엔 product_ingredients 테이블에서 candidates 조회해서
        // scoreProducts(candidates, ingredient, budget) 그대로 재사용하면 됨
        const top3 = await getTop3(ingredient, budget);

        // 점수 계산 값은 그대로 두고 "설명 문장"만 AI한테 맡김.
        // AI가 숫자 직접 계산하면 환각 위험 있어서 문장 다듬기 역할로만 한정.
        // 키 없거나 실패하면 템플릿으로 조용히 폴백됨
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
