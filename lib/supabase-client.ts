import { createBrowserClient } from "@supabase/ssr";

// 1. Standard function export (used inside regular utilities or older components)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// 2. React Hook export (if you prefer using the custom hook style elsewhere)
export const useSupabase = () => {
  return createClient();
};
