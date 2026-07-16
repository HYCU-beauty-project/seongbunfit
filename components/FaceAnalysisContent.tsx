const steps = [
  { title: "카메라로 촬영", desc: "모바일 카메라로 얼굴을 정면에서 촬영해요." },
  { title: "AI가 피부 분석", desc: "피부톤·밝기 등을 자동으로 분석해요." },
  { title: "맞춤 성분 추천", desc: "분석 결과에 맞는 성분을 안내해드려요." },
];

export default function FaceAnalysisContent() {
  return (
    <div>
      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-[var(--color-ink-faint)]">
        개발 중 · 곧 만나요
      </span>
      <h1 className="mt-3 text-[20px] font-bold text-[var(--color-ink)]">얼굴 피부 진단(안면인식)</h1>
      <p className="mt-2 text-[13px] text-[var(--color-ink-soft)] leading-relaxed">
        카메라로 얼굴을 촬영하면 AI가 피부톤과 상태를 분석해서, 지금 채팅으로 추천받는 성분에
        피부 진단 결과까지 더해 훨씬 정확하게 추천해드릴 예정이에요.
      </p>

      <div className="mt-7 space-y-3">
        {steps.map((step, idx) => (
          <div key={step.title} className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] p-3.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[11px] font-semibold text-[var(--color-primary)]">
              {idx + 1}
            </span>
            <div>
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">{step.title}</p>
              <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-faint)]">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-[12.5px] font-semibold text-amber-900">꼭 알아두세요</p>
        <ul className="mt-2 space-y-1.5 text-[11.5px] leading-relaxed text-amber-900">
          <li>• 촬영 환경(조명, 카메라 성능 등)에 따라 분석 결과가 달라질 수 있어요. 참고용으로만 활용해주세요.</li>
          <li>• 의료적 진단이나 처방을 대체하지 않아요. 피부 트러블이 지속되면 피부과 상담을 받아보세요.</li>
          <li>• 모바일에서 이용하시려면 카메라 접근 권한 허용이 필요해요.</li>
          <li>• 촬영한 사진은 분석 목적으로만 사용되며, 서버에 저장되지 않을 예정이에요.</li>
        </ul>
      </div>
    </div>
  );
}
