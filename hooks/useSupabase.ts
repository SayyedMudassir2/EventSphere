import { createBrowserClient } from "@supabase/ssr";

export const useSupabase = () => {
  // Configured automatically to track cookie sessions out-of-the-box
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return supabase;
};
