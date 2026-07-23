-- ============================================================================
-- 성분핏(IngredientFit) 목표 Supabase 스키마
-- ============================================================================
-- 지금은 이 SQL 실제로 실행 안 됨(더미 데이터 프로토타입 단계).
-- Supabase 실제 연동 시 이 파일 기준으로 테이블 만들면, 지금 화면에서 쓰는
-- 타입(types/index.ts)이나 계산 로직(lib/scoring/calculator.ts)을
-- 거의 그대로 재사용할 수 있게 설계함
--
-- 지금 lib/products.ts 더미 데이터는 "제품 하나당 핵심 성분 하나"로 단순화돼
-- 있는데, 실제론 화장품 하나에 성분 수십 개 들어있고 각 성분마다 배치 순번이
-- 다름. 그래서 products와 ingredients는 1:1이 아니라 다대다(N:M)이고,
-- 그 관계를 표현하는 게 product_ingredients임. 이 스키마는 그 실제 구조
-- 기준으로 짬. 나중에 진짜 데이터 넣을 때 이 구조 따라가면 됨
-- ============================================================================

-- 1. ingredients: 성분 마스터 데이터
-- types/index.ts의 Ingredient 인터페이스와 거의 1:1 대응
create table ingredients (
  id text primary key,                 -- 예: 'retinol', 'hyaluronic-acid' (영문 slug, Ingredient.id)
  name text not null,                  -- 예: '레티놀' (Ingredient.name)
  category_key text not null,          -- 'wrinkle' | 'brightening' | 'hydration' | 'pore' | 'texture'
  ref_position integer not null,       -- 기준 위치 (Ingredient.refPosition)
  effect text not null,                -- 효능 설명 (Ingredient.effect)
  caution text not null,               -- 주의사항 (Ingredient.caution)
  good_for text not null,              -- 적합 피부 (Ingredient.goodFor)
  is_recommended boolean default false,-- 카테고리 내 기본 추천 여부 (Ingredient.recommended)
  is_irritant boolean default false,   -- 자극 성분 여부. lib/safety.ts가 이 값으로 순위 조정
  created_at timestamptz default now()
);

-- 2. products: 제품 마스터 데이터
-- types/index.ts의 Product 인터페이스에서 ingredientId/actualPosition만 빠지고
-- (그건 product_ingredients로 옮겨감) 나머지는 거의 그대로임
create table products (
  id text primary key,
  name text not null,
  brand text not null,
  price integer not null,              -- 원 단위
  volume_ml integer not null,
  purchase_url text not null,
  image_url text,                      -- 지금은 image_color(더미 배경색)만 쓰지만
                                        -- 실제 제품 사진 생기면 이 컬럼 추가로 쓰면 됨
  image_color text,                    -- 더미 썸네일용 배경색 (Product.imageColor). 실사진 붙으면 삭제 가능
  created_at timestamptz default now()
);

-- 3. product_ingredients: 제품 × 성분 (다대다 관계 + 배치 점수)
-- 팀 메모의 "pre-calculated placement_score"가 이거임. 전성분 텍스트 파싱은
-- 데이터 입력 시점에 한 번만 하고, 결과(실제 배치 순번 → 배치 점수)를
-- 미리 계산해서 저장함. 조회할 때 매번 파싱 안 해도 됨
create table product_ingredients (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  ingredient_id text not null references ingredients(id) on delete cascade,
  actual_position integer not null,    -- 베이스 성분 포함, 전체 전성분 리스트 기준 실제 순번
  placement_score integer not null,    -- ref_position 대비 actual_position으로 미리 계산해둔 점수(0~100)
  unique (product_id, ingredient_id)
);
create index idx_product_ingredients_ingredient on product_ingredients(ingredient_id);

-- 4. skin_analyses: 사용자 상담/분석 기록
-- 로드맵의 "로그인 · 상담 내역 저장" 기능 붙을 때 쓰는 테이블.
-- 지금은 로그인 없어서 이 테이블도 아직 안 쓰임
create table skin_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  concern_text text not null,          -- 사용자가 입력한 원문 ("눈가 주름이 고민이에요")
  category_key text not null,
  ingredient_id text references ingredients(id),
  budget_id text,
  skin_base_type text,                 -- 그때 피부타입 프로필 (dry/oily/combination)
  skin_sensitive boolean,              -- 민감성 여부
  recommended_product_ids text[],      -- TOP3 제품 id 배열
  created_at timestamptz default now()
);
create index idx_skin_analyses_user on skin_analyses(user_id);

-- 5. recommendation_feedback: 추천 결과에 대한 사용자 피드백
-- Gao 2021 대화형 추천 서베이의 "인터랙티브 추천"에서 각 추천 뒤에 오는
-- feedback signal(만족/불만족)을 저장하는 테이블. 지금은 미적용 청사진이고,
-- 실제로는 프론트에서 localStorage로 먼저 수집한 뒤 로그인 붙으면 여기로 옮김.
-- 사용자가 쌓이면 "이 성분+피부타입 조합의 만족도" 전역 신호로 집계해서
-- 추천 알고리즘 개선에 씀 (지금은 개인별 재순위까지만 설계)
create table recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,  -- 비로그인은 null
  session_key text,                    -- 비로그인 익명 id (localStorage 발급)
  category_key text not null,
  ingredient_id text references ingredients(id),
  budget_id text,
  product_id text,                     -- 어떤 제품 추천에 대한 평가인지
  skin_base_type text,                 -- 그때 프로필 (dry/oily/combination)
  skin_sensitive boolean,
  satisfied boolean not null,          -- 👍 true / 👎 false
  created_at timestamptz default now()
);
create index idx_feedback_user on recommendation_feedback(user_id);
create index idx_feedback_ingredient on recommendation_feedback(ingredient_id);

-- ============================================================================
-- 6. Row Level Security (RLS)
-- ============================================================================
-- anon key는 NEXT_PUBLIC_ 환경변수라 브라우저에 그대로 노출됨. RLS 없으면
-- 그 키만으로 누구나 모든 테이블 읽고 "쓰고 지울 수" 있어서, 테이블 만들 때
-- 반드시 아래 정책 같이 적용해야 함
--
-- 원칙:
--  - 카탈로그 테이블(ingredients/products/product_ingredients): 누구나 읽기만 가능.
--    쓰기 정책을 아예 안 만들면 anon/authenticated의 insert/update/delete는
--    전부 거부됨. 데이터 입력은 service role 키(RLS 우회, 서버 전용)로만 함
--  - skin_analyses / recommendation_feedback: 본인(auth.uid() = user_id) 기록만 조회/저장

alter table ingredients enable row level security;
alter table products enable row level security;
alter table product_ingredients enable row level security;
alter table skin_analyses enable row level security;
alter table recommendation_feedback enable row level security;

create policy "ingredients_public_read"
  on ingredients for select
  using (true);

create policy "products_public_read"
  on products for select
  using (true);

create policy "product_ingredients_public_read"
  on product_ingredients for select
  using (true);

create policy "skin_analyses_owner_select"
  on skin_analyses for select
  using (auth.uid() = user_id);

create policy "skin_analyses_owner_insert"
  on skin_analyses for insert
  with check (auth.uid() = user_id);

create policy "feedback_owner_select"
  on recommendation_feedback for select
  using (auth.uid() = user_id);

create policy "feedback_owner_insert"
  on recommendation_feedback for insert
  with check (auth.uid() = user_id);

-- ============================================================================
-- 조회 시 자주 쓸 쿼리 예시 (lib/scoring/calculator.ts의 scoreProducts()가
-- 지금 더미 데이터로 하는 일을 Supabase 버전으로 옮기면 이런 모양 됨)
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
-- 이 결과를 lib/scoring/calculator.ts의 scoreProducts()에 그대로 넘기면
-- ml당 가격 점수·예산 점수 계산 로직은 손댈 필요 없음 (그 부분은
-- DB 데이터가 아니라 순수 계산 로직이라서)
