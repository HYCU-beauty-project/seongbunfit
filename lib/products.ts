import type { Product } from '@/types';
import { getSupabaseClient } from '@/lib/supabase/client';

// ============================================================================
// ⚠️ 아래 products는 Supabase 연결 실패 시 폴백용으로만 남겨둡니다.
// 실제 데이터는 Supabase의 products / product_ingredients 테이블에서 옵니다.
// ============================================================================

const colors = ['#EDE9FB', '#F5EEE6', '#E8F1EC', '#F1E9EC', '#EAF0F5', '#F6F1E4'];

interface Row {
    ingredientId: string;
    name: string;
    brand: string;
    price: number;
    volumeMl: number;
    actualPosition: number;
}

const rows: Row[] = [
    {
        ingredientId: 'retinol',
        name: '리제너 나이트 세럼',
        brand: '셀루틴',
        price: 19800,
        volumeMl: 30,
        actualPosition: 4,
    },
    {
        ingredientId: 'retinol',
        name: '타임리페어 세럼',
        brand: '더마웍스',
        price: 24000,
        volumeMl: 30,
        actualPosition: 10,
    },
    {
        ingredientId: 'retinol',
        name: '퍼스트 레티놀 세럼',
        brand: '바른결',
        price: 15900,
        volumeMl: 20,
        actualPosition: 8,
    },
    {
        ingredientId: 'retinol',
        name: '프리미엄 리뉴얼 앰플',
        brand: '글로우랩',
        price: 38000,
        volumeMl: 30,
        actualPosition: 3,
    },
    {
        ingredientId: 'retinol',
        name: '슬로우에이징 세럼',
        brand: '포어리스',
        price: 12500,
        volumeMl: 15,
        actualPosition: 22,
    },
    {
        ingredientId: 'adenosine',
        name: '리프트 케어 세럼',
        brand: '바이옴',
        price: 17800,
        volumeMl: 30,
        actualPosition: 9,
    },
    {
        ingredientId: 'adenosine',
        name: '탄력 부스팅 세럼',
        brand: '데일리핏',
        price: 13200,
        volumeMl: 25,
        actualPosition: 14,
    },
    {
        ingredientId: 'adenosine',
        name: '웰에이징 세럼',
        brand: '셀루틴',
        price: 26500,
        volumeMl: 30,
        actualPosition: 6,
    },
    {
        ingredientId: 'adenosine',
        name: '젠틀 리프팅 세럼',
        brand: '선한피부',
        price: 9900,
        volumeMl: 20,
        actualPosition: 24,
    },
    {
        ingredientId: 'adenosine',
        name: '프리미엄 리제너레이팅 세럼',
        brand: '더마웍스',
        price: 34500,
        volumeMl: 30,
        actualPosition: 5,
    },
    {
        ingredientId: 'peptide',
        name: '콜라겐 부스트 세럼',
        brand: '더마웍스',
        price: 22000,
        volumeMl: 30,
        actualPosition: 7,
    },
    {
        ingredientId: 'peptide',
        name: '펩타이드 파워 앰플',
        brand: '글로우랩',
        price: 29800,
        volumeMl: 30,
        actualPosition: 5,
    },
    { ingredientId: 'peptide', name: '탄탄 세럼', brand: '바른결', price: 14500, volumeMl: 25, actualPosition: 13 },
    {
        ingredientId: 'peptide',
        name: '퍼밍 데일리 세럼',
        brand: '데일리핏',
        price: 8900,
        volumeMl: 20,
        actualPosition: 20,
    },
    {
        ingredientId: 'peptide',
        name: '럭셔리 펩타이드 컴플렉스',
        brand: '셀루틴',
        price: 36000,
        volumeMl: 30,
        actualPosition: 4,
    },
    {
        ingredientId: 'vitaminc',
        name: '브라이트닝 비타C 세럼',
        brand: '글로우랩',
        price: 16500,
        volumeMl: 30,
        actualPosition: 5,
    },
    {
        ingredientId: 'vitaminc',
        name: '퓨어 비타민 세럼',
        brand: '바이옴',
        price: 11200,
        volumeMl: 20,
        actualPosition: 9,
    },
    { ingredientId: 'vitaminc', name: '래디언스 앰플', brand: '셀루틴', price: 27900, volumeMl: 30, actualPosition: 3 },
    {
        ingredientId: 'vitaminc',
        name: '선샤인 톤업 세럼',
        brand: '선한피부',
        price: 9800,
        volumeMl: 15,
        actualPosition: 18,
    },
    {
        ingredientId: 'vitaminc',
        name: '골드 비타C 앰플',
        brand: '더마웍스',
        price: 32500,
        volumeMl: 30,
        actualPosition: 4,
    },
    {
        ingredientId: 'niacinamide',
        name: '톤클리어 세럼',
        brand: '포어리스',
        price: 12900,
        volumeMl: 30,
        actualPosition: 3,
    },
    {
        ingredientId: 'niacinamide',
        name: '나이아신 10 세럼',
        brand: '데일리핏',
        price: 8500,
        volumeMl: 30,
        actualPosition: 5,
    },
    {
        ingredientId: 'niacinamide',
        name: '듀얼케어 세럼',
        brand: '바른결',
        price: 19500,
        volumeMl: 30,
        actualPosition: 2,
    },
    {
        ingredientId: 'niacinamide',
        name: '모공타이트 세럼',
        brand: '선한피부',
        price: 6900,
        volumeMl: 20,
        actualPosition: 12,
    },
    {
        ingredientId: 'niacinamide',
        name: '프로 브라이트닝 세럼',
        brand: '셀루틴',
        price: 31000,
        volumeMl: 30,
        actualPosition: 2,
    },
    {
        ingredientId: 'arbutin',
        name: '화이트닝 세럼',
        brand: '글로우랩',
        price: 18900,
        volumeMl: 30,
        actualPosition: 8,
    },
    { ingredientId: 'arbutin', name: '클리어톤 세럼', brand: '바이옴', price: 13500, volumeMl: 25, actualPosition: 13 },
    {
        ingredientId: 'arbutin',
        name: '브라이트 스팟 앰플',
        brand: '셀루틴',
        price: 24500,
        volumeMl: 30,
        actualPosition: 6,
    },
    {
        ingredientId: 'arbutin',
        name: '화이트 럭스 세럼',
        brand: '글로우랩',
        price: 33000,
        volumeMl: 30,
        actualPosition: 4,
    },
    {
        ingredientId: 'hyaluronic',
        name: '수분폭탄 세럼',
        brand: '모이스처리',
        price: 10900,
        volumeMl: 50,
        actualPosition: 6,
    },
    {
        ingredientId: 'hyaluronic',
        name: '히알루론 5중 세럼',
        brand: '데일리핏',
        price: 8900,
        volumeMl: 30,
        actualPosition: 9,
    },
    {
        ingredientId: 'hyaluronic',
        name: '딥 하이드레이션 앰플',
        brand: '글로우랩',
        price: 21000,
        volumeMl: 50,
        actualPosition: 4,
    },
    { ingredientId: 'hyaluronic', name: '촉촉 세럼', brand: '선한피부', price: 6500, volumeMl: 20, actualPosition: 28 },
    {
        ingredientId: 'hyaluronic',
        name: '5D 하이드라 부스터',
        brand: '더마웍스',
        price: 33500,
        volumeMl: 50,
        actualPosition: 3,
    },
    {
        ingredientId: 'ceramide',
        name: '베리어 리페어 세럼',
        brand: '더마웍스',
        price: 23500,
        volumeMl: 30,
        actualPosition: 10,
    },
    {
        ingredientId: 'ceramide',
        name: '세라마이드 크림세럼',
        brand: '모이스처리',
        price: 15800,
        volumeMl: 30,
        actualPosition: 18,
    },
    {
        ingredientId: 'ceramide',
        name: '장벽튼튼 세럼',
        brand: '바른결',
        price: 12200,
        volumeMl: 25,
        actualPosition: 22,
    },
    {
        ingredientId: 'ceramide',
        name: '세라마이드 인텐시브 세럼',
        brand: '셀루틴',
        price: 35000,
        volumeMl: 30,
        actualPosition: 8,
    },
    {
        ingredientId: 'panthenol',
        name: '판테놀 진정 세럼',
        brand: '선한피부',
        price: 9500,
        volumeMl: 30,
        actualPosition: 5,
    },
    {
        ingredientId: 'panthenol',
        name: '카밍 리페어 세럼',
        brand: '모이스처리',
        price: 14200,
        volumeMl: 30,
        actualPosition: 8,
    },
    {
        ingredientId: 'panthenol',
        name: '판텐 부스터 앰플',
        brand: '글로우랩',
        price: 19800,
        volumeMl: 30,
        actualPosition: 4,
    },
    {
        ingredientId: 'panthenol',
        name: '울트라 카밍 세럼',
        brand: '더마웍스',
        price: 30500,
        volumeMl: 30,
        actualPosition: 3,
    },
    {
        ingredientId: 'salicylic',
        name: '클리어 살리실 세럼',
        brand: '포어리스',
        price: 11800,
        volumeMl: 30,
        actualPosition: 7,
    },
    {
        ingredientId: 'salicylic',
        name: 'BHA 트러블 세럼',
        brand: '데일리핏',
        price: 8200,
        volumeMl: 20,
        actualPosition: 11,
    },
    {
        ingredientId: 'salicylic',
        name: '퓨리파잉 세럼',
        brand: '바이옴',
        price: 16900,
        volumeMl: 30,
        actualPosition: 5,
    },
    {
        ingredientId: 'salicylic',
        name: '클리닉 BHA 인텐시브',
        brand: '셀루틴',
        price: 31500,
        volumeMl: 30,
        actualPosition: 4,
    },
    {
        ingredientId: 'centella',
        name: '시카 진정 세럼',
        brand: '선한피부',
        price: 10500,
        volumeMl: 30,
        actualPosition: 4,
    },
    {
        ingredientId: 'centella',
        name: '리페어 시카 앰플',
        brand: '더마웍스',
        price: 17500,
        volumeMl: 30,
        actualPosition: 3,
    },
    {
        ingredientId: 'centella',
        name: '그린 밸런스 세럼',
        brand: '바이옴',
        price: 7900,
        volumeMl: 20,
        actualPosition: 9,
    },
    {
        ingredientId: 'centella',
        name: '마다카 인텐시브 리페어',
        brand: '더마웍스',
        price: 32000,
        volumeMl: 30,
        actualPosition: 2,
    },
];

// components/ProductsContent.tsx 등에서 이 이름으로 import해요 (폴백 데이터).
export const products: Product[] = rows.map((row, idx) => ({
    id: `${row.ingredientId}-${idx}`,
    name: row.name,
    brand: row.brand,
    price: row.price,
    volumeMl: row.volumeMl,
    ingredientId: row.ingredientId,
    actualPosition: row.actualPosition,
    purchaseUrl: `https://www.coupang.com/np/search?q=${encodeURIComponent(`${row.brand} ${row.name}`)}`,
    imageColor: colors[idx % colors.length],
}));

function getMockProductsForIngredient(ingredientId: string): Product[] {
    return products.filter((p) => p.ingredientId === ingredientId);
}

// ============================================================================
// 실제 함수 — Supabase 우선, 실패 시 mock으로 폴백
// ============================================================================

// Supabase에서 product_ingredients ⋈ products 조인 결과로 오는 행의 타입.
interface ProductIngredientRow {
    actual_position: number;
    ingredient_id: string;
    products: {
        id: string;
        name: string;
        brand: string;
        price: number;
        volume_ml: number;
        purchase_url: string;
        image_url: string | null;
        image_color: string | null;
    } | null;
}

const JOIN_SELECT = `
  actual_position,
  ingredient_id,
  products (
    id, name, brand, price, volume_ml, purchase_url, image_url, image_color
  )
`;

// 조인 결과 행들을 Product[] 형태로 변환 (getProductsForIngredient / getAllProducts 공통 사용)
function mapJoinedRows(rows: ProductIngredientRow[]): Product[] {
    return rows
        .filter(
            (row): row is ProductIngredientRow & { products: NonNullable<ProductIngredientRow['products']> } =>
                row.products !== null,
        )
        .map((row) => ({
            id: row.products.id,
            name: row.products.name,
            brand: row.products.brand,
            price: row.products.price,
            volumeMl: row.products.volume_ml,
            ingredientId: row.ingredient_id,
            actualPosition: row.actual_position,
            purchaseUrl: row.products.purchase_url,
            imageColor: row.products.image_color ?? colors[0],
        }));
}

/**
 * 특정 성분을 포함한 제품 목록을 가져옵니다. (AI 추천 흐름에서 사용)
 * ⚠️ 비동기입니다. 호출하는 쪽(lib/scoring/calculator.ts의 getTop3 등)에서 반드시 await 해주세요.
 */
export async function getProductsForIngredient(ingredientId: string): Promise<Product[]> {
    const supabase = getSupabaseClient();

    if (!supabase) {
        return getMockProductsForIngredient(ingredientId);
    }

    const { data, error } = await supabase
        .from('product_ingredients')
        .select(JOIN_SELECT)
        .eq('ingredient_id', ingredientId)
        .returns<ProductIngredientRow[]>();

    if (error || !data) {
        console.error('[products] Supabase 조회 실패, 더미 데이터로 폴백합니다:', error?.message);
        return getMockProductsForIngredient(ingredientId);
    }

    return mapJoinedRows(data);
}

/**
 * 전체 제품 목록을 가져옵니다. (제품 전체보기 페이지 — components/ProductsContent.tsx 용)
 * ⚠️ 서버 컴포넌트(예: app/products/page.tsx)에서 호출해서, 결과를
 * ProductsContent에 props로 내려주는 방식으로 써주세요. 클라이언트 컴포넌트
 * 최상단에서 직접 호출하면 안 돼요 (비동기라서요).
 */
export async function getAllProducts(): Promise<Product[]> {
    const supabase = getSupabaseClient();

    if (!supabase) {
        return products;
    }

    const { data, error } = await supabase
        .from('product_ingredients')
        .select(JOIN_SELECT)
        .returns<ProductIngredientRow[]>();

    if (error || !data) {
        console.error('[products] getAllProducts Supabase 조회 실패, 더미 데이터로 폴백합니다:', error?.message);
        return products;
    }

    return mapJoinedRows(data);
}
