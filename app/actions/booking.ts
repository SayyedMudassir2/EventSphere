"use server";

import { createClient } from "@/lib/supabase-server";
import { sendBookingEmail } from "@/app/actions/email";
import { revalidatePath } from "next/cache";

export async function createBookingAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    throw new Error("User not authenticated or email missing.");
  }

  const eventId = formData.get("eventId") as string;
  const seats = Number(formData.get("seats"));

  if (!eventId || !seats) {
    throw new Error("Missing required booking details.");
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      event_id: eventId,
      seats: seats,
      booking_date: new Date().toISOString(),
    })
    .select("*, events!bookings_event_id_fkey(title)")
    .single();

  if (error) {
    console.error("CREATE_BOOKING_INSERT_FAULT:", error);
    throw new Error(error.message);
  }

  if (data) {
    const eventTitle = Array.isArray(data.events)
      ? data.events[0]?.title
      : data.events?.title;
    if (eventTitle) {
      // 🛠️ STAFF TYPE-SAFE OVERRIDE: Forwards the required data.id as the 3rd parameter context string
      try {
        await sendBookingEmail(user.email, eventTitle, String(data.id));
      } catch (emailError) {
        console.error("NON_BLOCKING_EMAIL_DISPATCH_FAULT:", emailError);
      }
    }
  }

  revalidatePath("/my-bookings");
  return { success: true };
}

export async function bookEventAction(eventId: string, seats: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in to book.");

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      event_id: eventId,
      seats: seats,
      booking_date: new Date().toISOString(),
    })
    .select("*, events!bookings_event_id_fkey(title)")
    .single();

  if (error) {
    console.error("BOOK_EVENT_INSERT_FAULT:", error);
    throw new Error(error.message);
  }

  if (data && data.events && user.email) {
    const eventTitle = Array.isArray(data.events)
      ? data.events[0]?.title
      : data.events?.title;
    if (eventTitle) {
      // 🛠️ STAFF TYPE-SAFE OVERRIDE: Forwards the required data.id as the 3rd parameter context string
      try {
        await sendBookingEmail(user.email, eventTitle, String(data.id));
      } catch (emailError) {
        console.error("NON_BLOCKING_EMAIL_DISPATCH_FAULT:", emailError);
      }
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

  const numericId = Number(bookingId);

  const { error, count } = await supabase
    .from("bookings")
    .delete({ count: "exact" })
    .eq("id", numericId);

  if (error) {
    console.error("CANCEL_BOOKING_DELETE_FAULT:", error);
    throw new Error(error.message);
  }

  if (count === 0) {
    throw new Error("Booking not found or access denied.");
  }

  revalidatePath("/my-bookings");
  return { success: true };
}
