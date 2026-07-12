import type { BudgetOption } from "@/types";

export const budgetOptions: BudgetOption[] = [
  { id: "under10", label: "1만원 이하", min: 0, max: 10000 },
  { id: "10to20", label: "1~2만원", min: 10000, max: 20000 },
  { id: "20to30", label: "2~3만원", min: 20000, max: 30000 },
  { id: "over30", label: "3만원 이상", min: 30000, max: Infinity },
];

export function getBudget(id: string): BudgetOption {
  return budgetOptions.find((b) => b.id === id) ?? budgetOptions[1];
}

// 자유 텍스트 예산 입력 파싱 (예: "15000원", "1.5만원", "2만원대")
export function parseBudgetText(input: string): BudgetOption | null {
  const digits = input.replace(/[,\s]/g, "");
  const manwonMatch = digits.match(/(\d+(?:\.\d+)?)\s*만\s*원?/);
  const wonMatch = digits.match(/(\d+)\s*원/);

  let amount: number | null = null;
  if (manwonMatch) {
    amount = parseFloat(manwonMatch[1]) * 10000;
  } else if (wonMatch) {
    amount = parseInt(wonMatch[1], 10);
  } else if (/^\d+$/.test(digits)) {
    amount = parseInt(digits, 10);
  }

  if (amount === null || Number.isNaN(amount)) return null;

  const matched = budgetOptions.find((b) => amount! > b.min && amount! <= b.max);
  return matched ?? budgetOptions[budgetOptions.length - 1];
}
