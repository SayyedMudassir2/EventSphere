"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const full_name = formData.get("full_name") as string;
  const bio = formData.get("bio") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, bio, updated_at: new Date().toISOString() })
    .eq("id", session.user.id);

  if (error) throw new Error(error.message);

  // Refresh the profile page to show the new data
  revalidatePath("/profile");
  return { success: true };
}
