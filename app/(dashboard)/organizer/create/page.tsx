"use client"; // ✅ Turned into a client component to support image state tracking and action binding

import { useState } from "react";
import Link from "next/link";
import { createEventAction } from "@/app/actions/events"; // ✅ Import your external event action file
import ImageUpload from "@/app/components/ImageUpload"; // Adjust path to match your file tree

export default function CreateEventForm() {
  // Track your uploaded image path from the storage bucket
  const [imagePath, setImagePath] = useState<string>("");

  // ✅ Bind the image path parameter to your server action.
  // Per your action file structure: bound parameters come first, formData comes last automatically!
  const boundCreateAction = createEventAction.bind(null, imagePath);

  return (
    <main className="max-w-3xl mx-auto py-12 px-6 text-white">
      {/* Navigation Breadcrumb */}
      <Link
        href="/organizer"
        className="text-zinc-400 hover:text-white mb-6 inline-flex items-center gap-2 transition group"
      >
        <span className="group-hover:-translate-x-1 transition">&larr;</span>{" "}
        Back to Panel
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-xl mt-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Create New Event
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Fill out the details below to host your upcoming experience.
          </p>
        </div>

        {/* Form submitting directly to our bound Server Action context */}
        <form action={boundCreateAction} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Event Title
            </label>
            <input
              name="title"
              placeholder="e.g. Mumbai Music Festival"
              className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe what your event is about..."
              className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Location
              </label>
              <input
                name="location"
                placeholder="e.g. Jio World Garden"
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Event Date & Time
              </label>
              <input
                name="event_date"
                type="datetime-local"
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition scheme-dark"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Ticket Price (₹)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Total Available Seats
              </label>
              <input
                name="seats_available"
                type="number"
                min="1"
                placeholder="100"
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Event Category
            </label>
            <select
              name="category"
              className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-zinc-300 focus:outline-none focus:border-zinc-700 transition"
            >
              <option value="Music">Music</option>
              <option value="Tech">Tech</option>
              <option value="Workshop">Workshop</option>
              <option value="Sports">Sports</option>
              <option value="Food">Food</option>
            </select>
          </div>

          {/* ✅ Integrated your Client-Side Image Upload Component */}
          <div className="space-y-2 border border-zinc-800/80 bg-black/40 p-4 rounded-xl">
            <label className="text-sm font-medium text-zinc-300 block mb-1">
              Banner Image
            </label>
            <ImageUpload onUpload={(path) => setImagePath(path)} />

            {imagePath && (
              <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1.5">
                ✓ Image selected successfully!
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-4 rounded-xl transition shadow-lg shadow-indigo-950/40"
          >
            Create Event
          </button>
        </form>
      </div>
    </main>
  );
}
