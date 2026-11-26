import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'dwxehuzgekdmkvqmmtok';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL?.trim() ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Read the scoped public browser key from Vite environment variables (Settings -> Secrets).
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_API_KEY?.trim() ||
  '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && supabasePublishableKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export function getSupabaseClient(): SupabaseClient | null {
  return supabase;
}

export default supabase;
