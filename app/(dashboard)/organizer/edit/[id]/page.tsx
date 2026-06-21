import { createClient } from "@/lib/supabase-server";
import { updateEventAction } from "@/app/actions/events";
import { SubmitButton } from "@/app/components/SubmitButton"; // Ensure this matches your SubmitButton location
import Link from "next/link";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Wrapped in Promise for modern Next.js 15+ compatibility
}) {
  // 1. Await dynamic params asynchronously
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔍 DEBUGGING: Confirming variables match correctly inside your terminal console
  console.log("DEBUG: Resolved Event ID for Edit:", id);

  // 2. Securely fetch the event ensuring it belongs ONLY to the logged-in organizer
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("organizer_id", user?.id) // Security boundary enforcement
    .single();

  if (error || !event) {
    console.error("DEBUG: Fetch Error or Unauthorized Access:", error);
    return (
      <main className="max-w-3xl mx-auto py-12 px-6 text-white">
        <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-2xl text-red-400">
          <p className="font-semibold">Event not found or unauthorized.</p>
          <Link
            href="/dashboard/organizer"
            className="text-sm underline mt-2 block hover:text-red-300"
          >
            Return to panel
          </Link>
        </div>
      </main>
    );
  }

  // 3. Bind the event ID to your server action
  const boundUpdateAction = updateEventAction.bind(null, event.id);

  // Helper to slice timestamp accurately into datetime-local standard format (YYYY-MM-DDTHH:MM)
  const formattedDate = event.event_date
    ? new Date(event.event_date).toISOString().slice(0, 16)
    : "";

  return (
    <main className="max-w-3xl mx-auto py-12 px-6 text-white">
      {/* Navigation Breadcrumb */}
      <Link
        href="/organizer"
        className="text-zinc-400 hover:text-white mb-6 inline-flex items-center gap-2 transition group"
      >
        <span className="group-hover:-translate-x-1 transition">&larr;</span>{" "}
        Back to Panel
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-xl mt-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Edit Event: {event.title}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Modify your event specifications below. All updates reflect
            instantly.
          </p>
        </div>

        {/* Form bound securely with event contextual identifier state parameters */}
        <form action={boundUpdateAction} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 block">
              Title
            </label>
            <input
              name="title"
              defaultValue={event.title}
              className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 block">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={event.description}
              className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 block">
                Location
              </label>
              <input
                name="location"
                defaultValue={event.location}
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 block">
                Event Date & Time
              </label>
              <input
                name="event_date"
                type="datetime-local"
                defaultValue={formattedDate}
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition scheme-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 block">
                Price ($)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={event.price}
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 block">
                Seats Available
              </label>
              <input
                name="seats_available"
                type="number"
                min="1"
                defaultValue={event.seats_available || event.max_seats}
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 block">
              Category
            </label>
            <select
              name="category"
              defaultValue={event.category}
              className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-zinc-300 focus:outline-none focus:border-zinc-700 transition"
            >
              <option value="music">Music</option>
              <option value="tech">Tech</option>
              <option value="workshop">Workshop</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 block">
              Banner Image URL
            </label>
            <input
              name="image_url"
              defaultValue={event.image_url}
              placeholder="https://unsplash.com..."
              className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
            />
          </div>

          <div className="pt-2">
            {/* ✅ Embedded custom loader element supporting active pending network pipeline requests */}
            <SubmitButton />
          </div>
        </form>
      </div>
    </main>
  );
}
