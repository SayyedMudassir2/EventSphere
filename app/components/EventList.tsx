// components/EventList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/image-helpers";
import { fetchEventsAction } from "@/app/(main)/events/actions";

type Event = any; // Replace with your explicit database type if available

interface EventListProps {
  initialEvents: Event[];
  initialHasMore: boolean;
  category?: string;
  q?: string;
}

export default function EventList({
  initialEvents,
  initialHasMore,
  category,
  q,
}: EventListProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchEventsAction({ category, q, page: nextPage });

      setEvents((prev) => [...prev, ...result.events]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {events.map((event) => {
          const evDate = event.event_date ? new Date(event.event_date) : null;
          const formattedDate = evDate
            ? evDate.toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Schedule Pending";

          return (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className="group block h-full outline-none"
            >
              <article className="overflow-hidden rounded-xl border border-zinc-800/80 bg-[#09090e] transition-all duration-150 hover:-translate-y-1 hover:border-zinc-700/60 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col h-full will-change-transform">
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-950/40 shrink-0 border-b border-zinc-900/40">
                  {event.image_url ? (
                    <Image
                      src={getImageUrl(event.image_url)}
                      alt={`${event.title || "Event"} cover asset`}
                      fill
                      sizes="(max-w-7xl) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-700 font-mono text-[10px] font-bold tracking-widest uppercase">
                      No Visual Media
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[#040407]/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-zinc-300 border border-zinc-800/40">
                    {event.category || "General"}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-base font-bold tracking-tight text-white transition-colors duration-150 group-hover:text-indigo-400 line-clamp-1 leading-snug">
                      {event.title}
                    </h2>
                    {event.description && (
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-medium">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-[11px] text-zinc-400 font-medium border-t border-zinc-900/60 pt-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0 stroke-[1.8]" />{" "}
                      <span className="truncate">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0 stroke-[1.8]" />{" "}
                      <span className="truncate">
                        {event.location || "Venue TBD"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4 select-none">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-150 hover:bg-zinc-800 hover:text-indigo-400 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <span>Loading...</span>
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              </>
            ) : (
              <>
                <span>Load More Content</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
