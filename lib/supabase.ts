import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key. Never import this
 * from a client component or expose it to the browser — it bypasses RLS.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("supabaseAdmin: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
