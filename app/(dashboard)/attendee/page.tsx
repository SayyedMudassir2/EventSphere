import { createClient } from "@/lib/supabase-server";
import { getImageUrl } from "@/lib/image-helpers";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Ticket } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Upcoming Events | EventSphere",
  description:
    "Browse and book tickets for concerts, workshops, and sports events in your city.",
};

export default async function AttendeeDashboard() {
  const supabase = await createClient();

  // Network Query Narrowing: Fetch only exact fields needed to render cards
  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, image_url, location, event_date, price")
    .order("event_date", { ascending: true });

  const eventList = events ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 bg-[#040407] min-h-screen text-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Discover{" "}
          <span className="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Live Experiences
          </span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Handpicked concerts, workshops, and experiences curated for you.
        </p>
      </div>

      {eventList.length === 0 ? (
        <div className="rounded-xl border border-zinc-800/60 bg-[#09090e] p-12 text-center max-w-md mx-auto">
          <p className="text-sm text-zinc-400">
            No upcoming experiences found at the moment. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventList.map((event) => {
            const imageUrl = getImageUrl(event.image_url);

            return (
              <article
                key={event.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-[#09090e] transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-indigo-500/5"
              >
                {/* Image Container with Fixed Aspect Ratio to block CLS */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900/60">
                  {event.image_url ? (
                    <Image
                      src={imageUrl}
                      alt={event.title || "Event banner"}
                      fill
                      sizes="(max-w-7xl) 33vw, (max-w-md) 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-600">
                      <Ticket className="h-8 w-8 stroke-[1.5]" />
                    </div>
                  )}
                </div>

                {/* Content Area Box */}
                <div className="flex flex-1 flex-col p-5 space-y-4">
                  <div className="flex-1 space-y-2">
                    <h2 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-indigo-400 line-clamp-1">
                      {event.title}
                    </h2>
                    <p className="text-xs leading-relaxed text-zinc-400 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* High-Fidelity Icon Geometry Details Grid */}
                  <div className="space-y-2 border-t border-zinc-800/60 pt-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString(
                              undefined,
                              { dateStyle: "medium" },
                            )
                          : "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-white">
                      <Ticket className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>
                        {event.price && Number(event.price) === 0
                          ? "Free Entry"
                          : `$${event.price}`}
                      </span>
                    </div>
                  </div>

                  {/* Core Conversion Endpoint */}
                  <Link
                    href={`/events/${event.id}`}
                    className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99] shadow-md shadow-indigo-600/10"
                  >
                    Register Now
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
