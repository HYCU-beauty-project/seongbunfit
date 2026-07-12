"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/mobile", label: "홈", icon: "home" },
  { href: "/mobile/chat", label: "AI 상담", icon: "chat" },
  { href: "/products", label: "검색", icon: "search" },
  { href: "/faq", label: "안내", icon: "info" },
] as const;

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] border-t border-[var(--color-border)] bg-white">
      {TABS.map((tab) => {
        // "/mobile"은 정확히 일치할 때만, 나머지는 하위 경로도 포함해 active 처리
        const active =
          tab.href === "/mobile" ? pathname === "/mobile" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] transition-colors ${
              active ? "text-[var(--color-primary)]" : "text-[var(--color-ink-faint)]"
            }`}
          >
            <TabIcon name={tab.icon} active={active} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function TabIcon({ name, active }: { name: string; active: boolean }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: active ? 2.3 : 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1.5-4.5A8.5 8.5 0 1 1 21 11.5Z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      );
    default:
      return null;
  }
}
