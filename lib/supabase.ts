import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAnonClient: SupabaseClient | null = null;
let cachedServerClient: SupabaseClient | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

/**
 * Client for use in the browser (publishable anon key).
 * Uses:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function getSupabaseAnonClient(): SupabaseClient {
  if (cachedAnonClient) return cachedAnonClient;

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  cachedAnonClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return cachedAnonClient;
}

/**
 * Server-side client. Uses the service role key when available; otherwise falls back to anon.
 * Uses:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (optional)
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY (fallback)
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (cachedServerClient) return cachedServerClient;

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  cachedServerClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return cachedServerClient;
}

