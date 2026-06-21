"use server";

import { createClient } from "@/lib/supabase-server";
import { sendBookingEmail } from "@/app/actions/email";
import { revalidatePath } from "next/cache";

export async function bookEventAction(eventId: string, seats: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in to book.");

  console.log("DEBUG: Inserting record:", {
    event_id: eventId,
    user_id: user.id,
    seats: seats,
  });

  // 1. Perform insertion and join to fetch the event title
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        event_id: eventId,
        user_id: user.id,
        seats: seats,
      },
    ])
    .select("*, events(title)") // Join to get the title
    .single();

  if (error) {
    console.error("DEBUG: Supabase Insert Error:", error);
    throw new Error(error.message);
  }

  // 2. Trigger the confirmation email if data and title exist
  if (data && data.events && user.email) {
    const eventTitle = Array.isArray(data.events)
      ? data.events[0]?.title
      : data.events?.title;

    if (eventTitle) {
      await sendBookingEmail(user.email, eventTitle);
    }
  }

  revalidatePath("/my-bookings");
  return { success: true };
}

export async function cancelBookingAction(bookingId: string | number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Force cast the ID to a number (BigInt in JS can be handled as Number)
  const numericId = Number(bookingId);

  const { error, count } = await supabase
    .from("bookings")
    .delete({ count: "exact" })
    .eq("id", numericId); // Use the converted number here
  // .eq("user_id", user.id);

  if (error) {
    console.error("Delete Error:", error);
    throw new Error(error.message);
  }

  if (count === 0) {
    console.error("No row found with ID:", numericId, "for User:", user.id);
    throw new Error("Booking not found or access denied.");
  }

  revalidatePath("/my-bookings");
  return { success: true };
}
