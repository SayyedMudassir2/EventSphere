// app/(main)/events/[id]/page.tsx
import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import BookingSidebar from "@/app/components/BookingSidebar";
import { getImageUrl } from "@/lib/image-helpers";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) notFound();

  // Resolve Image URL using the new image helper
  const imageUrl = getImageUrl(event.image_url);

  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      {/* Back Link */}
      <a
        href="/events"
        className="text-zinc-400 hover:text-white mb-6 block text-sm"
      >
        ← Back to Events
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Column (Media + Details) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative w-full h-100">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          <div>
            <div className="flex gap-3 mb-4">
              <span className="bg-zinc-800 text-white px-3 py-1 rounded-full text-xs">
                {event.category}
              </span>
              <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs border border-green-900/50">
                ✓ Verified
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              {event.title}
            </h1>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <p className="text-zinc-400 text-sm">Date & Time</p>
                <p className="font-semibold text-white">
                  {new Date(event.event_date).toLocaleString()}
                </p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <p className="text-zinc-400 text-sm">Location</p>
                <p className="font-semibold text-white">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Booking Card) */}
        <div className="lg:col-span-1">
          <BookingSidebar event={event} />
        </div>
      </div>
    </div>
  );
}
