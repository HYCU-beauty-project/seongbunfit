const ICONS = ["dropper", "jar", "pump", "tube", "leaf", "spray"];

interface Props {
  rows?: 1 | 2;
}

export default function IconMarquee({ rows = 2 }: Props) {
  // 끊김없이 반복되게 아이콘 배열 두 번 이어붙임.
  // -50% 만큼 움직이면 처음이랑 똑같아 보이는 원리
  const items = [...ICONS, ...ICONS];
  const itemsReversed = [...ICONS].reverse();
  const itemsReversedDup = [...itemsReversed, ...itemsReversed];

  if (rows === 1) {
    return (
      <div className="flex flex-col justify-center py-3">
        <MarqueeRow items={items} reverse={false} size={34} />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-6 py-10">
      <MarqueeRow items={items} reverse={false} size={44} />
      <MarqueeRow items={itemsReversedDup} reverse size={56} />
    </div>
  );
}

function MarqueeRow({ items, reverse, size }: { items: string[]; reverse: boolean; size: number }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        className="flex w-max items-center gap-10"
        style={{
          animation: `marquee-scroll ${reverse ? 28 : 22}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {items.map((name, idx) => (
          <span
            key={idx}
            className="flex shrink-0 items-center justify-center opacity-90"
            style={{ height: size, width: size }}
          >
            <CosmeticGlyph name={name} size={size * 0.7} />
          </span>
        ))}
      </div>
    </div>
  );
}

function CosmeticGlyph({ name, size = 40 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "white",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "dropper":
      return (
        <svg {...common}>
          <path d="M9 3h5" />
          <path d="M10 3v3l-3.5 3.2c-.9.8-1.4 1.9-1.4 3.1v6.2c0 1.4 1.1 2.5 2.5 2.5h4.8c1.4 0 2.5-1.1 2.5-2.5v-6.2c0-1.2-.5-2.3-1.4-3.1L10 6" />
          <path d="M6.5 14.5h6" />
        </svg>
      );
    case "jar":
      return (
        <svg {...common}>
          <rect x="4" y="9" width="16" height="11" rx="2" />
          <path d="M4 13h16" />
          <path d="M8 9V7a4 4 0 0 1 8 0v2" />
        </svg>
      );
    case "pump":
      return (
        <svg {...common}>
          <rect x="7" y="9" width="10" height="12" rx="1.5" />
          <path d="M10 9V6h4v3" />
          <path d="M9 3h6l-1 3h-4l-1-3Z" />
        </svg>
      );
    case "tube":
      return (
        <svg {...common}>
          <path d="M8 3h8l1 5H7l1-5Z" />
          <path d="M7 8h10l-1.5 12a1 1 0 0 1-1 .9h-5a1 1 0 0 1-1-.9L7 8Z" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M5 21c8-1 13-6 14-14C11 8 6 13 5 21Z" />
          <path d="M9 17c2-3 5-6 9-8" />
        </svg>
      );
    case "spray":
      return (
        <svg {...common}>
          <rect x="6" y="10" width="9" height="11" rx="1.5" />
          <path d="M10 10V7h3v3" />
          <path d="M13 6h4l2-2" />
          <path d="M17 9l2-1M18 6l1.5-.5" />
        </svg>
      );
    default:
      return null;
  }
}
