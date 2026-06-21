// app/(dashboard)/organizer/page.tsx
import { createClient } from "@/lib/supabase-server";
import { deleteEventAction } from "@/app/actions/events";
import Link from "next/link";

export default async function OrganizerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔍 Debugging: Log Current Organizer ID to terminal
  console.log("DEBUG: Current Organizer ID:", user?.id);

  // Fetch only this organizer's events
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user?.id)
    .order("event_date", { ascending: true });

  // 🔍 Debugging: Log Database Response or Error
  if (error) console.error("DEBUG: Database Error:", error);
  console.log("DEBUG: Found Events:", events);

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading events: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      {/* Dynamic Events List */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Events</h1>
          <Link
            href="/organizer/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Create New Event
          </Link>
        </div>

        {!events || events.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500">You haven't created any events yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-zinc-800 p-6 rounded-xl shadow-sm bg-zinc-900 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {event.title}
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    {event.location || "No Location Specified"} •{" "}
                    {event.event_date
                      ? new Date(event.event_date).toLocaleString()
                      : "Date TBD"}
                  </p>
                  <div className="mt-3">
                    <span className="bg-indigo-950 text-indigo-400 px-2 py-1 rounded text-xs font-medium border border-indigo-900">
                      {event.category || "General"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/organizer/edit/${event.id}`}
                    className="text-zinc-400 hover:text-indigo-400 font-medium transition"
                  >
                    Edit
                  </Link>

                  {/* Server Action pattern for mapping loop execution safety */}
                  <form action={deleteEventAction}>
                    <input type="hidden" name="eventId" value={event.id} />
                    <button
                      type="submit"
                      className="text-red-400 hover:text-red-500 font-medium transition"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
