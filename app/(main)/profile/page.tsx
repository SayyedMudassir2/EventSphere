// C:\Users\Alpha\event-sphere\app\(main)\profile\page.tsx
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Calendar, UserCircle } from "lucide-react";
import EditProfileForm from "@/app/components/EditProfileForm";

// Define strict types for our Supabase query returns
interface BookingWithEvent {
  id: string;
  events: {
    title: string;
    event_date: string;
  } | null;
}

interface ProfileData {
  id: string;
  full_name: string | null;
  bio: string | null;
  role: string | null;
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to sign-in if no active session
  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  // Fetch both profile and bookings in parallel to eliminate waterfalls
  const [profileRes, bookingsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, bio, role")
      .eq("id", userId)
      .single(),
    supabase
      .from("bookings")
      .select(
        `
        id,
        events (
          title,
          event_date
        )
      `,
      )
      .eq("user_id", userId),
  ]);

  // Cast responses to our explicit types
  const profile = profileRes.data as ProfileData | null;
  const bookings = bookingsRes.data as BookingWithEvent[] | null;

  const user = session.user;

  // Use full name if available, otherwise fall back to email initial or a generic placeholder
  const avatarLetter = profile?.full_name
    ? profile.full_name[0].toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        {/* User Identification Section */}
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-zinc-800">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shrink-0">
            {avatarLetter}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {profile?.full_name || "Guest User"}
            </h2>
            <p className="text-zinc-400 text-sm">{user.email}</p>
            <div className="text-zinc-300 text-sm mt-3 bg-zinc-800/30 border border-zinc-800 p-3 rounded-xl max-w-xl">
              <span className="text-xs text-zinc-500 block uppercase tracking-wider mb-1">
                Bio
              </span>
              {profile?.bio || "No bio added yet."}
            </div>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 flex items-center gap-3">
              <UserCircle className="w-5 h-5 text-indigo-400" />
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider block">
                  Role
                </label>
                <p className="text-white font-medium capitalize mt-0.5">
                  {profile?.role || "User"}
                </p>
              </div>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider block">
                User ID
              </label>
              <p className="text-white text-xs mt-1.5 font-mono opacity-60 truncate">
                {user.id}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings Display section */}
        <div className="mt-8 pt-8 border-t border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            My Bookings
          </h3>

          {bookings && bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-zinc-800/30 border border-zinc-800/80 rounded-xl p-4 flex justify-between items-center hover:border-zinc-700 transition"
                >
                  <span className="text-white font-medium">
                    {b.events?.title || "Untitled Event"}
                  </span>
                  <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700/50">
                    {b.events?.event_date || "No date set"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm italic py-2">
              No bookings found.
            </p>
          )}
        </div>

        {/* Interactive Profile Form Container */}
        <div className="mt-8 pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm mb-4 text-center">
            Need to update your account information, profile name, or biography?
          </p>
          <EditProfileForm profile={profile} />
        </div>
      </div>
    </main>
  );
}
