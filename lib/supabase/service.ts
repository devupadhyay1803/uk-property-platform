import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Service-role client — BYPASSES RLS. Server-only.
 *
 * NEVER import this into a Client Component or expose the key to the browser.
 * Use only for operations that legitimately cross tenant boundaries, always
 * behind an explicit server-side role check (e.g. verified admin actions,
 * the enquiry-routing Edge Function).
 */
export function createServiceClient() {
  if (typeof window !== "undefined") {
    throw new Error("createServiceClient must never run in the browser");
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
