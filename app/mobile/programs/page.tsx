import Link from "next/link";

const programs = [
  {
    href: "/mobile/chat",
    title: "피부 고민 채팅",
    desc: "AI 채팅으로 피부 고민을 분석하고 성분을 추천받아요.",
    available: true,
  },
  {
    href: "/mobile/face-analysis",
    title: "얼굴 피부 진단",
    desc: "카메라로 피부톤을 분석해요.",
    available: false,
  },
];

export default function MobileProgramsPage() {
  return (
    <main className="px-5 py-8">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">이용하실 서비스를 선택하세요</h1>

      <div className="mt-6 space-y-3">
        {programs.map((p) =>
          p.available ? (
            <Link
              key={p.title}
              href={p.href}
              className="block rounded-xl border border-[var(--color-border)] p-4 hover:border-[var(--color-primary)] transition-colors"
            >
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">{p.title}</p>
              <p className="mt-1 text-[12px] text-[var(--color-ink-faint)]">{p.desc}</p>
            </Link>
          ) : (
            <Link
              key={p.title}
              href={p.href}
              className="block rounded-xl border border-dashed border-[var(--color-border)] p-4 hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold text-[var(--color-ink)]">{p.title}</p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-[var(--color-ink-faint)]">
                  곧 만나요!
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[var(--color-ink-faint)]">{p.desc}</p>
            </Link>
          )
        )}
      </div>
    </main>
  );
}
