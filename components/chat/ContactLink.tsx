const CONTACT_EMAIL = "help@seongbunfit.com";

export default function ContactLink() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white py-2.5 text-[12px] font-medium text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1.5-4.5A8.5 8.5 0 1 1 21 11.5Z" />
        <path d="M12 8v4M12 15h.01" />
      </svg>
      문의하기
    </a>
  );
}
