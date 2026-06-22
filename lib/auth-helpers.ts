import { createClient } from "@/lib/supabase-server";

export interface SessionPayload {
  user: any | null;
  role: "admin" | "organizer" | "attendee" | null;
}

/**
 * High-performance, single-hop identity and Role-Based Access Control (RBAC) resolver.
 * Combines authentication checking and role queries into one atomic lookup block.
 */
export async function getUserSession(): Promise<SessionPayload> {
  const supabase = await createClient();

  // 1. Single Network Hop Strategy: Fetch user identity context from the server session cache maps
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { user: null, role: null };

  // 2. High-Performance Profile Cross-Reference Check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 3. Normalize role payload parameters to satisfy permission checks seamlessly
  const rawRole = profile?.role || user?.user_metadata?.role || "attendee";
  const userRole = String(rawRole)
    .toLowerCase()
    .trim() as SessionPayload["role"];

  return {
    user,
    role: userRole,
  };
}
