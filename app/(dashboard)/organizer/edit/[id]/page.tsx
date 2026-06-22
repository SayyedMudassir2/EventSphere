import { createClient } from "@/lib/supabase-server";
import EditEventForm from "./EditEventForm";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Event Specifications | EventSphere Console",
  robots: { index: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Explicit relational query narrowing to guard data boundaries
  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, title, description, location, event_date, price, seats_available, max_seats, category, image_url",
    )
    .eq("id", id)
    .eq("organizer_id", user?.id)
    .single();

  // Strict structural boundary check to fully block undefined passing down the tree
  if (error || !event) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-[#040407] min-h-screen text-white flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-red-900/40 bg-[#09090e] p-5 text-sm text-red-400 max-w-md w-full">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <div className="space-y-1">
            <p className="font-semibold">
              Event asset not found or unauthorized access detected.
            </p>
            <Link
              href="/organizer"
              className="text-xs text-indigo-400 hover:text-indigo-300 underline block mt-1"
            >
              Return to management panel
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Safely forwards the verified, guaranteed data to the client canvas wrapper
  return <EditEventForm event={event} />;
}
