import { NextRequest, NextResponse } from "next/server";
import { getIngredient } from "@/lib/ingredients";
import { getBudget } from "@/lib/budgets";
import { getTop3, reasonFor } from "@/lib/scoring/calculator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ingredientId = typeof body?.ingredientId === "string" ? body.ingredientId : "";
    const budgetId = typeof body?.budgetId === "string" ? body.budgetId : "";

    const ingredient = getIngredient(ingredientId);
    if (!ingredient) {
      return NextResponse.json({ error: "존재하지 않는 성분이에요." }, { status: 400 });
    }
    const budget = getBudget(budgetId);

    // TODO(Supabase 연동 시): getTop3는 현재 lib/products.ts 더미 데이터를 사용합니다.
    // Supabase 연동 후에는 product_ingredients 테이블에서 candidates를 조회해
    // scoreProducts(candidates, ingredient, budget)를 그대로 재사용하면 됩니다.
    const top3 = getTop3(ingredient, budget);

    return NextResponse.json({
      ingredient,
      budget,
      results: top3.map((product) => ({
        ...product,
        reason: reasonFor(product, ingredient),
      })),
    });
  } catch (error) {
    console.error("[api/recommend] error:", error);
    return NextResponse.json({ error: "추천 계산 중 오류가 발생했어요." }, { status: 500 });
  }
}
