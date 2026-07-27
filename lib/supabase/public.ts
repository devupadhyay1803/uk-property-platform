import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cookie-less anon client for PUBLIC data (published listings).
 *
 * Because it carries no user session, pages that use it can be statically
 * rendered / ISR'd (SEO + speed, F9/F18) instead of being forced dynamic by
 * cookie access. RLS still applies as the `anon` role, so only published rows
 * are ever returned.
 *
 * Returns null if env is missing (e.g. build with no .env), so callers can
 * degrade gracefully rather than crash the build.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
