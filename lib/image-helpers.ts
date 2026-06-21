// lib/image-helpers.ts
import { createClient } from "@/lib/supabase-client";

export const getImageUrl = (urlOrPath: string | null | undefined) => {
  if (!urlOrPath) return "/placeholder-event.jpg";

  // 1. If it's already a full URL, return it
  if (urlOrPath.startsWith("http")) return urlOrPath;

  // 2. Remove leading slash if it exists, to avoid // in the path
  const cleanPath = urlOrPath.startsWith("/") ? urlOrPath.slice(1) : urlOrPath;

  // 3. Generate the public URL
  const supabase = createClient();
  const { data } = supabase.storage.from("events").getPublicUrl(cleanPath);

  return data.publicUrl;
};
