"use client";

import { useEffect, useRef, useState } from "react";

const SEGMENTS = [
  { pct: 0.6, color: "#534ab7" },
  { pct: 0.3, color: "#a99ce0" },
  { pct: 0.1, color: "#e6e2f7" },
];

interface Props {
  size?: number; // 렌더링 크기(px). viewBox랑 반지름은 이 값 기준 자동 계산됨
}

export default function ScoreDonut({ size = 160 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);
  const r = size * 0.375; // 160 기준 r=60 비율 유지
  const strokeWidth = size * 0.1125; // 160 기준 18 비율 유지
  const c = 2 * Math.PI * r;
  const center = size / 2;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setDrawn(true), 150);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 렌더링 중 변수 mutate 금지(react-hooks/immutability)라서
  // 각 구간의 누적 시작 위치를 렌더 전에 미리 계산해둠
  const segStarts: number[] = [];
  let acc = 0;
  for (const seg of SEGMENTS) {
    segStarts.push(acc);
    acc += seg.pct * c;
  }

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      style={{ height: size, width: size }}
      className="shrink-0 -rotate-90"
    >
      <circle cx={center} cy={center} r={r} fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth} />
      {SEGMENTS.map((seg, idx) => {
        const dash = seg.pct * c;
        const segOffset = segStarts[idx];
        return (
          <circle
            key={seg.color}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeDasharray={drawn ? `${dash} ${c - dash}` : `0 ${c}`}
            strokeDashoffset={-segOffset}
            style={{
              transition: "stroke-dasharray 1.1s ease-out",
              transitionDelay: `${(segOffset / c) * 400}ms`,
            }}
          />
        );
      })}
    </svg>
  );
}
