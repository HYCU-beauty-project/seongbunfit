# 유사 서비스·선행 연구 조사 (2026-07-22)

"성분핏과 같은 서비스가 이미 있는가, 관련 논문이 있는가"를 조사한 문서입니다.
비교 기준은 성분핏의 세 가지 핵심 축입니다.

- **A. 순서 점수화** — 전성분 기재 순서를 성분별 기준위치(refPosition) 대비 상대 배수로 점수화
- **B. 가성비 산식 공개** — 배치 60% + ml당 가격 30% + 예산 10% 산식과 계산값을 투명 공개
- **C. AI 자연어 인터페이스** — 피부 고민(자연어) → 분류/설명만 AI, 계산은 결정론적 코드

> 표기 원칙: 공식 사이트·공개 자료로 확인된 내용만 기재하고, 확인하지 못한 항목은
> **(미확인)**, 정황상 추론은 **(추정)** 으로 표시했습니다. 논문은 게재처가 검색으로
> 실존 확인된 것만 수록했습니다.

## 결론 요약

**세 축(A+B+C)을 모두 갖춘 서비스는 국내외에서 확인되지 않았습니다.** 각 축은 개별적으로
존재합니다 — 순서·위치 활용은 SkinSort·잼페이스가 근접, 산식 공개는 Yuka·EWG, AI 채팅은
OnSkin·SkinGPT류, ml당 가격 비교는 BeautyByRatio류가 담당하지만, **순서를 정량 점수로
환산하고 가격과 하나의 공개 산식으로 합산해 랭킹하는 서비스는 전무**했습니다.

논문 쪽도 같은 구도입니다. 기재 순서로 함량을 추정한 연구(Isaacs et al. 2018)와 순서를
보존한 성분 시퀀스를 딥러닝 입력으로 쓴 연구(Lee et al. 2024)는 있어 **"순서에 정보가
있다"는 성분핏의 핵심 가정은 학술적 근거가 있으나**, 이를 가격과 결합한 가성비 랭킹
산식으로 만든 선행 연구는 확인되지 않았습니다.

---

## 1. 유사 서비스 비교

### 비교표

| 서비스 | 국가 | A. 순서 점수화 | B. 산식 공개 | 가격/가성비 | C. AI 채팅 | 핵심 방식 |
|---|---|---|---|---|---|---|
| **성분핏** | 🇰🇷 | ✅ refPosition 상대 배수 | ✅ 공식+계산값 공개 | ✅ ml당 가격+예산 | ✅ Gemini 분류/설명 | 순서×가격 가성비 산식 |
| 화해 | 🇰🇷 | ❌ | ❌ 궁합 점수 산식 비공개 | △ 유사 성분 저가 제품 추천 | ❌ (챗봇 미확인) | 주의성분+EWG 등급+리뷰 |
| 잼페이스 | 🇰🇷 | △ "함량·배합비율 고려" 주장, 산식 비공개 | ❌ | (미확인) | ❌ (셀카 피부 분석) | AI 피부 분석+적합도 8단계 |
| 글로우픽·언니의파우치 | 🇰🇷 | ❌ | ❌ | ❌ | ❌ | 리뷰 랭킹+주의성분 안내 |
| INCIDecoder | 🇭🇺 | ❌ (순서 읽는 법 교육만) | — (제품 점수 없음) | ❌ | ❌ | 성분별 전문가 해설 |
| SkinSort | 🇺🇸(추정) | △ 성분별 "통상 위치·농도 범위" 표시(점수화는 안 함) | (미확인) | (미확인) | (미확인) | 성분 분석+루틴 관리 |
| CosDNA | 🇹🇼(추정) | ❌ (농도 미반영이 대표 한계) | ❌ | ❌ | ❌ | 성분별 여드름/자극/안전 등급 |
| EWG Skin Deep | 🇺🇸 | ❌ (농도 미반영) | ✅ 유해성 산식 상세 공개 | ❌ | ❌ | 유해성 1~10점+데이터 등급 |
| Yuka | 🇫🇷 | ❌ | ✅ 감점 규칙 공개 | ❌ | ❌ | 스캔→위험도 4색+감점식 |
| Think Dirty | 🇨🇦(추정) | ❌ | △ 방법론 공개 | ❌ | ❌ | 독성 근거 기반 Dirty Meter |
| OnSkin | 🌐 | △ "고농도 경고" 있으나 근거 미확인 | ❌ 세부 산식 비공개 | ❌ | ✅ AI Skin Helper 채팅 | 스캔→0~100 안전 점수 |
| BeautyByRatio·OutletPicks | 🌐 | ❌ | — | ✅ ml당 가격 비교 | ❌ | 성분 무관 순수 가격 도구 |

### 축별로 가장 가까운 서비스

- **A(순서)에 근접**: **SkinSort** — 성분의 "전성분 내 통상 위치(common placement)"와
  일반적 농도 범위를 표시. 성분핏의 refPosition과 개념이 가장 유사하나 **정보 표시용**에
  그치고 제품 점수로 환산하지 않음. **잼페이스** — "함량·배합비율 고려"를 홍보하나 산식
  비공개라 검증 불가.
- **B(산식 공개)에 근접**: **Yuka** — 감점 규칙(발암 의심 -10점 등)까지 공개하지만 축이
  **유해성**이고 가격은 없음. **EWG** — 산식 공개의 원조지만 역시 유해성 축.
- **C(AI 채팅)에 근접**: **OnSkin**(AI Skin Helper), Haut.AI Skin.Chat(B2B), SkinGPT —
  모두 성분 순서 점수화·가성비 산식 없음.
- **주의할 경쟁 동향**: 화해의 신기능 **"궁합 점수"**(피부타입·고민 → 적합도 수치화)와
  **"내 사용템"**(병용 주의 성분 조합 경고)은 성분핏의 적합도 점수·`lib/safety.ts` 병용
  주의 안전장치와 컨셉이 부분적으로 겹침. 차별화 논거는 ① 산식 투명 공개(화해는 블랙박스)
  ② 순서 기반 정량화 ③ 가격 결합 가성비.

### 기존 서비스들의 공통 공백

1. **유해성 중심, 효능·가성비 부재** — EWG·Yuka·Think Dirty·CosDNA 모두 "이 성분이
   위험한가"를 다루고, "이 가격에 이 성분 구성이 합리적인가"는 다루지 않음.
2. **농도(순서) 미반영이 공통 비판점** — CosDNA·EWG 모두 "농도를 반영하지 못한다"는
   비판을 받음. 성분핏의 refPosition은 정확히 이 공백을 겨냥.
3. **점수는 있어도 산식은 비공개** — 화해 궁합 점수, 잼페이스 적합도, OnSkin 안전 점수
   모두 블랙박스. 산식+계산값 공개는 Yuka·EWG(유해성 축)뿐.

---

## 2. 관련 논문 리뷰

### 2-1. 성분 기재 순서 → 함량 추정 (성분핏 핵심 가정의 근거)

| 논문 | 게재처 | 내용 및 관련성 |
|---|---|---|
| Isaacs et al., **"Consumer product chemical weight fractions from ingredient lists"** (2018) | J. of Exposure Science & Environmental Epidemiology 28 | ⭐ **기재 순위·리스트 길이·표시 규정(내림차순, 1% 규칙)만으로 성분별 중량분율을 확률 추정**하는 모델. 제품 1,123개에 적용. 성분핏 상대 배수 점수화의 가장 직접적인 학술 근거. [링크](https://www.nature.com/articles/jes201729) |
| Lee et al., **"Deep learning-based skin care product recommendation: A focus on cosmetic ingredient analysis and facial skin conditions"** (2024) | J. of Cosmetic Dermatology 23(6) | ⭐ **순서를 보존한 전성분 시퀀스를 딥러닝 입력**으로 제품 효능 예측 + 얼굴 피부 분석 결합 추천. "순서에 정보가 있다"를 모델로 입증한 최신 연구. [링크](https://onlinelibrary.wiley.com/doi/full/10.1111/jocd.16218) |
| Isaacs et al., "Characterization and prediction of chemical functions and weight fractions in consumer products" (2016) | Toxicology Reports 3 | 랜덤 포레스트로 성분 함량을 구간(0–1% / 1–30% / 30–100%)으로 예측. 함량의 구간 점수화 선례. [링크](https://pmc.ncbi.nlm.nih.gov/articles/PMC5616074) |
| "The Chemical and Products Database (CPDat)" (2018) | Scientific Data | 소비재 전성분·조성 공개 DB — 위 연구들의 기반 데이터셋. [링크](https://www.nature.com/articles/sdata2018125) |

### 2-2. 화장품/스킨케어 추천 시스템

| 논문 | 게재처 | 내용 및 관련성 |
|---|---|---|
| Lee, Jiang, Parde, "A Content-based Skincare Product Recommendation System" (2023) | IEEE ICMLA 2023 | IF-IPF(성분 빈도-역제품 빈도)로 효능별 핵심 성분을 식별해 콘텐츠 기반 추천. 성분 벡터화 추천의 대표 사례. [링크](https://www.academia.edu/63711006/) |
| "Cosmetic Product Selection Using Machine Learning" (2022) | IEEE IC3IoT 2022 | 사용자 속성별 유효 성분 추출 기반 추천. [링크](https://ieeexplore.ieee.org/document/9767972/) |
| "Personalized Skincare Product Recommendation System Using Content-Based Machine Learning" (2024) | IEEE 학술대회 (세부 미확인) | 성분 조성+피부타입 결합 콘텐츠 기반 추천 — 성분핏과 동일 구도. [링크](https://ieeexplore.ieee.org/document/10626458/) |
| Ramrakhiani & Kalbande, "A comprehensive review of AI-powered skincare product recommendation systems" (2024) | SAGE (Digital Health 계열) | 데이터 수집→UX까지 AI 스킨케어 추천 전반 서베이. 관련연구 절 인용용. [링크](https://journals.sagepub.com/doi/10.1177/20427530241304073) |

### 2-3. LLM 역할 분리 (분류/설명은 AI, 계산은 코드)

| 논문 | 게재처 | 내용 및 관련성 |
|---|---|---|
| Gao et al., **"PAL: Program-aided Language Models"** (2023) | ICML 2023 | ⭐ LLM은 문제 이해·분해만 하고 **산술은 인터프리터에 위임** → 정확도 대폭 향상. "AI는 계산하지 않습니다" 설계의 대표 근거. [링크](https://arxiv.org/abs/2211.10435) |
| Schick et al., "Toolformer" (2023) | NeurIPS 2023 | LM이 계산기 등 외부 도구 호출을 학습해 산술·사실성 약점 보완. [링크](https://arxiv.org/abs/2302.04761) |
| Ji et al., "Survey of Hallucination in Natural Language Generation" (2023) | ACM Computing Surveys 55 | 환각 원인·완화 서베이(인용 2,100+). 수치 계산을 LLM에 맡기지 않는 결정의 근거. [링크](https://dl.acm.org/doi/10.1145/3571730) |
| Gao et al., "Chat-REC: Towards Interactive and Explainable LLMs-Augmented Recommender System" (2023) | arXiv:2303.14524 | LLM을 기존 추천 로직의 **인터페이스 계층**으로 쓰는 구조 — 성분핏의 채팅 구조와 동일. [링크](https://arxiv.org/abs/2303.14524) |
| Jannach et al., "A Survey on Conversational Recommender Systems" (2021) | ACM Computing Surveys | 대화형 추천시스템(CRS) 표준 서베이 — "대화로 니즈를 받아 추천" 구조의 기본 인용. [링크](https://arxiv.org/abs/2004.00646) |
| Lin et al., "How Can Recommender Systems Benefit from Large Language Models: A Survey" (2023) | arXiv:2306.05817 | 추천 파이프라인 단계별 LLM 접목 방식 정리 — "LLM은 이해/설명, 랭킹은 별도 모듈" 근거. [링크](https://arxiv.org/abs/2306.05817) |

### 2-4. 국내 논문 (KCI/DBpia)

| 논문 | 게재처 | 내용 및 관련성 |
|---|---|---|
| 김성언·김은경·김용기, "퍼지 추론과 감성사전 구축을 통한 화장품 추천 시스템" (2017) | 한국지능시스템학회 논문지 (KCI) | EWG 기반 **성분 유해도 점수**+리뷰 감성 점수를 퍼지 추론으로 결합. 국내 "성분 점수화 추천"의 대표 선행 — 단 순서가 아닌 유해도 축. [링크](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002231180) |
| 김효중 외, "고객의 특성 정보를 활용한 화장품 추천시스템 개발" (2021) | 경영정보학연구 23(4) (KCI) | 피부타입·고민 컨텍스트 반영 심층신경망 추천 — 실제 뷰티 플랫폼 데이터로 검증. [링크](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002781784) |
| 김예원·홍선미·엄성용, "텍스트 인식 기법에 기반한 화장품 성분 자동 분석 시스템" (2023) | 문화기술의 융합 (KCI) | 라벨 촬영 이미지에서 전성분 자동 식별 — 전성분 데이터화 파이프라인 선행 사례(향후 사진 제보 크라우드소싱 참고). [링크](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002927232) |
| 강범진 외, "OCR 기반 화장품 성분표 분석 시스템" (2022) | 한국방송·미디어공학회 추계학술대회 | 성분표 특화 OCR(정확도 80.3%)+DB 대조 피부타입 적합성 판정. [링크](https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11174580) |

---

## 3. 시사점

### 차별화 논거 (발표·보고서용)

1. **"순서→함량" 가정은 근거 있는 선택** — Isaacs et al.(2018)이 기재 순서로 함량을
   확률 추정할 수 있음을 보였고, Lee et al.(2024)이 순서 보존 시퀀스가 효능 예측에
   유효함을 보임. 성분핏은 이를 **경량·설명가능한 산식**(상대 배수)으로 서비스화한 것.
2. **가성비 축은 서비스·연구 모두 공백** — 유해성 점수(EWG·Yuka·CosDNA·국내 퍼지추론
   연구)는 많지만, 효능 기대치(순서)×가격을 하나의 공개 산식으로 묶은 사례는 없음.
3. **"AI는 계산하지 않는다"는 학계 검증된 패턴** — PAL·Toolformer가 보인 "LLM은
   이해/설명, 산술은 코드" 분리와 정확히 같은 구조. README의 "그냥 GPT 쓰면 되지
   않나?"에 대한 답변을 이 문헌들로 보강 가능.

### 한계·유의점

- **경쟁 추격 가능성** — 화해 "궁합 점수"·"내 사용템"(병용 주의)이 인접 기능. 데이터
  규모(리뷰 1,000만+)에서 밀리므로 **산식 투명성**을 정체성으로 유지해야 함.
- **SkinSort의 통상 위치 데이터** — refPosition과 유사한 개념이 이미 표시용으로
  존재하므로 "세계 최초" 류 표현은 지양하고 "점수화·가성비 결합이 차별점"으로 표현.
- **조사 방법의 한계** — 웹 검색 기반 조사(2026-07)로, 비공개 산식(잼페이스·화해·OnSkin)의
  내부 구현은 확인 불가. SkinSort는 사이트 직접 접근이 차단돼 검색 발췌에 의존.

### 후속 작업 후보

- README 하단에 본 문서 링크 + "관련 연구" 한 단락 추가
- 발표 자료에 비교표(1절)와 차별화 논거(3절) 슬라이드화
- Isaacs et al.(2018) 모델을 참고해 refPosition 보정 로직 고도화 검토
