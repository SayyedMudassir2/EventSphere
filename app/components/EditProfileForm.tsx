// C:\Users\Alpha\event-sphere\app\(main)\profile\EditProfileForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client"; // Adjust this import based on your client helper location
import { Edit3, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileData {
  id: string;
  full_name: string | null;
  bio: string | null;
  role: string | null;
}

export default function EditProfileForm({
  profile,
}: {
  profile: ProfileData | null;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form Field States
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setLoading(true);
    setMessage(null);

    try {
      // Direct update using the supabase-client instance
      const supabase = createClient();

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          bio: bio.trim() || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Refresh the current server page layout to update the main profile display values
      router.refresh();

      // Close the form panel after a brief moment to show the success state
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1500);
    } catch (error: any) {
      console.error("Error saving profile changes:", error);
      setMessage({
        type: "error",
        text: error?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Static button state shown when editing is closed
  if (!isOpen) {
    return (
      <div className="text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-2 text-sm border border-indigo-500/20 bg-indigo-500/5 px-4 py-2 rounded-xl transition hover:bg-indigo-500/10 mx-auto"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile Details
        </button>
      </div>
    );
  }

  // Active form panel state
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-800/20 border border-zinc-800/80 p-6 rounded-xl space-y-4 max-w-xl mx-auto text-left transition-all duration-200"
    >
      <h4 className="text-white font-semibold text-base">Update Information</h4>

      {/* Dynamic Feedback Messaging */}
      {message && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 text-sm border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Full Name Input Field */}
      <div>
        <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          placeholder="e.g. Alex Carter"
        />
      </div>

      {/* Biography Input Field */}
      <div>
        <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={loading}
          rows={3}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition resize-none disabled:opacity-50"
          placeholder="Tell something about yourself..."
          maxLength={300}
        />
        <span className="text-[10px] text-zinc-600 block text-right mt-1">
          {bio.length}/300 characters
        </span>
      </div>

      {/* Actions Controls Block */}
      <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800/60">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setMessage(null);
            // Revert changes back to original database properties
            setFullName(profile?.full_name || "");
            setBio(profile?.bio || "");
          }}
          className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition disabled:opacity-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white font-medium text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition select-none disabled:text-zinc-400"
          disabled={
            loading ||
            (fullName === (profile?.full_name || "") &&
              bio === (profile?.bio || ""))
          }
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
