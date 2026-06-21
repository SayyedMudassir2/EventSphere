// lib/supabase-middleware.ts
import { createClient } from "@supabase/supabase-js";

// This client is for Edge/Middleware. It does NOT use cookies or auth()
export const supabaseMiddleware = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
