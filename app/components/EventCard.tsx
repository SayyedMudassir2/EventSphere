import { Calendar, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase-client"; // ✅ Import your browser client utility

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  imageUrl?: string; // This holds the storage reference path (e.g., 'events/filename.png')
  seatsLeft?: string;
  progress?: string;
}

export default function EventCard({
  title,
  date,
  location,
  price,
  category,
  imageUrl, // ✅ Destructured the imageUrl string path
  seatsLeft,
  progress,
}: EventCardProps) {
  // 1. Initialize client and generate a fully-qualified public CDN asset link
  const supabase = createClient();

  let finalPublicUrl = "";
  if (imageUrl) {
    const { data } = supabase.storage.from("events").getPublicUrl(imageUrl);

    finalPublicUrl = data.publicUrl;
  }

  return (
    <div className="bg-[#111116] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 text-white">
      {/* Event Image Banner Wrapper */}
      <div className="relative h-48 bg-zinc-900 flex items-center justify-center overflow-hidden">
        {/* ✅ Conditional rendering: Display image if available, fallback to placeholder otherwise */}
        {finalPublicUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover select-none"
          />
        ) : (
          <span className="text-zinc-600 text-xs tracking-wider uppercase font-medium">
            No Event Image
          </span>
        )}

        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/5">
          {category}
        </div>

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-emerald-400 border border-white/5">
          {price}
        </div>
      </div>

      {/* Content Meta Grid Description Layout */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-3 tracking-tight line-clamp-1">
          {title}
        </h3>

        <div className="flex flex-col gap-2 text-sm text-zinc-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-zinc-500" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-zinc-500" />
            <span>{location}</span>
          </div>
        </div>

        {/* Optional Ticket Booking Seats Count Progress Section */}
        {progress && (
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs text-zinc-500 font-medium">
              <span>{seatsLeft} seats left</span>
              <span>{progress} filled</span>
            </div>

            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: progress }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
