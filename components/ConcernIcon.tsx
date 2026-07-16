interface Props {
  name: string;
  size?: number;
}

export default function ConcernIcon({ name, size = 20 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "wrinkle":
      return (
        <svg {...common}>
          <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
          <path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        </svg>
      );
    case "brightening":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3v2.2M12 18.8V21M4.2 12H2M22 12h-2.2M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5" />
        </svg>
      );
    case "hydration":
      return (
        <svg {...common}>
          <path d="M12 2.5c3.5 4.5 6 7.8 6 11.2a6 6 0 1 1-12 0c0-3.4 2.5-6.7 6-11.2Z" />
        </svg>
      );
    case "pore":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="14" cy="9" r="1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "texture":
      return (
        <svg {...common}>
          <path d="m12 3 1.8 4.9L19 9.5l-4.5 2.8L15.5 17 12 14l-3.5 3 1-4.7L5 9.5l5.2-1.6L12 3Z" />
        </svg>
      );
    default:
      return null;
  }
}
