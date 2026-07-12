const SECTIONS = [
  {
    title: "제1조 (서비스의 성격)",
    body: "성분핏은 화장품 전성분 표기 순서와 가격 정보를 기반으로 상대적인 가성비를 추정해 안내하는 참고용 서비스입니다. 제공되는 정보는 정확한 성분 함량을 보장하지 않습니다.",
  },
  {
    title: "제2조 (의료 정보 아님)",
    body: "성분핏이 제공하는 정보는 의료적 진단, 처방 또는 치료를 대체하지 않습니다. 피부 트러블이나 이상 반응이 있는 경우 반드시 전문의와 상담해 주세요.",
  },
  {
    title: "제3조 (구매 전 확인 의무)",
    body: "추천된 제품을 구매하기 전, 반드시 판매처에서 최신 제품 정보와 전성분표를 직접 확인해 주세요. 실제 제품 사양은 제조사 사정에 따라 변경될 수 있습니다.",
  },
  {
    title: "제4조 (프로토타입 한계)",
    body: "현재 버전은 경진대회 제출용 프로토타입으로, 세럼 카테고리에 한정된 더미 데이터를 사용합니다. 실제 제품 데이터베이스와 다를 수 있습니다.",
  },
];

export default function TermsContent() {
  return (
    <div className="space-y-6 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">{section.title}</h2>
          <p className="mt-1.5">{section.body}</p>
        </div>
      ))}
    </div>
  );
}
