import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Supabase 클라이언트를 가져옵니다.
 * .env.local에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY가
 * 설정되기 전까지는 null을 반환하므로, 호출하는 쪽에서 반드시 null 체크 후
 * 더미 데이터(lib/products.ts)로 폴백하도록 되어 있습니다.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않아 더미 데이터로 동작합니다."
      );
    }
    return null;
  }
  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
