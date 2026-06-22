import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BookingSidebar from "@/app/components/BookingSidebar";
import { getImageUrl } from "@/lib/image-helpers";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

type EventPageProps = { params: Promise<{ id: string }> };

// Dynamic Metadata Generation for Advanced SEO & Organic Search Traversal
export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!event) return {};

  return {
    title: `${event.title} Tickets`,
    description:
      event.description ||
      `Secure your seats instantly on EventSphere for ${event.title}.`,
    openGraph: {
      title: `${event.title} | EventSphere`,
      description: event.description || undefined,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Network Query Narrowing: Fetch explicit dataset coordinates to optimize server TTFB
  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, title, description, event_date, location, price, category, seats_available, max_seats, image_url",
    )
    .eq("id", id)
    .single();

  if (error || !event) notFound();

  const imageUrl = getImageUrl(event.image_url);
  const evDate = event.event_date ? new Date(event.event_date) : null;

  const formattedDate = evDate
    ? evDate.toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Schedule Pending";

  const formattedTime = evDate
    ? `${evDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST`
    : "TBD";

  return (
    <article
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 select-text bg-[#040407]"
      aria-labelledby="event-title"
    >
      {/* Navigation Breadcrumb Backlink using Next Link to shield against full page reload latency */}
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors group outline-none focus-visible:text-indigo-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />{" "}
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
        {/* Primary Narrative & Media Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Layout Shift Protected Media Aspect Wrapper */}
          <div className="relative aspect-21/9 w-full overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40 shadow-2xl">
            <Image
              src={imageUrl}
              alt={`${event.title || "Event"} showcase banner`}
              fill
              priority
              sizes="(max-w-7xl) 66vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-101"
            />
          </div>

          <div className="space-y-5">
            {/* Context Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 select-none">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-semibold text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />{" "}
                {event.category || "General"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />{" "}
                Verified Experience
              </span>
            </div>

            <h1
              id="event-title"
              className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl leading-tight"
            >
              {event.title}
            </h1>

            {/* High-Scannability Coordinate Metadata Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-4 rounded-xl border border-zinc-800/80 bg-[#09090e] p-5">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Date & Timing
                  </p>
                  <p className="text-sm font-semibold text-white leading-normal">
                    {formattedDate}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {formattedTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-zinc-800/80 bg-[#09090e] p-5">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Venue Coordinates
                  </p>
                  <p className="text-sm font-semibold text-white leading-normal">
                    {event.location || "Online / Virtual Venue"}
                  </p>
                </div>
              </div>
            </div>

            {/* Deep Engagement Narrative Context Block */}
            {event.description && (
              <div className="border-t border-zinc-900 pt-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 select-none">
                  About This Experience
                </h3>
                <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line sm:text-base">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction & Booking Target Column */}
        <aside className="lg:col-span-1" aria-label="Ticket Registration Panel">
          <div className="sticky top-24 will-change-transform">
            <BookingSidebar event={event} />
          </div>
        </aside>
      </div>
    </article>
  );
}
