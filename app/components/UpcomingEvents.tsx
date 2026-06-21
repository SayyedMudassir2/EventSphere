// app/components/UpcomingEvents.tsx
import { createClient } from "@/lib/supabase-server";
import EventCard from "@/app/components/EventCard";
import Link from "next/link";
import { getImageUrl } from "@/lib/image-helpers";

export default async function UpcomingEvents() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3);

  if (error) {
    console.error(
      "DEBUG: Failed to pull upcoming database items:",
      error.message,
    );
  }

  if (!events || events.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1 text-white">
            📅 Upcoming Events
          </h2>
          <p className="text-zinc-400">Don't miss what's happening soon</p>
        </div>

        <Link
          href="/events"
          className="text-blue-400 text-sm hover:underline transition-all"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const localizedDate = event.event_date
            ? new Date(event.event_date).toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Date TBD";

          const formattedPrice =
            event.price === 0 || !event.price
              ? "FREE"
              : `₹${Number(event.price).toLocaleString("en-IN")}`;

          // Generate public storage URL using the new image helper
          const imageUrl = getImageUrl(event.image_url);

          return (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className="block group transition-transform hover:-translate-y-1"
            >
              <EventCard
                title={event.title}
                date={localizedDate}
                location={event.location || "Online"}
                price={formattedPrice}
                category={event.category || "General"}
                imageUrl={imageUrl}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
