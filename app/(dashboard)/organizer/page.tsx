import { createClient } from "@/lib/supabase-server";
import { deleteEventAction } from "@/app/actions/events";
import Link from "next/link";
import {
  Plus,
  Calendar,
  MapPin,
  Layers,
  Trash2,
  Edit3,
  AlertCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizer Management Console | EventSphere",
  robots: { index: false }, // Strategic security defense guarding management spaces from web scrapers
};

export default async function OrganizerDashboard() {
  const supabase = await createClient();

  // Safe extraction path protecting server initialization steps
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Network Query Narrowing: Pull explicitly required dataset parameters to cut latency
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, location, event_date, category")
    .eq("organizer_id", user?.id)
    .order("event_date", { ascending: true });

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6 bg-[#040407]">
        <div className="flex items-center gap-3 rounded-xl border border-red-900/40 bg-[#09090e] p-5 text-sm text-red-400 max-w-md">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>
            Operational pipeline failure loading your workspace. Please reload.
          </span>
        </div>
      </div>
    );
  }

  const eventList = events ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 bg-[#040407] min-h-screen text-white">
      {/* Dashboard Top Action Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My{" "}
            <span className="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Event Portfolios
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Schedule, adjust, and monitor your hosted live experiences.
          </p>
        </div>
        <Link
          href="/organizer/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99] shadow-md shadow-indigo-600/10 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create New Event
        </Link>
      </div>

      {/* Dynamic Data Content Node */}
      {eventList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/80 bg-[#09090e] py-20 text-center px-4 max-w-lg mx-auto space-y-4">
          <Layers className="h-10 w-10 text-zinc-600 stroke-[1.2]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-200">
              No scheduled events
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs">
              Get started by creating your first platform experience for your
              audience.
            </p>
          </div>
          <Link
            href="/organizer/create"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Launch creation form &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {eventList.map((event) => (
            <div
              key={event.id}
              className="group flex flex-col gap-4 rounded-xl border border-zinc-800/80 bg-[#09090e] p-5 sm:flex-row sm:items-center sm:justify-between transition-all hover:border-zinc-700/60"
            >
              <div className="space-y-2.5">
                <div>
                  <h2 className="text-base font-bold text-white transition-colors group-hover:text-indigo-400 sm:text-lg">
                    {event.title}
                  </h2>

                  {/* High-Fidelity Meta Information String Rows */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate max-w-50">
                        {event.location || "Location TBD"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString(
                              undefined,
                              { dateStyle: "medium" },
                            )
                          : "Schedule pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center rounded-md bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 text-[11px] font-medium text-indigo-400">
                  {event.category || "General Admission"}
                </div>
              </div>

              {/* Functional Dashboard Mutator Controls */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-800/50 pt-4 sm:border-0 sm:pt-0">
                <Link
                  href={`/organizer/edit/${event.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Link>

                {/* Server Action mutation layout binding */}
                <form action={deleteEventAction}>
                  <input type="hidden" name="eventId" value={event.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-950/40 bg-red-950/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950/30 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
