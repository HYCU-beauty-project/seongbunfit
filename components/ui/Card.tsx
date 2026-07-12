import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ children, className = "", ...rest }: Props) {
  return (
    <div
      className={`rounded-2xl bg-white border border-[var(--color-border)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
