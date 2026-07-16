"use client";

import { useEffect, useRef, useState } from "react";

const DOTS = [
  { x: -70, y: -50, color: "#534ab7" },
  { x: 75, y: -40, color: "#7c6fdb" },
  { x: -80, y: 45, color: "#5b9bd5" },
  { x: 70, y: 55, color: "#4fb0a5" },
  { x: 0, y: -75, color: "#c26bb0" },
];

interface Props {
  children: React.ReactNode;
}

export default function IngredientConverge({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center">
      {visible &&
        DOTS.map((dot, idx) => (
          <span
            key={idx}
            aria-hidden
            className="animate-orbit-in absolute h-2.5 w-2.5 rounded-full"
            style={
              {
                backgroundColor: dot.color,
                "--start-x": `${dot.x}px`,
                "--start-y": `${dot.y}px`,
                animationDelay: `${idx * 90}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      {children}
    </div>
  );
}
