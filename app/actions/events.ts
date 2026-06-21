// app/actions/events.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper to get authenticated user securely
async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized: You must be logged in.");
  return { supabase, user };
}

// 1. CREATE EVENT (Updated signature to support bound imagePath)
// Note: Bound parameters come first, default formData comes last!
export async function createEventAction(imagePath: string, formData: FormData) {
  const { supabase, user } = await getAuthUser();

  const eventData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    location: formData.get("location") as string,
    event_date: formData.get("event_date") as string,
    price: parseFloat((formData.get("price") as string) || "0"),
    seats_available: parseInt(
      (formData.get("seats_available") as string) || "0",
    ),
    category: formData.get("category") as string,
    image_url: imagePath, // ✅ Explicitly saving your uploaded image storage bucket reference
    organizer_id: user.id,
  };

  const { error } = await supabase.from("events").insert(eventData);
  if (error) throw new Error(`Failed to create event: ${error.message}`);

  revalidatePath("/organizer"); // Matches your new Route Group path structure
  redirect("/organizer");
}

// 2. UPDATE EVENT
export async function updateEventAction(eventId: string, formData: FormData) {
  const { supabase, user } = await getAuthUser();

  const eventData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    location: formData.get("location") as string,
    image_url: formData.get("image_url") as string,
    event_date: formData.get("event_date") as string,
    price: parseFloat((formData.get("price") as string) || "0"),
    seats_available: parseInt(
      (formData.get("seats_available") as string) || "0",
    ),
    category: formData.get("category") as string,
  };

  const { error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", eventId)
    .eq("organizer_id", user.id);

  if (error) throw new Error(`Failed to update event: ${error.message}`);

  revalidatePath("/organizer");
  revalidatePath(`/dashboard/organizer/edit/${eventId}`);
  redirect("/organizer");
}

// 3. DELETE EVENT
export async function deleteEventAction(formData: FormData) {
  const { supabase, user } = await getAuthUser();

  // Extract the target identifier sent via the hidden form field
  const eventId = formData.get("eventId") as string;

  if (!eventId) throw new Error("Invalid Request: Event ID missing.");

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("organizer_id", user.id);

  if (error) throw new Error(`Failed to delete event: ${error.message}`);

  revalidatePath("/organizer");
}
