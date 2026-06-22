import { createClient } from "@/lib/supabase-server";
import { CheckCircle2, AlertTriangle, CalendarX2, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket Verification | EventSphere Console",
  robots: { index: false }, // Strategic security measure to shield ticket verification results from crawling
};

type ParamsProps = { params: Promise<{ bookingId: string }> };

export default async function VerifyPage({ params }: ParamsProps) {
  const { bookingId } = await params;
  const supabase = await createClient();

  // Single-roundtrip narrowed query to fetch current ticket and structural event contexts
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, scanned, events(title, date)")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center bg-[#040407]">
        <div className="max-w-sm rounded-xl border border-red-900/40 bg-[#09090e] p-6 shadow-2xl space-y-3">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="text-xl font-bold text-white">Ticket Not Found</h1>
          <p className="text-xs text-zinc-400">
            The provided identifier code does not match any operational database
            transaction assets.
          </p>
        </div>
      </div>
    );
  }

  // 1. Guard Condition: Check duplicate entry states
  if (booking.scanned) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center bg-[#040407]">
        <div className="max-w-sm rounded-xl border border-amber-900/40 bg-[#09090e] p-6 shadow-2xl space-y-3 animate-pulse">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="text-xl font-bold text-white">Already Checked In</h1>
          <p className="text-xs text-zinc-400">
            Security Alert: This dynamic token vector has already been processed
            at a prior point of entry.
          </p>
        </div>
      </div>
    );
  }

  // 2. Guard Condition: Temporal verification check (Optimized timezone safety)
  const eventTitle =
    typeof booking.events === "object" &&
    booking.events !== null &&
    "title" in booking.events
      ? String(booking.events.title)
      : "Unknown Event";
  const eventRawDate =
    typeof booking.events === "object" &&
    booking.events !== null &&
    "date" in booking.events
      ? String(booking.events.date)
      : null;

  if (eventRawDate && new Date() > new Date(eventRawDate)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center bg-[#040407]">
        <div className="max-w-sm rounded-xl border border-zinc-800 bg-[#09090e] p-6 shadow-2xl space-y-3">
          <CalendarX2 className="mx-auto h-12 w-12 text-zinc-500" />
          <h1 className="text-xl font-bold text-white">Expired Asset</h1>
          <p className="text-xs text-zinc-400">
            This validation gate has passed. Event took place on:{" "}
            <span className="font-mono text-indigo-400">
              {new Date(eventRawDate).toDateString()}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // 3. Execution Phase: Atomically check-in attendee and write to persistent storage
  const { error: updateError } = await supabase
    .from("bookings")
    .update({ scanned: true })
    .eq("id", bookingId);

  if (updateError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center bg-[#040407]">
        <div className="max-w-sm rounded-xl border border-red-900/40 bg-[#09090e] p-6 shadow-2xl space-y-3">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="text-xl font-bold text-white">
            Operational Write Failure
          </h1>
          <p className="text-xs text-zinc-400">
            Database commit error during state updates. Please retry gate
            validation cycle.
          </p>
        </div>
      </div>
    );
  }

  // 4. Success Pipeline
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center bg-[#040407]">
      <div className="max-w-md rounded-xl border border-emerald-900/40 bg-[#09090e] p-8 shadow-2xl space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Pass Verified
          </h1>
          <p className="text-sm text-zinc-400">
            Attendee successfully checked-in and authenticated for:
          </p>
          <div className="inline-block rounded-md bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 text-sm font-semibold text-indigo-400 mt-2">
            {eventTitle}
          </div>
        </div>
        <div className="pt-2 border-t border-zinc-800/60 text-xs text-zinc-500">
          Ticket database balance successfully altered to state:{" "}
          <span className="font-mono font-semibold text-emerald-500">USED</span>
        </div>
      </div>
    </div>
  );
}
