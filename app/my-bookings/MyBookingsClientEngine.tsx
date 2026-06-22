"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import {
  Ticket,
  History,
  XCircle,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  CalendarX2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BookingCard from "@/app/components/BookingCard";

type SanitizedBooking = {
  id: string;
  seats: number;
  createdAt: string;
  status: string;
  ticketType: string;
  format: string;
  eventTitle: string;
  eventPrice: number;
  eventDate: string | null;
  eventLocation: string;
  eventImage: string | null;
  eventSpeaker: string | null;
};

export function MyBookingsClientEngine({
  initialBookings,
}: {
  initialBookings: SanitizedBooking[];
}) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketTypeFilter, setTicketTypeFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [sortOption, setSortOption] = useState<"soonest" | "purchase">(
    "soonest",
  );

  const [isPending, startTransition] = useTransition();
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

  // Enforce a micro-delay simulation to lock structural components and prevent hydration flicker loops
  useEffect(() => {
    const frameTimer = setTimeout(() => setIsLoadingSkeleton(false), 350);
    return () => clearTimeout(frameTimer);
  }, []);

  const processedBookings = useMemo(() => {
    // 1. Filter by Segment and Status Tab
    let results = initialBookings.filter((b) => {
      const now = new Date();
      const evDate = b.eventDate ? new Date(b.eventDate) : null;
      if (b.status === "cancelled") return activeTab === "cancelled";
      if (evDate && evDate < now) return activeTab === "past";
      return activeTab === "upcoming";
    });

    // 2. Instant Text Search Lookups
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (b) =>
          b.id.toLowerCase().includes(query) ||
          b.eventTitle.toLowerCase().includes(query) ||
          b.eventLocation.toLowerCase().includes(query) ||
          (b.eventSpeaker && b.eventSpeaker.toLowerCase().includes(query)),
      );
    }

    // 3. Multi-Filter Logic Selection
    if (ticketTypeFilter !== "all")
      results = results.filter((b) => b.ticketType === ticketTypeFilter);
    if (formatFilter !== "all")
      results = results.filter((b) => b.format === formatFilter);

    // 4. Advanced Sorting Configuration Matrix
    return results.sort((a, b) => {
      if (sortOption === "soonest") {
        const dateA = a.eventDate ? new Date(a.eventDate).getTime() : Infinity;
        const dateB = b.eventDate ? new Date(b.eventDate).getTime() : Infinity;
        return dateA - dateB;
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
  }, [
    initialBookings,
    activeTab,
    searchQuery,
    ticketTypeFilter,
    formatFilter,
    sortOption,
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 bg-[#040407] min-h-screen text-white">
      {/* Page Title Context Header */}
      <div className="border-b border-zinc-900 pb-5 select-none">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Pass Portfolio
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review active entry passes, download invoice data, and share ticket
          barcodes.
        </p>
      </div>

      {/* Segment Control Tab Ribbons */}
      <div className="flex border-b border-zinc-900 text-xs font-semibold uppercase tracking-wider select-none gap-2">
        {[
          { id: "upcoming", label: "Upcoming Passes", icon: Ticket },
          { id: "past", label: "Past History", icon: History },
          { id: "cancelled", label: "Cancelled Log", icon: XCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => startTransition(() => setActiveTab(tab.id as any))}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 transition-colors duration-150 outline-none -mb-pt",
              activeTab === tab.id
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-300",
            )}
          >
            <tab.icon className="h-4 w-4 stroke-[1.8]" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Complete Operations Search, Filter & Sort Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#09090e] border border-zinc-800/60 p-4 rounded-xl shadow-xl select-none">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by event, speaker, venue, or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 text-xs">
          <div className="relative w-full">
            <SlidersHorizontal className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <select
              value={ticketTypeFilter}
              onChange={(e) => setTicketTypeFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900/40 py-2 pl-7 pr-4 outline-none text-zinc-400 focus:border-indigo-500"
            >
              <option value="all" className="bg-[#09090e]">
                All Tiers
              </option>
              <option value="VIP" className="bg-[#09090e]">
                VIP Passes
              </option>
              <option value="General" className="bg-[#09090e]">
                General
              </option>
            </select>
          </div>

          <div className="relative w-full">
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900/40 py-2 px-3 outline-none text-zinc-400 focus:border-indigo-500"
            >
              <option value="all" className="bg-[#09090e]">
                All Formats
              </option>
              <option value="In-Person" className="bg-[#09090e]">
                In-Person
              </option>
              <option value="Virtual" className="bg-[#09090e]">
                Virtual
              </option>
            </select>
          </div>
        </div>

        <div className="relative w-full text-xs">
          <ArrowUpDown className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900/40 py-2 pl-7 pr-4 outline-none text-zinc-400 focus:border-indigo-500"
          >
            <option value="soonest" className="bg-[#09090e]">
              Sort: Soonest Date
            </option>
            <option value="purchase" className="bg-[#09090e]">
              Sort: Purchase Date
            </option>
          </select>
        </div>
      </div>

      {/* Dynamic Data Grid Canvas Layer */}
      {isLoadingSkeleton || isPending ? (
        /* SKELETON LOADING BLOCKS: Animated frames mirroring your high-fidelity card layout dimensions */
        <div className="space-y-4">
          {[1, 2].map((sk) => (
            <div
              key={sk}
              className="w-full h-32 rounded-xl border border-zinc-900 bg-[#09090e]/40 p-5 flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-4 w-2/3">
                <div className="w-24 aspect-video rounded-lg bg-zinc-800 shrink-0" />
                <div className="space-y-3 w-full">
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                  <div className="h-3 bg-zinc-800 rounded w-1/3" />
                </div>
              </div>
              <div className="w-24 h-8 bg-zinc-800 rounded-lg" />
            </div>
          ))}
        </div>
      ) : processedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/80 bg-[#09090e] py-20 text-center px-4 max-w-md mx-auto space-y-4 select-none">
          <CalendarX2 className="h-10 w-10 text-zinc-600 stroke-[1.2]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-200">
              No entries matched filtering
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              Adjust your active parameters or keyword string selections to
              locate the desired entry tokens.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {processedBookings.map((b) => (
            <BookingCard key={b.id} booking={b} activeTab={activeTab} />
          ))}
        </div>
      )}
    </main>
  );
}
