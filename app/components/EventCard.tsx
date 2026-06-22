import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  imageUrl?: string; // This holds the pre-resolved, fully-qualified public CDN asset URL
  seatsLeft?: string;
  progress?: string;
}

export default function EventCard({
  title,
  date,
  location,
  price,
  category,
  imageUrl,
  seatsLeft,
  progress,
}: EventCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-zinc-800/80 bg-[#09090e] transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700/60 hover:shadow-2xl hover:shadow-indigo-500/5 text-white flex flex-col h-full">
      {/* Event Image Banner Wrapper - Fixed aspect-video container layout shifts prevention */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950 select-none border-b border-zinc-900/40 shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${title} event cover`}
            fill
            sizes="(max-w-7xl) 33vw, (max-w-md) 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-600 bg-zinc-950/20">
            <Ticket className="h-6 w-6 stroke-[1.2]" />
            <span className="text-[10px] tracking-widest uppercase font-bold text-zinc-600">
              No Cover Asset
            </span>
          </div>
        )}

        {/* High-Contrast Floating Identity Tags */}
        <span className="absolute top-3 left-3 bg-[#040407]/60 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-zinc-300 border border-zinc-800/40">
          {category}
        </span>

        <span className="absolute bottom-3 right-3 bg-[#040407]/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-emerald-400 border border-zinc-800/60 shadow-md">
          {price}
        </span>
      </div>

      {/* Content Metadata Description Panel Layout */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="text-base font-bold tracking-tight text-white transition-colors duration-150 group-hover:text-indigo-400 leading-snug line-clamp-1">
            {title}
          </h3>

          <div className="space-y-1.5 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0 stroke-[1.8]" />
              <span className="truncate">{date}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0 stroke-[1.8]" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Optional Scarcity Progression UI Indicator Block */}
        {progress && (
          <div className="space-y-2 pt-3 border-t border-zinc-900/60 select-none">
            <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
              <span
                className={cn(
                  seatsLeft && parseInt(seatsLeft) <= 10 && "text-amber-500/90",
                )}
              >
                {seatsLeft} seats left
              </span>
              <span>{progress} filled</span>
            </div>

            <div className="h-1.5 w-full bg-zinc-900 border border-zinc-800/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: progress }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
