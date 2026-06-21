// app/(main)/events/page.tsx
import { createClient } from "@/lib/supabase-server";
import { getImageUrl } from "@/lib/image-helpers";
import Link from "next/link";

// Define the updated type for the search params
type SearchParams = Promise<{ category?: string; q?: string }>;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { category, q } = await searchParams;

  // 1. Fetch unique categories (independent of current filters)
  const { data: categoryData } = await supabase
    .from("events")
    .select("category")
    .not("category", "is", null);

  // Get unique values and remove duplicates
  const uniqueCategories = Array.from(
    new Set(categoryData?.map((e) => e.category)),
  );

  // 2. Start building the main query
  let query = supabase.from("events").select("*");

  // Apply category filter if it exists
  if (category) {
    query = query.ilike("category", category);
  }

  // Case Insensitivity: .ilike enables case-insensitive pattern matching across title and description
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: events, error } = await query.order("event_date", {
    ascending: true,
  });

  if (error) return <p>Error loading events: {error.message}</p>;

  // Build header title text dynamically
  let headerText = "All Events";
  if (category && q) {
    headerText = `${category.charAt(0).toUpperCase() + category.slice(1)} Events matching "${q}"`;
  } else if (category) {
    headerText = `${category.charAt(0).toUpperCase() + category.slice(1)} Events`;
  } else if (q) {
    headerText = `Events matching "${q}"`;
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-6">
      {/* Dynamic Header */}
      <h1 className="text-4xl font-extrabold text-white mb-10">{headerText}</h1>

      {/* Dynamic Filter Links */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {/* "All" button retains the search query if present */}
        <Link
          href={q ? `/events?q=${encodeURIComponent(q)}` : "/events"}
          className={`text-sm px-4 py-2 rounded-full border ${!category ? "bg-white text-black" : "border-zinc-700 hover:bg-zinc-800"}`}
        >
          All
        </Link>

        {/* Dynamically generate category buttons while preserving the search query */}
        {uniqueCategories.map((cat) => {
          const href = q
            ? `/events?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(q)}`
            : `/events?category=${encodeURIComponent(cat)}`;

          return (
            <Link
              key={cat}
              href={href}
              className={`text-sm px-4 py-2 rounded-full border ${category === cat ? "bg-white text-black" : "border-zinc-700 hover:bg-zinc-800"}`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Events Grid & Empty States */}
      {!events || events.length === 0 ? (
        <div className="py-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
          <p className="text-zinc-400 text-lg font-medium mb-2">
            No events found matching your search.
          </p>
          <p className="text-zinc-600 text-sm">
            {q
              ? `Try checking your spelling or searching for a different keyword instead of "${q}".`
              : "Try exploring another category or check back later."}
          </p>
          {(category || q) && (
            <Link
              href="/events"
              className="inline-block mt-6 text-sm bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2.5 rounded-xl transition"
            >
              Clear all filters
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="group">
              <article className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-full transition hover:border-zinc-700">
                {event.image_url && (
                  <img
                    src={getImageUrl(event.image_url)}
                    alt={event.title}
                    className="rounded-xl mb-4 h-48 w-full object-cover"
                  />
                )}
                <h2 className="text-xl font-bold text-white">{event.title}</h2>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
