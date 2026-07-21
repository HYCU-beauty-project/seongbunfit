"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollProgressLine({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // 섹션이 화면 하단에 처음 나타날 때 0, 중앙쯤 지날 때 1 되게 계산
      const start = viewportH * 0.85;
      const end = viewportH * 0.35;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={`h-px bg-[var(--color-border)] ${className}`}>
      <div
        className="h-full origin-left bg-[var(--color-primary)]"
        style={{ transform: `scaleX(${progress})`, transition: "transform 80ms linear" }}
      />
    </div>
  );
}
