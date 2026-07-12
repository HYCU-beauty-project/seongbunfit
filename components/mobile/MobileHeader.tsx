import Link from "next/link";

export default function MobileHeader() {
  return (
    <header className="w-full bg-white border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-4">
        <Link
          href="/mobile"
          className="flex items-center gap-2 font-semibold text-[15px] text-[var(--color-ink)]"
        >
          <span
            aria-hidden
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7h6l2-3h2l2 3h6" />
              <rect x="3" y="7" width="18" height="14" rx="2" />
            </svg>
          </span>
          성분핏
        </Link>
        {/* 필요하면 여기에 알림/프로필 아이콘 등을 추가하세요 */}
      </div>
    </header>
  );
}
