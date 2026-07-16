"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "@/components/CountUp";

const PRODUCTS = [
  { label: "성분핏 추천템", placement: 100, price: 90, budget: 100 },
  { label: "무난한 제품", placement: 70, price: 60, budget: 100 },
  { label: "비추천 제품", placement: 30, price: 20, budget: 50 },
];

export default function InteractiveScoreDemo() {
  const [selected, setSelected] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const product = PRODUCTS[selected];
  const final = Math.round(product.placement * 0.6 + product.price * 0.3 + product.budget * 0.1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 처음 화면에 들어올 땐 막대가 0%였다가 값까지 차오르는 걸 보여주고 싶어서,
          // 살짝 지연을 준 다음 revealed를 true로 바꿔요(바로 true면 CSS transition이
          // 시작점(0%)을 그릴 새도 없이 곧장 끝값으로 그려질 수 있어서요).
          const timer = setTimeout(() => setRevealed(true), 200);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto mt-10 max-w-md rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <p className="text-[12px] font-semibold text-[var(--color-ink-soft)]">
        직접 골라보고 점수가 어떻게 나오는지 확인해보세요
      </p>
      <div className="mt-3 flex gap-2">
        {PRODUCTS.map((p, idx) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setSelected(idx)}
            className={`flex-1 rounded-lg py-2 text-[11.5px] font-medium transition-colors ${
              selected === idx
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:border-[var(--color-primary)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-1">
        <span key={selected} className="text-[40px] font-extrabold text-[var(--color-accent-text)]">
          {revealed ? <CountUp to={final} duration={1400} /> : 0}
        </span>
        <span className="mb-1 text-[13px] font-medium text-[var(--color-ink-faint)]">/ 100점</span>
      </div>

      <div className="mt-4 space-y-2">
        <ScoreBar
          key={`p-${selected}`}
          label="전성분 배치"
          value={revealed ? product.placement : 0}
          weight={60}
          delay={0}
        />
        <ScoreBar
          key={`r-${selected}`}
          label="용량 대비 가격"
          value={revealed ? product.price : 0}
          weight={30}
          delay={150}
        />
        <ScoreBar
          key={`b-${selected}`}
          label="예산 적합"
          value={revealed ? product.budget : 0}
          weight={10}
          delay={300}
        />
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  weight,
  delay = 0,
}: {
  label: string;
  value: number;
  weight: number;
  delay?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10.5px] text-[var(--color-ink-faint)]">
        <span>
          {label} <span className="text-[var(--color-ink-faint)]">({weight}%)</span>
        </span>
        <span className="font-medium text-[var(--color-ink)]">{value}점</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-[width] ease-out"
          style={{ width: `${value}%`, transitionDuration: "1400ms", transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
