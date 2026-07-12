import { NextRequest, NextResponse } from "next/server";
import { analyzeSkinConcern } from "@/lib/gemini/analyzer";
import { getCategory } from "@/lib/ingredients";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text : "";

    if (!text.trim()) {
      return NextResponse.json({ error: "text가 비어있어요." }, { status: 400 });
    }

    const { categoryKey, usedAi } = await analyzeSkinConcern(text);

    if (!categoryKey) {
      return NextResponse.json({ categoryKey: null, usedAi, unsupported: true });
    }

    const category = getCategory(categoryKey);

    return NextResponse.json({
      categoryKey: category.key,
      label: category.label,
      intro: category.intro,
      ingredients: category.ingredients,
      usedAi,
    });
  } catch (error) {
    console.error("[api/chat] error:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했어요." }, { status: 500 });
  }
}
