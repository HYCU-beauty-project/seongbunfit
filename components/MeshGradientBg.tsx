interface Props {
  variant?: "hero" | "section" | "hero-dark";
}

/**
 * 진짜 Mesh Gradient 라이브러리는 빌드 도구 제약으로 못 씀.
 * 블러 블롭 여러 개를 다른 속도로 움직여서 "물감 번지는" 느낌을 CSS로만 흉내냄.
 * 각 블롭은 blob-move 애니메이션을 다른 delay/duration으로 줘서 어긋나게 겹침
 */
export default function MeshGradientBg({ variant = "hero" }: Props) {
  const blobs =
    variant === "hero-dark"
      ? [
          // 보라 배경 위라서 밝은 흰색/민트 톤으로 구름 뜬 느낌만 살짝
          { className: "-top-24 -left-24 h-80 w-80", color: "#ffffff", anim: "animate-blob", opacity: 0.1 },
          { className: "top-10 right-0 h-64 w-64", color: "var(--color-accent-on-dark)", anim: "animate-blob-delayed", opacity: 0.18 },
          { className: "-bottom-20 -right-10 h-72 w-72", color: "#ffffff", anim: "animate-blob-slow", opacity: 0.08 },
          { className: "bottom-0 left-1/3 h-56 w-56", color: "var(--color-accent-on-dark)", anim: "animate-blob", opacity: 0.12 },
        ]
      : variant === "hero"
      ? [
          { className: "-top-24 -left-24 h-72 w-72", color: "var(--color-primary-soft)", anim: "animate-blob", opacity: 0.4 },
          { className: "top-10 right-0 h-56 w-56", color: "var(--color-accent-soft)", anim: "animate-blob-delayed", opacity: 0.12 },
          { className: "-bottom-16 -right-16 h-80 w-80", color: "#f4efe6", anim: "animate-blob-slow", opacity: 0.45 },
          { className: "bottom-0 left-1/4 h-48 w-48", color: "#e8e4fb", anim: "animate-blob", opacity: 0.4 },
        ]
      : [
          { className: "-top-10 left-1/4 h-56 w-56", color: "var(--color-primary-soft)", anim: "animate-blob-delayed", opacity: 0.4 },
          { className: "bottom-0 right-1/4 h-48 w-48", color: "var(--color-accent-soft)", anim: "animate-blob-slow", opacity: 0.12 },
        ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((blob, idx) => (
        <div
          key={idx}
          className={`absolute rounded-full blur-3xl ${blob.className} ${blob.anim}`}
          style={{ backgroundColor: blob.color, opacity: blob.opacity }}
        />
      ))}
    </div>
  );
}
