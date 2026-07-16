interface Props {
  variant?: "hero" | "section" | "hero-dark";
}

/**
 * 진짜 Mesh Gradient 라이브러리는 못 쓰지만(빌드 도구 제약), 여러 색의 블러 처리된
 * 블롭을 서로 다른 속도로 움직이게 해서 "물감이 천천히 번지는" 느낌을 CSS만으로
 * 흉내냈어요. 각 블롭은 blob-move 애니메이션을 다른 delay/duration으로 써서
 * 서로 어긋나게 움직이며 겹쳐 보이게 했어요.
 */
export default function MeshGradientBg({ variant = "hero" }: Props) {
  const blobs =
    variant === "hero-dark"
      ? [
          // 보라색 배경 위라서, 밝은 흰색/민트 톤으로 "구름이 떠 있는" 느낌만 살짝 줘요.
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
