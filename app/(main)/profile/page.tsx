import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

// Define the shape of your query return data
interface BookingWithEvent {
  id: string;
  events: {
    title: string;
    event_date: string;
  } | null;
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Force cast the data return using "as BookingWithEvent[] | null"
  const { data: bookings } = (await supabase
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
    .eq("user_id", session.user.id)) as { data: BookingWithEvent[] | null };

  const user = session.user;

  return (
    <main className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
            {user.email?.[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Account Details</h2>
            <p className="text-zinc-400">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">
                Role
              </label>
              <p className="text-white font-medium capitalize mt-1">
                {/* Add logic to fetch role */ "User"}
              </p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">
                User ID
              </label>
              <p className="text-white text-xs mt-2 font-mono opacity-60 truncate">
                {user.id}
              </p>
            </div>
          </div>
        </div>

        {/* Display Bookings */}
        <div className="mt-8 pt-8 border-t border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4">My Bookings</h3>
          {bookings && bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-zinc-800/30 border border-zinc-800/80 rounded-xl p-4 flex justify-between items-center"
                >
                  <span className="text-white font-medium">
                    {b.events?.title || "Untitled Event"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {b.events?.event_date || "No date set"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm italic">No bookings found.</p>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm mb-4">
            Want to add more details like Name or Bio?
          </p>
          <button className="text-indigo-400 hover:text-indigo-300 font-medium">
            Complete your profile
          </button>
        </div>
      </div>
    </main>
  );
}
