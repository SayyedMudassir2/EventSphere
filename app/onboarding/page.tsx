"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

// Updated type to reflect your explicit roles
type UserRole = "admin" | "organizer" | "attendee" | string;

// Updated routing logic based on your requirements
function getDashboardPath(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "organizer") return "/organizer";
  return "/attendee"; // Fallback default for 'attendee' or undefined roles
}

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // Check onboarding status on mount
  useEffect(() => {
    async function checkOnboardingStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        // If they already have a full_name, they've finished onboarding!
        if (profile?.full_name) {
          const role = user.user_metadata?.role as UserRole;
          router.push(getDashboardPath(role));
          return;
        }
      }
      setCheckingStatus(false);
    }

    checkOnboardingStatus();
  }, [supabase, router]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: formData.get("full_name"),
        bio: formData.get("bio"),
        avatar_url: formData.get("avatar_url"),
      });

      if (!error) {
        const role = user.user_metadata?.role as UserRole;
        router.push(getDashboardPath(role));
      }
    }
    setLoading(false);
  }

  // Prevent flash of form content while redirecting existing users
  if (checkingStatus) {
    return (
      <main className="max-w-md mx-auto py-20 px-6 text-center text-white">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Complete your profile
      </h1>
      <form action={handleSubmit} className="space-y-4">
        <input
          name="full_name"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
          required
        />
        <textarea
          name="bio"
          placeholder="Tell us about yourself..."
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
        />
        <input
          name="avatar_url"
          placeholder="Avatar URL (optional)"
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
        />
        <button
          disabled={loading}
          className="w-full bg-indigo-600 p-3 rounded-lg font-bold text-white"
        >
          {loading ? "Saving..." : "Get Started"}
        </button>
      </form>
    </main>
  );
}
