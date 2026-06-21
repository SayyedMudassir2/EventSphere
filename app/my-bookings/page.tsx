import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import BookingCard from "@/app/components/BookingCard";

export default async function MyBookingsPage() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // Fetch bookings with joined event details
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
    id,
    seats,
    created_at,
    events!bookings_event_id_fkey (
      title,
      price
    )
  `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Query Error:", error);
  }

  console.log("DEBUG: Fetched bookings:", JSON.stringify(bookings, null, 2));

  return (
    <main className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>

      {!bookings || bookings.length === 0 ? (
        <p className="text-zinc-400">You haven't booked any events yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking: any) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </main>
  );
}
