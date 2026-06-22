import { createClient } from "@/lib/supabase-server";
import {
  Ticket,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import { TransactionTableLog } from "./TransactionTableLog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Operational Console | EventSphere",
  robots: { index: false },
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [bookingsResult, eventsResult, profilesResult] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        "id, scanned, user_id, created_at, events(title, price, seats_available, max_seats)",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("events")
      .select("id, title, seats_available, max_seats, price"),
    supabase.from("profiles").select("id, full_name, email"),
  ]);

  if (bookingsResult.error || eventsResult.error || profilesResult.error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6 bg-[#040407]">
        <div className="flex items-center gap-3 rounded-xl border border-red-900/40 bg-[#09090e] p-5 text-sm text-red-400 max-w-md w-full">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <div className="space-y-1">
            <p className="font-semibold">Analytics Pipeline Connection Fault</p>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Error details:{" "}
              {bookingsResult.error?.message ||
                eventsResult.error?.message ||
                profilesResult.error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const bookingList = bookingsResult.data ?? [];
  const eventList = eventsResult.data ?? [];
  const profileList = profilesResult.data ?? [];

  const profileMap = new Map(profileList.map((p) => [p.id, p]));

  // --- COGNITIVE REVENUE & METRIC ANALYTICS ---
  const totalBookings = bookingList.length;
  const scannedCount = bookingList.filter((b) => b.scanned).length;
  const pendingCount = totalBookings - scannedCount;

  const totalRevenue = bookingList.reduce((acc, curr) => {
    const eventPrice =
      curr.events && typeof curr.events === "object" && "price" in curr.events
        ? Number(curr.events.price)
        : 0;
    return acc + (eventPrice || 0);
  }, 0);

  const totalCapacity = eventList.reduce(
    (acc, curr) => acc + (Number(curr.max_seats) || 0),
    0,
  );
  const totalSeatsSold =
    totalCapacity -
    eventList.reduce(
      (acc, curr) => acc + (Number(curr.seats_available) || 0),
      0,
    );
  const seatSaturationRate =
    totalCapacity > 0
      ? ((totalSeatsSold / totalCapacity) * 100).toFixed(1)
      : "0.0";
  const checkInVelocity =
    totalBookings > 0
      ? ((scannedCount / totalBookings) * 100).toFixed(1)
      : "0.0";

  // Flatten the relation structures on the server to make client-side serialisation memory-light
  const parsedLogData = bookingList.map((b) => {
    const matchedProf = profileMap.get(b.user_id);
    return {
      id: b.id,
      scanned: !!b.scanned,
      timestamp: b.created_at,
      eventTitle:
        b.events && typeof b.events === "object" && "title" in b.events
          ? String(b.events.title)
          : "Unknown Event",
      eventPrice:
        b.events && typeof b.events === "object" && "price" in b.events
          ? Number(b.events.price)
          : 0,
      attendeeName: matchedProf?.full_name || "Anonymous Guest",
      attendeeEmail: matchedProf?.email || "Guest Account",
    };
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-[#040407] min-h-screen text-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          System Console
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Real-time ticketing operations, capacity trends, and audit records.
        </p>
      </div>

      {/* Analytics Visualization Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Gross Sales Volume",
            value: `₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            desc: "Platform ticket revenue capture",
            icon: DollarSign,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Total Tickets Issued",
            value: totalBookings,
            desc: `${scannedCount} verified entry gate passes`,
            icon: Ticket,
            color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          },
          {
            label: "Verification Velocity",
            value: `${checkInVelocity}%`,
            desc: `${pendingCount} passes outstanding`,
            icon: TrendingUp,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
          {
            label: "Venue Saturation",
            value: `${seatSaturationRate}%`,
            desc: `${totalSeatsSold} / ${totalCapacity} capacity allocations`,
            icon: Users,
            color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-zinc-800/80 p-5 bg-[#09090e] shadow-lg relative overflow-hidden group hover:border-zinc-700/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <card.icon className="h-4 w-4 stroke-[1.8]" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
                {card.value}
              </h2>
              <p className="text-[11px] text-zinc-500 mt-1 truncate">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Inject Isolated Interactive Grid Component */}
      <TransactionTableLog initialData={parsedLogData} />
    </div>
  );
}
