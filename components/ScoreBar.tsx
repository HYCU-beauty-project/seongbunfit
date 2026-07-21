"use client";

import { useEffect, useState } from "react";

interface Props {
  label: string;
  value: number; // 0~100
  sublabel?: string;
  color?: string; // CSS 변수 또는 색상값
  delay?: number; // ms. 여러 막대 순차적으로 채울 때 씀
  size?: "sm" | "md";
}

// 계산법 설명, 추천 카드, 비교함 등에서 재사용하는 애니메이션 막대그래프.
// 마운트 시(모달 열림, 카드 등장) 0%에서 점수까지 차오름. CSS transition만 씀, 라이브러리 없음
export default function ScoreBar({
  label,
  value,
  sublabel,
  color = "var(--color-primary)",
  delay = 0,
  size = "md",
}: Props) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.max(0, Math.min(100, value))), 50 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  const trackHeight = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={`font-medium text-[var(--color-ink-soft)] ${
            size === "sm" ? "text-[10.5px]" : "text-[11.5px]"
          }`}
        >
          {label}
        </span>
        <span
          className={`font-semibold text-[var(--color-ink)] ${
            size === "sm" ? "text-[10.5px]" : "text-[12px]"
          }`}
        >
          {value}점{sublabel ? <span className="ml-1 font-normal text-[var(--color-ink-faint)]">{sublabel}</span> : null}
        </span>
      </div>
      <div className={`mt-1 w-full overflow-hidden rounded-full bg-gray-100 ${trackHeight}`}>
        <div
          className={`${trackHeight} rounded-full transition-[width] ease-out`}
          style={{
            width: `${width}%`,
            backgroundColor: color,
            transitionDuration: "800ms",
          }}
        />
      </div>
    </div>
  );
}
