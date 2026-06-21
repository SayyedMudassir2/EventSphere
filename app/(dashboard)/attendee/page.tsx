import { createClient } from "@/lib/supabase-server";
import { getImageUrl } from "@/lib/image-helpers";

export default async function AttendeeDashboard() {
  const supabase = await createClient();

  // Fetch all events
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>

      {!events || events.length === 0 ? (
        <p>No events found at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            // 1. Resolve the URL using your helper
            const imageUrl = getImageUrl(event.image_url);

            return (
              <div
                key={event.id}
                className="border p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* 2. Use the resolved URL here */}
                {event.image_url ? (
                  <img
                    src={imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">
                      No Image
                    </span>
                  </div>
                )}

                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <p>📍 {event.location}</p>
                  <p>📅 {new Date(event.event_date).toLocaleDateString()}</p>
                  <p>🎟️ ${event.price}</p>
                </div>

                <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                  Register Now
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
