"use client";

import { useState, useActionState, startTransition } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateEventAction } from "@/app/actions/events";
import ImageUpload from "@/app/components/ImageUpload";
import { cn } from "@/lib/utils";

type EventAsset = {
  id: string;
  title: string | null;
  description: string | null;
  location: string | null;
  event_date: string | null;
  price: number | null;
  seats_available: number | null;
  max_seats: number | null;
  category: string | null;
  image_url: string | null;
};

const CATEGORIES = ["music", "tech", "workshop", "sports"] as const;

export default function EditEventForm({ event }: { event: EventAsset }) {
  const [imagePath, setImagePath] = useState<string>(event?.image_url || "");

  const [state, formAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      try {
        if (imagePath) formData.append("imagePath", imagePath);
        await updateEventAction(event.id, formData);
        return null;
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Update failed." };
      }
    },
    null,
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  const formattedDate = event.event_date
    ? new Date(event.event_date).toISOString().slice(0, 16)
    : "";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8 bg-[#040407] min-h-screen text-white">
      <Link
        href="/organizer"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors group outline-none focus-visible:text-indigo-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
        Back to Panel
      </Link>

      <div className="bg-[#09090e] border border-zinc-800/80 p-6 sm:p-10 rounded-2xl shadow-2xl space-y-8">
        <div className="select-none">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Edit Event:{" "}
            <span className="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {event.title}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Modify your event specifications below. All updates reflect
            instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Event Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={event.title || ""}
              required
              disabled={isPending}
              placeholder="e.g., Mumbai Electronic Festival"
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={event.description || ""}
              required
              disabled={isPending}
              placeholder="Detail the event agenda, timeline, and lineup details..."
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="location"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Location / Venue
              </label>
              <input
                id="location"
                name="location"
                type="text"
                defaultValue={event.location || ""}
                required
                disabled={isPending}
                placeholder="e.g., Jio World Convention Centre"
                className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="event_date"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Event Date & Time
              </label>
              <input
                id="event_date"
                name="event_date"
                type="datetime-local"
                defaultValue={formattedDate}
                required
                disabled={isPending}
                className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 scheme-dark disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="price"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Ticket Price (₹)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={event.price || 0}
                required
                disabled={isPending}
                placeholder="0.00"
                className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="seats_available"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Available Slots / Capacity
              </label>
              <input
                id="seats_available"
                name="seats_available"
                type="number"
                min="1"
                defaultValue={event.seats_available ?? event.max_seats ?? 100}
                required
                disabled={isPending}
                placeholder="100"
                className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="category"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Category Tag
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                defaultValue={event.category?.toLowerCase() || "general"}
                disabled={isPending}
                className="w-full appearance-none rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-10 disabled:opacity-50 capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-[#09090e] text-white py-2"
                  >
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500">
                <svg
                  className="h-4 w-4 stroke-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
              Banner Media Asset
            </label>
            <ImageUpload onUpload={(path) => setImagePath(path)} />
            {imagePath && (
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 select-none animate-fade-in">
                <CheckCircle2 className="h-3.5 w-3.5" /> Media Asset Tracked
              </div>
            )}
          </div>

          {state?.error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl bg-red-500/5 border border-red-500/20 p-4 text-xs text-red-400 select-all animate-fade-in"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{state.error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-150 hover:bg-indigo-500 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 shadow-md shadow-indigo-600/10 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Specifications"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
