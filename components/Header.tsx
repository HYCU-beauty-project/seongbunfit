import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <Link
          href="/"
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
        <nav className="flex items-center gap-6 text-[13px] text-[var(--color-ink-soft)]">
          <Link href="/#service" className="hover:text-[var(--color-ink)] transition-colors">
            서비스 소개
          </Link>
          <Link href="/products" className="hover:text-[var(--color-ink)] transition-colors">
            화장품 검색
          </Link>
          <Link href="/notice" className="hover:text-[var(--color-ink)] transition-colors">
            공지사항
          </Link>
          <Link href="/faq" className="hover:text-[var(--color-ink)] transition-colors">
            FAQ
          </Link>
          <Link
            href="/chat"
            className="rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-[12.5px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            AI 추천받기
          </Link>
        </nav>
      </div>
    </header>
  );
}
