// app/actions/auth.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getDashboardPath, UserRole } from "@/lib/auth-utils";

export async function signUpAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });

  if (error) return { error: error.message };

  redirect(getDashboardPath(role));
}

export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);

  const role = data.user.user_metadata?.role as UserRole;
  redirect(getDashboardPath(role));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export async function refreshUserSessionCookie() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) {
    // 1. Fetch your source-of-truth profile role directly from the database table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role) {
      // 2. Force rewrite the metadata directly inside the encrypted auth cookie session
      // This synchronizes your edge middleware instantly, clearing out redirect loops
      await supabase.auth.updateUser({
        data: { role: profile.role },
      });
    }
  }
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
