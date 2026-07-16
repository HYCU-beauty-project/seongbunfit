export default function CosmeticIcons() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 드로퍼 병 */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-float absolute right-[10%] top-[14%] h-14 w-14 opacity-[0.16] md:h-20 md:w-20"
      >
        <path d="M9 3h5" />
        <path d="M10 3v3l-3.5 3.2c-.9.8-1.4 1.9-1.4 3.1v6.2c0 1.4 1.1 2.5 2.5 2.5h4.8c1.4 0 2.5-1.1 2.5-2.5v-6.2c0-1.2-.5-2.3-1.4-3.1L10 6" />
        <path d="M6.5 14.5h6" />
      </svg>

      {/* 크림 통 */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-float-delayed absolute right-[26%] top-[62%] h-11 w-11 opacity-[0.14] md:h-16 md:w-16"
      >
        <rect x="4" y="9" width="16" height="11" rx="2" />
        <path d="M4 13h16" />
        <path d="M8 9V7a4 4 0 0 1 8 0v2" />
      </svg>

      {/* 잎사귀 (성분/자연 유래 느낌) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-slow-spin-reverse absolute right-[3%] top-[45%] h-9 w-9 opacity-[0.14] md:h-12 md:w-12"
      >
        <path d="M5 21c8-1 13-6 14-14C11 8 6 13 5 21Z" />
        <path d="M9 17c2-3 5-6 9-8" />
      </svg>
    </div>
  );
}
