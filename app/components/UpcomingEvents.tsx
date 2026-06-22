import { createClient } from "@/lib/supabase-server";
import { getImageUrl } from "@/lib/image-helpers";
import EventCard from "@/app/components/EventCard";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";

export default async function UpcomingEvents() {
  const supabase = await createClient();

  // Network Query Narrowing: Pull explicitly indexed catalog fields to slash TTFB latency
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, event_date, location, price, category, image_url")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3);

  if (error || !events || events.length === 0) return null;

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 select-none"
      aria-labelledby="upcoming-heading"
    >
      {/* Strategy Conversion Header Section */}
      <div className="flex items-end justify-between border-b border-zinc-900/60 pb-5">
        <div className="space-y-1">
          <h2
            id="upcoming-heading"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl"
          >
            <CalendarDays className="h-4 w-4 text-indigo-400 fill-indigo-400/10" />{" "}
            Upcoming Experiences
          </h2>
          <p className="text-xs text-zinc-400 sm:text-sm">
            Don't miss what's happening next in your immediate vicinity.
          </p>
        </div>

        <Link
          href="/events"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-indigo-400 transition-colors hover:text-indigo-300 outline-none"
        >
          View All{" "}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* High-Fidelity 3-Column Responsive Adaptive Grid Layout */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          // Micro-optimized rendering normalization models executed ahead of child paints
          const localizedDate = event.event_date
            ? new Date(event.event_date).toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Schedule Pending";

          const formattedPrice =
            !event.price || Number(event.price) === 0
              ? "FREE ACCESS"
              : `₹${Number(event.price).toLocaleString("en-IN")}`;

          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group block outline-none transition-transform duration-250 ease-out hover:-translate-y-1 will-change-transform"
            >
              <EventCard
                title={event.title || "Untitled Experience"}
                date={localizedDate}
                location={event.location || "Venue TBD"}
                price={formattedPrice}
                category={event.category || "General"}
                imageUrl={getImageUrl(event.image_url)}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
