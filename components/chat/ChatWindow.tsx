"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { categories, getCategory, getIngredientInCategory } from "@/lib/ingredients";
import { budgetOptions, getBudget, parseBudgetText } from "@/lib/budgets";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type {
  ChatMessage,
  SelectedConditions,
  ScoredProduct,
  CategoryKey,
  AiResultMessage,
  CompareItem,
} from "@/types";
import IngredientCard from "./IngredientCard";
import SidePanel from "./SidePanel";
import ChatInput from "./ChatInput";
import ScoreExplainer from "./ScoreExplainer";
import CompareTray from "./CompareTray";
import CompareModal from "./CompareModal";
import ResultCard from "@/components/product/ResultCard";

const MAX_COMPARE_ITEMS = 4;

const WELCOME_ID = "welcome";

const initialMessages: ChatMessage[] = [
  {
    id: WELCOME_ID,
    role: "ai",
    kind: "intro",
    text: "안녕하세요! 피부 고민을 편하게 말씀해 주세요.",
    createdAt: Date.now(),
  },
];

const initialConditions: SelectedConditions = {
  categoryKey: null,
  ingredientId: null,
  budgetId: null,
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChatWindow() {
  const [messages, setMessages, hydrated] = useLocalStorage<ChatMessage[]>(
    "ingredientfit:messages",
    initialMessages
  );
  const [conditions, setConditions] = useLocalStorage<SelectedConditions>(
    "ingredientfit:conditions",
    initialConditions
  );
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);
  const [showCalcTip, setShowCalcTip] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [previewIngredientId, setPreviewIngredientId] = useState<string | null>(null);
  const [compareItems, setCompareItems, compareHydrated] = useLocalStorage<CompareItem[]>(
    "ingredientfit:compare",
    []
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const lastMessageId = messages[messages.length - 1]?.id;

  const step: "concern" | "ingredient" | "budget" | "result" = !conditions.categoryKey
    ? "concern"
    : !conditions.ingredientId
    ? "ingredient"
    : !conditions.budgetId
    ? "budget"
    : "result";

  function pushUser(text: string) {
    setMessages((prev) => [...prev, { id: makeId(), role: "user", text, createdAt: Date.now() }]);
  }

  function pushAiText(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: "ai", kind: "text", text, createdAt: Date.now() },
    ]);
  }

  async function handleConcernInput(text: string) {
    pushUser(text);
    setDraft("");
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!data.categoryKey) {
        // 5개 고민 카테고리 중 어디에도 해당하지 않는 질문 — 억지로 카테고리를 고르지 않고
        // 다시 물어봐요. 새 intro 메시지를 넣으면 카테고리 칩도 다시 떠요.
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "ai",
            kind: "intro",
            text: "죄송해요, 그 부분은 제가 도와드리기 어려워요. 피부 고민을 알려주시면 성분을 추천해드릴게요!",
            createdAt: Date.now(),
          },
        ]);
        return;
      }

      const categoryKey = data.categoryKey as CategoryKey;
      const usedAi = Boolean(data.usedAi);

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "ai", kind: "ingredients", categoryKey, usedAi, createdAt: Date.now() },
      ]);
      setConditions({ categoryKey, ingredientId: null, budgetId: null });
    } catch {
      pushAiText("성분 분석 중 문제가 생겼어요. 다시 한 번 말씀해 주시겠어요?");
    } finally {
      setIsTyping(false);
    }
  }

  function handleIngredientSelect(categoryKey: CategoryKey, ingredientId: string, ingredientName: string) {
    pushUser(`${ingredientName}로 찾아줘요!`);
    setConditions((prev) => ({ ...prev, categoryKey, ingredientId }));
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "ai",
          kind: "budget-prompt",
          ingredientName,
          createdAt: Date.now(),
        },
      ]);
      setIsTyping(false);
    }, 450);
  }

  async function handleBudgetSelect(budgetId: string) {
    const budget = getBudget(budgetId);
    pushUser(budget.label);
    setIsTyping(true);

    const ingredientId = conditions.ingredientId!;
    const categoryKey = conditions.categoryKey!;

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientId, budgetId }),
      });
      const data = await res.json();
      const results: ScoredProduct[] = data.results ?? [];

      setConditions((prev) => ({ ...prev, budgetId }));
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "ai",
          kind: "result",
          categoryKey,
          ingredientId,
          budgetId,
          results,
          createdAt: Date.now(),
        },
      ]);
    } catch {
      pushAiText("추천 계산 중 문제가 생겼어요. 예산을 다시 선택해 주시겠어요?");
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit() {
    const text = draft.trim();
    if (!text || isTyping) return;

    if (step === "concern") {
      handleConcernInput(text);
      return;
    }

    if (step === "ingredient") {
      const category = getCategory(conditions.categoryKey!);
      const matched = category.ingredients.find((i) => text.includes(i.name));
      if (matched) {
        setDraft("");
        handleIngredientSelect(category.key, matched.id, matched.name);
      } else {
        pushUser(text);
        setDraft("");
        pushAiText("아래 카드 중에서 관심 있는 성분을 선택해주세요 🙂");
      }
      return;
    }

    if (step === "budget") {
      const parsed = parseBudgetText(text);
      setDraft("");
      if (parsed) {
        handleBudgetSelect(parsed.id);
      } else {
        pushUser(text);
        pushAiText("예산 범위를 버튼으로 선택하거나 '1만원', '2만원대'처럼 입력해 주세요.");
      }
      return;
    }

    // step === 'result' -> start a new round in the same conversation
    setConditions(initialConditions);
    handleConcernInput(text);
  }

  function handleRestart() {
    setConditions(initialConditions);
    setMessages(initialMessages);
  }

  function handleEditCategory() {
    setConditions(initialConditions);
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: "ai",
        kind: "intro",
        text: "어떤 고민으로 다시 찾아볼까요?",
        createdAt: Date.now(),
      },
    ]);
  }

  function handleEditIngredient() {
    if (!conditions.categoryKey) return;
    const categoryKey = conditions.categoryKey;
    setConditions((prev) => ({ ...prev, ingredientId: null, budgetId: null }));
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: "ai", kind: "ingredients", categoryKey, createdAt: Date.now() },
    ]);
  }

  function handleEditBudget() {
    if (!conditions.categoryKey || !conditions.ingredientId) return;
    const ing = getIngredientInCategory(conditions.categoryKey, conditions.ingredientId);
    setConditions((prev) => ({ ...prev, budgetId: null }));
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: "ai",
        kind: "budget-prompt",
        ingredientName: ing?.name ?? "선택한 성분",
        createdAt: Date.now(),
      },
    ]);
  }

  function handleToggleCompare(product: ScoredProduct, ingredientName: string, categoryLabel: string) {
    setCompareItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      if (prev.length >= MAX_COMPARE_ITEMS) return prev;
      return [...prev, { id: product.id, product, ingredientName, categoryLabel, addedAt: Date.now() }];
    });
    if (
      !compareItems.some((item) => item.id === product.id) &&
      compareItems.length >= MAX_COMPARE_ITEMS
    ) {
      pushAiText(`비교함은 최대 ${MAX_COMPARE_ITEMS}개까지 담을 수 있어요. 하나를 빼고 다시 담아주세요.`);
    }
  }

  function handleRemoveFromCompare(id: string) {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleClearCompare() {
    setCompareItems([]);
  }

  const category = conditions.categoryKey ? getCategory(conditions.categoryKey) : null;
  const ingredient =
    conditions.categoryKey && conditions.ingredientId
      ? getIngredientInCategory(conditions.categoryKey, conditions.ingredientId) ?? null
      : null;
  const budget = conditions.budgetId ? getBudget(conditions.budgetId) : null;

  // 우측 패널에 보여줄 성분: 고르는 중이면 마우스오버(또는 포커스) 중인 성분,
  // 없거나(또는 카테고리가 바뀌어 더 이상 유효하지 않으면) 추천 성분(또는 첫번째)을 기본값으로.
  // 이미 골랐다면 확정된 성분을 계속 보여줌.
  const previewIngredient =
    step === "ingredient" && category
      ? category.ingredients.find((i) => i.id === previewIngredientId) ??
        category.ingredients.find((i) => i.recommended) ??
        category.ingredients[0] ??
        null
      : ingredient;

  const latestResultMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === "ai" && m.kind === "result") return m as AiResultMessage;
    }
    return undefined;
  }, [messages]);

  const showSidePanel = step !== "concern";

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[var(--color-primary-soft)] px-4 py-10">
      <div className="mx-auto animate-fade-up grid max-w-4xl gap-4 md:grid-cols-[1fr_260px]">
        <div className="flex h-[640px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <span className="text-[12.5px] font-semibold text-[var(--color-ink)]">
              성분핏 AI 상담
            </span>
          </div>

          <div ref={scrollRef} className="chat-scroll flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {!hydrated ? null : (
              <>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    showChips={message.id === lastMessageId && step === "concern"}
                    previewIngredientId={previewIngredientId}
                    onIngredientPreview={setPreviewIngredientId}
                    compareIds={compareItems.map((item) => item.id)}
                    onToggleCompare={handleToggleCompare}
                    onCategoryChip={(key) => {
                      const c = getCategory(key);
                      handleConcernInput(`${c.label} 고민이에요`);
                    }}
                    onIngredientSelect={handleIngredientSelect}
                    onBudgetChip={handleBudgetSelect}
                  />
                ))}
                {isTyping && <TypingBubble />}
              </>
            )}
          </div>

          <ChatInput
            value={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            disabled={isTyping}
            placeholder={
              step === "concern"
                ? "피부 고민을 입력해주세요."
                : step === "ingredient"
                ? "또는 직접 입력해주세요"
                : step === "budget"
                ? "또는 직접 입력해주세요"
                : "다른 고민도 물어보세요"
            }
          />
        </div>

        <div className="space-y-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowScoreExplainer(true)}
              onMouseEnter={() => setShowCalcTip(true)}
              onMouseLeave={() => setShowCalcTip(false)}
              onFocus={() => setShowCalcTip(true)}
              onBlur={() => setShowCalcTip(false)}
              className="w-full rounded-xl border border-dashed border-[var(--color-primary)]/40 bg-white py-2.5 text-[12px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-colors"
            >
              🧮 가성비 계산법 보기
            </button>
            {showCalcTip && (
              <div className="animate-fade-up absolute left-0 right-0 top-full z-30 mt-2 rounded-lg bg-[var(--color-ink)] px-3 py-2.5 text-[11px] leading-relaxed text-white shadow-lg">
                점수가 어떻게 계산되는지 공식과 실제 숫자를 확인할 수 있어요.
                <span className="absolute -top-1 left-6 h-2 w-2 rotate-45 bg-[var(--color-ink)]" />
              </div>
            )}
          </div>

          {compareHydrated && (
            <CompareTray count={compareItems.length} onOpen={() => setShowCompareModal(true)} />
          )}

          {showSidePanel && (
            <SidePanel
              mode="conditions"
              category={category}
              ingredient={ingredient}
              budget={budget}
              onEditCategory={handleEditCategory}
              onEditIngredient={conditions.ingredientId ? handleEditIngredient : undefined}
              onEditBudget={conditions.budgetId ? handleEditBudget : undefined}
            />
          )}

          {step === "ingredient" && previewIngredient && (
            <SidePanel mode="detail" ingredient={previewIngredient} />
          )}
          {step !== "ingredient" && ingredient && <SidePanel mode="detail" ingredient={ingredient} />}

          {showSidePanel && (
            <button
              type="button"
              onClick={handleRestart}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white py-2.5 text-[12.5px] font-medium text-[var(--color-ink-soft)] hover:bg-gray-50 transition-colors"
            >
              처음부터 다시 시작하기
            </button>
          )}
        </div>
      </div>

      <ScoreExplainer
        open={showScoreExplainer}
        onClose={() => setShowScoreExplainer(false)}
        latestResult={latestResultMessage}
      />

      {compareHydrated && (
        <CompareModal
          open={showCompareModal}
          items={compareItems}
          onClose={() => setShowCompareModal(false)}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
        />
      )}
    </div>
  );
}

function AiAvatar() {
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-[11px] font-semibold"
    >
      AI
    </span>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5 animate-fade-up">
      <AiAvatar />
      <div className="rounded-2xl rounded-tl-sm bg-[var(--color-primary-soft)] px-4 py-3 flex items-center gap-1">
        <span className="dot h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" style={{ animationDelay: "0ms" }} />
        <span className="dot h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" style={{ animationDelay: "150ms" }} />
        <span className="dot h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  showChips,
  previewIngredientId,
  onIngredientPreview,
  compareIds,
  onToggleCompare,
  onCategoryChip,
  onIngredientSelect,
  onBudgetChip,
}: {
  message: ChatMessage;
  showChips: boolean;
  previewIngredientId: string | null;
  onIngredientPreview: (id: string | null) => void;
  compareIds: string[];
  onToggleCompare: (product: ScoredProduct, ingredientName: string, categoryLabel: string) => void;
  onCategoryChip: (categoryKey: CategoryKey) => void;
  onIngredientSelect: (categoryKey: CategoryKey, ingredientId: string, ingredientName: string) => void;
  onBudgetChip: (budgetId: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-[var(--color-primary)] px-4 py-2.5 text-[13px] text-white">
          {message.text}
        </div>
      </div>
    );
  }

  if (message.kind === "text") {
    return (
      <div className="flex items-start gap-2.5 animate-fade-up">
        <AiAvatar />
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[var(--color-primary-soft)] px-4 py-3">
          <p className="text-[13px] text-[var(--color-ink)]">{message.text}</p>
        </div>
      </div>
    );
  }

  if (message.kind === "intro") {
    return (
      <div className="animate-fade-up space-y-3">
        <div className="flex items-start gap-2.5">
          <AiAvatar />
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[var(--color-primary-soft)] px-4 py-3">
            <p className="text-[13.5px] font-medium text-[var(--color-ink)]">{message.text}</p>
            <p className="mt-1 text-[11.5px] text-[var(--color-ink-faint)]">
              예: &ldquo;주름이 고민이에요&rdquo;, &ldquo;트러블이 심해요&rdquo;
            </p>
          </div>
        </div>
        {showChips && (
          <div className="flex flex-wrap gap-2 ml-9">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => onCategoryChip(c.key)}
                className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-[11.5px] text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (message.kind === "ingredients") {
    const category = getCategory(message.categoryKey);
    const previewBelongsHere = category.ingredients.some((i) => i.id === previewIngredientId);
    const activeId = previewBelongsHere
      ? previewIngredientId
      : category.ingredients.find((i) => i.recommended)?.id ?? category.ingredients[0]?.id;
    return (
      <div className="flex items-start gap-2.5 animate-fade-up">
        <AiAvatar />
        <div className="max-w-[85%] space-y-2.5">
          <div className="rounded-2xl rounded-tl-sm bg-[var(--color-primary-soft)] px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-[13.5px] font-medium text-[var(--color-ink)]">{category.intro}</p>
              {message.usedAi === true && (
                <span
                  title="Google Gemini가 이 문장을 분석했어요"
                  className="shrink-0 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[9.5px] font-semibold text-white"
                >
                  ✨ Gemini
                </span>
              )}
              {message.usedAi === false && (
                <span
                  title="OPENAI_API_KEY가 없거나 호출에 실패해 키워드 매칭으로 분석했어요"
                  className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[9.5px] font-semibold text-[var(--color-ink-soft)]"
                >
                  🔤 키워드 매칭
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {category.ingredients.map((ingredient) => (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                selected={ingredient.id === activeId}
                onPreview={() => onIngredientPreview(ingredient.id)}
                onSelect={() => onIngredientSelect(category.key, ingredient.id, ingredient.name)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (message.kind === "budget-prompt") {
    return (
      <div className="flex items-start gap-2.5 animate-fade-up">
        <AiAvatar />
        <div className="max-w-[85%] space-y-2.5">
          <div className="rounded-2xl rounded-tl-sm bg-[var(--color-primary-soft)] px-4 py-3">
            <p className="text-[13.5px] font-medium text-[var(--color-ink)]">
              좋아요! {message.ingredientName}이 상위에 배치된 세럼을 찾아드릴게요. 예산은 어느 정도
              생각하세요?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {budgetOptions.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onBudgetChip(b.id)}
                className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-[11.5px] text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // kind === 'result'
  const category = getCategory(message.categoryKey);
  const ingredient = getIngredientInCategory(message.categoryKey, message.ingredientId);
  if (!ingredient) return null;

  return (
    <div className="flex items-start gap-2.5 animate-fade-up">
      <AiAvatar />
      <div className="max-w-[90%] space-y-2.5">
        <div className="rounded-2xl rounded-tl-sm bg-[var(--color-primary-soft)] px-4 py-3">
          <p className="text-[13.5px] font-medium text-[var(--color-ink)]">
            선택하신 성분과 예산을 기준으로 TOP{message.results.length} 세럼을 추천드려요.
          </p>
          <p className="mt-1 text-[11px] text-[var(--color-ink-faint)]">
            {category.label} · {ingredient.name} · {getBudget(message.budgetId).label}
          </p>
        </div>
        {message.results.length === 0 ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-4 text-[12.5px] text-[var(--color-ink-soft)]">
            아쉽게도 이 예산 범위에는 조건에 맞는 제품이 없어요. 다른 예산을 선택해 보시겠어요?
          </div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {message.results.map((product, idx) => (
              <ResultCard
                key={product.id}
                rank={idx + 1}
                product={product}
                ingredient={ingredient}
                isInCompare={compareIds.includes(product.id)}
                onToggleCompare={() => onToggleCompare(product, ingredient.name, category.label)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
