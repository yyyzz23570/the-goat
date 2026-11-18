import type { SupabaseClient } from "@supabase/supabase-js";

// Account services are disabled in this local preview, matching /api/auth/me.
export function getSupabaseBrowserClient(): SupabaseClient | null {
  return null;
}
