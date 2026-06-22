import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MyBookingsClientEngine } from "./MyBookingsClientEngine";
import { AlertCircle, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Passes & Ticket Console | EventSphere",
  description:
    "Manage digital access credentials, search order histories, and configure custom calendar sync workflows.",
  robots: { index: false },
};

export default async function MyBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      seats,
      created_at,
      status,
      events (
        title,
        price,
        event_date,
        location,
        image_url
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("MY_BOOKINGS_QUERY_PIPELINE_FAULT:", error);
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 bg-[#040407]">
        {/* Error Pipeline Back Button */}
        <div className="mb-6 w-full max-w-md text-left">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-lg border border-zinc-800/40 bg-[#09090e] px-4 py-2 text-xs font-medium tracking-wide text-zinc-400 backdrop-blur-md transition-all duration-300 ease-out hover:border-zinc-700/60 hover:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5" />
            Return to Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-red-900/40 bg-[#09090e] p-5 text-sm text-red-400 w-full max-w-md">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <div className="space-y-0.5">
            <p className="font-semibold">Pipeline Execution Interrupted</p>
            <p className="text-xs text-red-400/80 font-mono mt-1">
              Error: {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const bookingList = bookings ?? [];

  // Safely normalise multi-row nested structures into clean data primitives for serialization safety
  const sanitizedBookings = bookingList.map((b) => {
    // 🛠️ STAFF TYPE FIX: Explicit type casting and array flattening to solve the VS Code TypeScript compilation error
    const rawEvents = b.events as unknown;
    const ev = Array.isArray(rawEvents)
      ? rawEvents[0]
      : (rawEvents as {
          title?: string;
          price?: number;
          event_date?: string;
          location?: string;
          image_url?: string;
        } | null);

    return {
      id: b.id,
      seats: Number(b.seats) || 1,
      createdAt: b.created_at,
      status: String(b.status || "upcoming")
        .toLowerCase()
        .trim(),
      ticketType: "General",
      format: "In-Person",
      eventTitle: ev?.title || "Untitled Experience",
      eventPrice: Number(ev?.price) || 0,
      eventDate: ev?.event_date || null,
      eventLocation: ev?.location || "Venue TBD",
      eventImage: ev?.image_url || null,
      eventSpeaker: null,
    };
  });

  return (
    <main className="min-h-screen bg-[#040407] text-zinc-100">
      {/* Premium Global Navigation Strip */}
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-8">
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2.5 rounded-lg border border-zinc-800/50 bg-[#09090e] px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-zinc-400 transition-all duration-300 ease-in-out hover:border-zinc-700 hover:bg-[#111118] hover:text-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Client Console */}
      <MyBookingsClientEngine initialBookings={sanitizedBookings} />
    </main>
  );
}
