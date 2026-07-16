"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number; // ms
  className?: string;
  variant?: "fade-up" | "scale";
}

export default function AnimateOnScroll({ children, delay = 0, className = "", variant = "fade-up" }: Props) {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenClass = variant === "scale" ? "opacity-0 scale-75" : "opacity-0 translate-y-6";
  const shownClass = variant === "scale" ? "opacity-100 scale-100" : "opacity-100 translate-y-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? shownClass : hiddenClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
