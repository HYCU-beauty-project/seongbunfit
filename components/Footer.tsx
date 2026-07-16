import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[var(--color-ink-faint)]">
          <span className="font-medium text-[var(--color-ink-soft)]">성분핏</span>
          <nav className="flex gap-5">
            <Link href="/terms" className="hover:text-[var(--color-ink)] transition-colors">
              이용약관
            </Link>
            <Link href="/faq" className="hover:text-[var(--color-ink)] transition-colors">
              FAQ
            </Link>
            <Link href="/notice" className="hover:text-[var(--color-ink)] transition-colors">
              공지사항
            </Link>
            <Link href="/event" className="hover:text-[var(--color-ink)] transition-colors">
              이벤트
            </Link>
            <Link href="/contact" className="hover:text-[var(--color-ink)] transition-colors">
              문의하기
            </Link>
          </nav>
        </div>
        <div className="mt-4 pt-4 text-center sm:text-left">
          <p className="text-[11px] text-[var(--color-ink-faint)] leading-relaxed">
            성분핏 프로젝트팀 · 서울특별시 성동구 · 이메일: help@seongbunfit.com
          </p>
          <p className="mt-1 text-[10px] text-[var(--color-ink-faint)]">
            COPYRIGHT © HYCU AI PLAYGROUND ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
