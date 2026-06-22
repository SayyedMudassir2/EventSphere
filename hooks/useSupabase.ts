import { createBrowserClient } from "@supabase/ssr";

// Module-scoped state variable to securely cache the client instance across components
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

/**
 * High-performance, zero-overhead browser client wrapper.
 * Implements a strict memoized Singleton Pattern to optimize memory buffers
 * and protect active multi-component subscriber channels from connection teardowns.
 */
export function useSupabase() {
  // Safe fail-safe parameter assertion guards
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "SUPABASE_HOOK_FAULT: Environment tokens NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.",
    );
  }

  // Synchronous extraction initialization gate fallback path
  if (!clientInstance) {
    clientInstance = createBrowserClient(supabaseUrl, supabaseKey);
  }

  return clientInstance;
}
