"use server";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateEventAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id");

  const updates = {
    title: formData.get("title"),
    description: formData.get("description"),
    max_seats: parseInt(formData.get("max_seats") as string),
  };

  const { error } = await supabase.from("events").update(updates).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/organizer");
}
