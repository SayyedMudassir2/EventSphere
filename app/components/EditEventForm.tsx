"use client";
import { updateEventAction } from "@/app/actions/updateEvent";

export function EditEventForm({ initialData }: { initialData: any }) {
  return (
    <form action={updateEventAction} className="space-y-4">
      <input type="hidden" name="id" value={initialData.id} />

      <input
        name="title"
        defaultValue={initialData.title}
        className="w-full p-3 bg-zinc-900 rounded-lg"
      />
      <textarea
        name="description"
        defaultValue={initialData.description}
        className="w-full p-3 bg-zinc-900 rounded-lg"
      />
      <input
        name="max_seats"
        type="number"
        defaultValue={initialData.max_seats}
        className="w-full p-3 bg-zinc-900 rounded-lg"
      />

      <button
        type="submit"
        className="bg-blue-600 px-6 py-2 rounded-lg text-white"
      >
        Update Event
      </button>
    </form>
  );
}
