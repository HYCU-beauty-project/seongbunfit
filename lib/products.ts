import type { Product } from "@/types";

// 더미 데이터입니다. 저작권 이슈를 피하기 위해 실제 크롤링 데이터 대신
// 직접 구성한 가상의 제품/브랜드를 사용합니다. (팀 메모 참고)
// actualPosition: 베이스 성분(정제수, 글리세린 등) 포함, 전체 전성분 리스트 기준 실제 배치 순번
// (기준위치(refPosition)는 베이스 성분이 앞쪽에 오는 것을 이미 감안해 정해진 값입니다)
//
// ⚠️ Supabase 연동 시 참고: 이 파일의 Row는 실제로는 products 테이블과
// product_ingredients 테이블(제품↔성분 다대다 관계) 두 개로 나뉘어요. 지금은
// "제품 하나 = 핵심 성분 하나"로 단순화했지만, 실제 데이터는 제품 하나에 성분이
// 수십 개 있고 그중 사용자가 고른 성분의 위치만 보는 구조예요. 전체 스키마와
// 마이그레이션 방향은 lib/supabase/schema.sql을 참고하세요.

const colors = ["#EDE9FB", "#F5EEE6", "#E8F1EC", "#F1E9EC", "#EAF0F5", "#F6F1E4"];

interface Row {
  ingredientId: string;
  name: string;
  brand: string;
  price: number;
  volumeMl: number;
  actualPosition: number;
}

const rows: Row[] = [
  // 레티놀 (기준위치 12)
  { ingredientId: "retinol", name: "리제너 나이트 세럼", brand: "셀루틴", price: 19800, volumeMl: 30, actualPosition: 4 },
  { ingredientId: "retinol", name: "타임리페어 세럼", brand: "더마웍스", price: 24000, volumeMl: 30, actualPosition: 10 },
  { ingredientId: "retinol", name: "퍼스트 레티놀 세럼", brand: "바른결", price: 15900, volumeMl: 20, actualPosition: 8 },
  { ingredientId: "retinol", name: "프리미엄 리뉴얼 앰플", brand: "글로우랩", price: 38000, volumeMl: 30, actualPosition: 3 },
  { ingredientId: "retinol", name: "슬로우에이징 세럼", brand: "포어리스", price: 12500, volumeMl: 15, actualPosition: 22 },

  // 아데노신 (기준위치 15)
  { ingredientId: "adenosine", name: "리프트 케어 세럼", brand: "바이옴", price: 17800, volumeMl: 30, actualPosition: 9 },
  { ingredientId: "adenosine", name: "탄력 부스팅 세럼", brand: "데일리핏", price: 13200, volumeMl: 25, actualPosition: 14 },
  { ingredientId: "adenosine", name: "웰에이징 세럼", brand: "셀루틴", price: 26500, volumeMl: 30, actualPosition: 6 },
  { ingredientId: "adenosine", name: "젠틀 리프팅 세럼", brand: "선한피부", price: 9900, volumeMl: 20, actualPosition: 24 },
  { ingredientId: "adenosine", name: "프리미엄 리제너레이팅 세럼", brand: "더마웍스", price: 34500, volumeMl: 30, actualPosition: 5 },

  // 펩타이드 (기준위치 12)
  { ingredientId: "peptide", name: "콜라겐 부스트 세럼", brand: "더마웍스", price: 22000, volumeMl: 30, actualPosition: 7 },
  { ingredientId: "peptide", name: "펩타이드 파워 앰플", brand: "글로우랩", price: 29800, volumeMl: 30, actualPosition: 5 },
  { ingredientId: "peptide", name: "탄탄 세럼", brand: "바른결", price: 14500, volumeMl: 25, actualPosition: 13 },
  { ingredientId: "peptide", name: "퍼밍 데일리 세럼", brand: "데일리핏", price: 8900, volumeMl: 20, actualPosition: 20 },
  { ingredientId: "peptide", name: "럭셔리 펩타이드 컴플렉스", brand: "셀루틴", price: 36000, volumeMl: 30, actualPosition: 4 },

  // 비타민C (기준위치 10)
  { ingredientId: "vitaminc", name: "브라이트닝 비타C 세럼", brand: "글로우랩", price: 16500, volumeMl: 30, actualPosition: 5 },
  { ingredientId: "vitaminc", name: "퓨어 비타민 세럼", brand: "바이옴", price: 11200, volumeMl: 20, actualPosition: 9 },
  { ingredientId: "vitaminc", name: "래디언스 앰플", brand: "셀루틴", price: 27900, volumeMl: 30, actualPosition: 3 },
  { ingredientId: "vitaminc", name: "선샤인 톤업 세럼", brand: "선한피부", price: 9800, volumeMl: 15, actualPosition: 18 },
  { ingredientId: "vitaminc", name: "골드 비타C 앰플", brand: "더마웍스", price: 32500, volumeMl: 30, actualPosition: 4 },

  // 나이아신아마이드 (기준위치 7)
  { ingredientId: "niacinamide", name: "톤클리어 세럼", brand: "포어리스", price: 12900, volumeMl: 30, actualPosition: 3 },
  { ingredientId: "niacinamide", name: "나이아신 10 세럼", brand: "데일리핏", price: 8500, volumeMl: 30, actualPosition: 5 },
  { ingredientId: "niacinamide", name: "듀얼케어 세럼", brand: "바른결", price: 19500, volumeMl: 30, actualPosition: 2 },
  { ingredientId: "niacinamide", name: "모공타이트 세럼", brand: "선한피부", price: 6900, volumeMl: 20, actualPosition: 12 },
  { ingredientId: "niacinamide", name: "프로 브라이트닝 세럼", brand: "셀루틴", price: 31000, volumeMl: 30, actualPosition: 2 },

  // 알부틴 (기준위치 15)
  { ingredientId: "arbutin", name: "화이트닝 세럼", brand: "글로우랩", price: 18900, volumeMl: 30, actualPosition: 8 },
  { ingredientId: "arbutin", name: "클리어톤 세럼", brand: "바이옴", price: 13500, volumeMl: 25, actualPosition: 13 },
  { ingredientId: "arbutin", name: "브라이트 스팟 앰플", brand: "셀루틴", price: 24500, volumeMl: 30, actualPosition: 6 },
  { ingredientId: "arbutin", name: "화이트 럭스 세럼", brand: "글로우랩", price: 33000, volumeMl: 30, actualPosition: 4 },

  // 히알루론산 (기준위치 20)
  { ingredientId: "hyaluronic", name: "수분폭탄 세럼", brand: "모이스처리", price: 10900, volumeMl: 50, actualPosition: 6 },
  { ingredientId: "hyaluronic", name: "히알루론 5중 세럼", brand: "데일리핏", price: 8900, volumeMl: 30, actualPosition: 9 },
  { ingredientId: "hyaluronic", name: "딥 하이드레이션 앰플", brand: "글로우랩", price: 21000, volumeMl: 50, actualPosition: 4 },
  { ingredientId: "hyaluronic", name: "촉촉 세럼", brand: "선한피부", price: 6500, volumeMl: 20, actualPosition: 28 },
  { ingredientId: "hyaluronic", name: "5D 하이드라 부스터", brand: "더마웍스", price: 33500, volumeMl: 50, actualPosition: 3 },

  // 세라마이드엔피 (기준위치 25)
  { ingredientId: "ceramide", name: "베리어 리페어 세럼", brand: "더마웍스", price: 23500, volumeMl: 30, actualPosition: 10 },
  { ingredientId: "ceramide", name: "세라마이드 크림세럼", brand: "모이스처리", price: 15800, volumeMl: 30, actualPosition: 18 },
  { ingredientId: "ceramide", name: "장벽튼튼 세럼", brand: "바른결", price: 12200, volumeMl: 25, actualPosition: 22 },
  { ingredientId: "ceramide", name: "세라마이드 인텐시브 세럼", brand: "셀루틴", price: 35000, volumeMl: 30, actualPosition: 8 },

  // 판테놀 (기준위치 12)
  { ingredientId: "panthenol", name: "판테놀 진정 세럼", brand: "선한피부", price: 9500, volumeMl: 30, actualPosition: 5 },
  { ingredientId: "panthenol", name: "카밍 리페어 세럼", brand: "모이스처리", price: 14200, volumeMl: 30, actualPosition: 8 },
  { ingredientId: "panthenol", name: "판텐 부스터 앰플", brand: "글로우랩", price: 19800, volumeMl: 30, actualPosition: 4 },
  { ingredientId: "panthenol", name: "울트라 카밍 세럼", brand: "더마웍스", price: 30500, volumeMl: 30, actualPosition: 3 },

  // 살리실산 (기준위치 15)
  { ingredientId: "salicylic", name: "클리어 살리실 세럼", brand: "포어리스", price: 11800, volumeMl: 30, actualPosition: 7 },
  { ingredientId: "salicylic", name: "BHA 트러블 세럼", brand: "데일리핏", price: 8200, volumeMl: 20, actualPosition: 11 },
  { ingredientId: "salicylic", name: "퓨리파잉 세럼", brand: "바이옴", price: 16900, volumeMl: 30, actualPosition: 5 },
  { ingredientId: "salicylic", name: "클리닉 BHA 인텐시브", brand: "셀루틴", price: 31500, volumeMl: 30, actualPosition: 4 },

  // 병풀추출물 (기준위치 10)
  { ingredientId: "centella", name: "시카 진정 세럼", brand: "선한피부", price: 10500, volumeMl: 30, actualPosition: 4 },
  { ingredientId: "centella", name: "리페어 시카 앰플", brand: "더마웍스", price: 17500, volumeMl: 30, actualPosition: 3 },
  { ingredientId: "centella", name: "그린 밸런스 세럼", brand: "바이옴", price: 7900, volumeMl: 20, actualPosition: 9 },
  { ingredientId: "centella", name: "마다카 인텐시브 리페어", brand: "더마웍스", price: 32000, volumeMl: 30, actualPosition: 2 },
];

export const products: Product[] = rows.map((row, idx) => ({
  id: `${row.ingredientId}-${idx}`,
  name: row.name,
  brand: row.brand,
  price: row.price,
  volumeMl: row.volumeMl,
  ingredientId: row.ingredientId,
  actualPosition: row.actualPosition,
  // 더미 제품이라 실제 상품 페이지가 없어서, 쿠팡 검색 결과로 연결합니다.
  // 실제 제품 DB 연동 시엔 각 제품의 실제 구매 링크로 교체해주세요.
  purchaseUrl: `https://www.coupang.com/np/search?q=${encodeURIComponent(`${row.brand} ${row.name}`)}`,
  imageColor: colors[idx % colors.length],
}));

export function getProductsForIngredient(ingredientId: string): Product[] {
  return products.filter((p) => p.ingredientId === ingredientId);
}
