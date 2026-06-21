// lib/auth-helpers.ts
import { createClient } from "@/lib/supabase-server";

export async function getUserSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null };

  // Log the User ID from Auth
  // console.log("DEBUG: Auth User ID:", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, id") // Also select the ID
    .eq("id", user.id)
    .single();

  // Log the Profile ID found
  // console.log("DEBUG: Found Profile:", profile);

  return { user, role: profile?.role };
}
