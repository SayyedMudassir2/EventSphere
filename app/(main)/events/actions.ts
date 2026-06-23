// app/events/actions.ts
"use server";

import { createClient } from "@/lib/supabase-server";

const ITEMS_PER_PAGE = 6;

export async function fetchEventsAction({
  category,
  q,
  page,
}: {
  category?: string;
  q?: string;
  page: number;
}) {
  const supabase = await createClient();
  const fromOffset = (page - 1) * ITEMS_PER_PAGE;
  const toOffset = fromOffset + ITEMS_PER_PAGE - 1;

  let base = supabase.from("events").select("*", { count: "exact" });

  if (category) {
    base = base.ilike("category", category.trim());
  }

  if (q?.trim()) {
    const cleanQuery = `%${q.trim()}%`;
    base = base.or(`title.ilike.${cleanQuery},category.ilike.${cleanQuery}`);
  }

  const { data, count, error } = await base
    .order("event_date", { ascending: true })
    .range(fromOffset, toOffset);

  if (error) throw new Error(error.message);

  const events = data ?? [];
  const totalCount = count ?? 0;
  const hasMore = totalCount > toOffset + 1;

  return { events, hasMore };
}
