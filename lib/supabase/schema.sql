-- ============================================================================
-- 성분핏(IngredientFit) — 목표 Supabase 스키마
-- ============================================================================
-- 지금은 이 SQL이 실제로 실행되고 있지 않아요(더미 데이터 프로토타입 단계).
-- Supabase를 실제로 연동할 때 이 파일을 기준으로 테이블을 만들면, 지금 화면에서
-- 쓰고 있는 타입(types/index.ts)이나 계산 로직(lib/scoring/calculator.ts)을
-- 거의 그대로 재사용할 수 있도록 설계해뒀어요.
--
-- ⚠️ 지금 lib/products.ts의 더미 데이터는 "제품 하나당 핵심 성분 하나"로
-- 단순화되어 있는데, 실제로는 화장품 하나에 성분이 수십 개 들어있고 각 성분마다
-- 배치 순번이 달라요. 그래서 products와 ingredients는 1:1이 아니라 다대다(N:M)
-- 관계이고, 그 관계를 표현하는 게 product_ingredients예요. 이 스키마는 그 실제
-- 구조를 기준으로 짰어요 — 나중에 진짜 데이터를 넣을 때 이 구조를 따라가시면 돼요.
-- ============================================================================

-- 1. ingredients — 성분 마스터 데이터
-- types/index.ts의 Ingredient 인터페이스와 거의 1:1로 대응돼요.
create table ingredients (
  id text primary key,                 -- 예: 'retinol', 'hyaluronic-acid' (영문 slug, Ingredient.id)
  name text not null,                  -- 예: '레티놀' (Ingredient.name)
  category_key text not null,          -- 'wrinkle' | 'brightening' | 'hydration' | 'pore' | 'texture'
  ref_position integer not null,       -- 기준 위치 (Ingredient.refPosition)
  effect text not null,                -- 효능 설명 (Ingredient.effect)
  caution text not null,               -- 주의사항 (Ingredient.caution)
  good_for text not null,              -- 적합 피부 (Ingredient.goodFor)
  is_recommended boolean default false,-- 카테고리 내 기본 추천 여부 (Ingredient.recommended)
  is_irritant boolean default false,   -- 자극 성분 여부 — lib/safety.ts가 이 값으로 순위 조정
  created_at timestamptz default now()
);

-- 2. products — 제품 마스터 데이터
-- types/index.ts의 Product 인터페이스에서 ingredientId/actualPosition은 빠지고
-- (그건 product_ingredients로 옮겨가요), 나머지는 거의 그대로예요.
create table products (
  id text primary key,
  name text not null,
  brand text not null,
  price integer not null,              -- 원 단위
  volume_ml integer not null,
  purchase_url text not null,
  image_url text,                      -- 지금은 image_color(더미 배경색)만 쓰지만,
                                        -- 실제 제품 사진이 생기면 이 컬럼을 추가로 써요.
  image_color text,                    -- 더미 썸네일용 배경색 (Product.imageColor) — 실사진 붙으면 삭제 가능
  created_at timestamptz default now()
);

-- 3. product_ingredients — 제품 × 성분 (다대다 관계 + 배치 점수)
-- 팀 메모에 있던 "pre-calculated placement_score"가 바로 이거예요. 전성분 텍스트
-- 파싱은 데이터 입력 시점에 한 번만 하고, 그 결과(실제 배치 순번 → 배치 점수)를
-- 미리 계산해서 저장해둬요. 조회할 때 매번 파싱하지 않아도 되게요.
create table product_ingredients (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  ingredient_id text not null references ingredients(id) on delete cascade,
  actual_position integer not null,    -- 베이스 성분 포함, 전체 전성분 리스트 기준 실제 순번
  placement_score integer not null,    -- ref_position 대비 actual_position으로 미리 계산해둔 점수(0~100)
  unique (product_id, ingredient_id)
);
create index idx_product_ingredients_ingredient on product_ingredients(ingredient_id);

-- 4. skin_analyses — 사용자 상담/분석 기록
-- 로드맵의 "로그인 · 상담 내역 저장" 기능이 실제로 붙을 때 쓰는 테이블이에요.
-- 지금은 로그인이 없어서 이 테이블도 아직 안 쓰여요.
create table skin_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  concern_text text not null,          -- 사용자가 입력한 원문 ("눈가 주름이 고민이에요")
  category_key text not null,
  ingredient_id text references ingredients(id),
  budget_id text,
  recommended_product_ids text[],      -- TOP3 제품 id 배열
  created_at timestamptz default now()
);
create index idx_skin_analyses_user on skin_analyses(user_id);

-- ============================================================================
-- 조회 시 자주 쓰게 될 쿼리 예시 (lib/scoring/calculator.ts의 scoreProducts()가
-- 지금 더미 데이터로 하는 일을 Supabase 버전으로 옮기면 이런 모양이 돼요)
-- ============================================================================
-- 특정 성분을 포함한 제품 후보 + 배치 점수를 한 번에 가져오기:
--
-- select
--   p.*,
--   pi.actual_position,
--   pi.placement_score
-- from products p
-- join product_ingredients pi on pi.product_id = p.id
-- where pi.ingredient_id = :ingredientId
-- order by pi.placement_score desc;
--
-- 이 결과를 lib/scoring/calculator.ts의 scoreProducts()에 그대로 넘기면,
-- ml당 가격 점수·예산 점수 계산 로직은 손댈 필요 없어요(그 부분은 이미
-- DB 데이터가 아니라 순수 계산 로직이라서요).
