const faqs = [
  {
    q: "성분핏은 실제 성분 함량을 알려주나요?",
    a: "아니요. 화장품법상 전성분은 함량이 높은 순서대로 기재된다는 원칙에 근거해 '배치 순서'를 기준으로 상대적인 순위만 추정해요. 정확한 함량(%)을 단정하지는 않아요.",
  },
  {
    q: "추천받은 제품은 무조건 믿어도 되나요?",
    a: "성분핏의 추천은 전성분 배치, 용량 대비 가격, 예산 적합도를 기준으로 한 참고 지표예요. 구매 전 제품 상세 페이지에서 정확한 정보를 꼭 확인해 주세요.",
  },
  {
    q: "피부 트러블이 있는데 성분핏이 진단해줄 수 있나요?",
    a: "성분핏은 의료적 진단이나 처방을 대체하지 않아요. 트러블이 지속된다면 피부과 등 전문가와 상담해 주세요.",
  },
  {
    q: "지금은 어떤 제품군만 추천 가능한가요?",
    a: "현재 프로토타입은 세럼 제품군(약 30여 종의 더미 데이터)으로 범위를 한정하고 있어요. 크림, 토너, 에센스 등은 추후 확장 예정이에요.",
  },
];

export default function FaqContent() {
  return (
    <div className="space-y-3">
      {faqs.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl border border-[var(--color-border)] px-4 py-3.5 open:bg-[var(--color-primary-soft)]/40"
        >
          <summary className="cursor-pointer list-none text-[13.5px] font-medium text-[var(--color-ink)] flex items-center justify-between">
            {item.q}
            <span className="text-[var(--color-ink-faint)] transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-2.5 text-[12.5px] text-[var(--color-ink-soft)] leading-relaxed">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
