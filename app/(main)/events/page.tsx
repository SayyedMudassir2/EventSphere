// app/events/page.tsx
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import EventList from "@/app/components/EventList";

export const metadata: Metadata = {
  title: "Live Event Catalog & Passes | EventSphere",
  description:
    "Browse premium music concerts, technical workshops, and premier sports matches.",
};

type SearchParams = Promise<{ category?: string; q?: string; page?: string }>;
const ITEMS_PER_PAGE = 6;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { category, q } = await searchParams;

  // We always start at page 1 on fresh server configurations or search mutations
  const fromOffset = 0;
  const toOffset = ITEMS_PER_PAGE - 1;

  const [categoryQueryResult, mainQueryBuilder] = await Promise.all([
    supabase.from("events").select("category").not("category", "is", null),
    (() => {
      let base = supabase.from("events").select("*", { count: "exact" });
      if (category) base = base.ilike("category", category.trim());
      if (q?.trim()) {
        const cleanQuery = `%${q.trim()}%`;
        base = base.or(
          `title.ilike.${cleanQuery},category.ilike.${cleanQuery}`,
        );
      }
      return base
        .order("event_date", { ascending: true })
        .range(fromOffset, toOffset);
    })(),
  ]);

  if (mainQueryBuilder.error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 text-center text-red-400 font-medium bg-[#040407]">
        Error connecting to catalog core pipeline:{" "}
        {mainQueryBuilder.error.message}
      </main>
    );
  }

  const uniqueCategories = Array.from(
    new Set((categoryQueryResult.data || []).map((e) => e.category)),
  ).filter(Boolean) as string[];

  const events = mainQueryBuilder.data ?? [];
  const totalCount = mainQueryBuilder.count ?? 0;
  const hasMore = totalCount > toOffset + 1;

  let headerTitleText = "All Live Experiences";
  if (category && q) {
    headerTitleText = `${category.charAt(0).toUpperCase() + category.slice(1)} matches for "${q}"`;
  } else if (category) {
    headerTitleText = `${category.charAt(0).toUpperCase() + category.slice(1)} Portfolios`;
  } else if (q) {
    headerTitleText = `Results for "${q}"`;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 bg-[#040407] min-h-screen text-white select-none">
      <div className="border-b border-zinc-900 pb-5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
          {headerTitleText}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Discover, book, and register passes across {totalCount} verified
          ecosystem listings.
        </p>
      </div>

      <nav
        className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide uppercase"
        aria-label="Catalog filtering"
      >
        <Link
          href={q ? `/events?q=${encodeURIComponent(q)}` : "/events"}
          className={cn(
            "rounded-full px-4 py-2.5 transition border duration-150 outline-none",
            !category
              ? "bg-white text-black border-white font-bold"
              : "border-zinc-800 bg-[#09090e]/60 text-zinc-400 hover:bg-zinc-800",
          )}
        >
          All Listings
        </Link>

        {uniqueCategories.map((cat) => {
          const isCurrent =
            category?.toLowerCase().trim() === cat.toLowerCase().trim();
          const href = q
            ? `/events?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(q)}`
            : `/events?category=${encodeURIComponent(cat)}`;

          return (
            <Link
              key={cat}
              href={href}
              className={cn(
                "rounded-full px-4 py-2.5 transition border duration-150 outline-none capitalize",
                isCurrent
                  ? "bg-white text-black border-white font-bold"
                  : "border-zinc-800 bg-[#09090e]/60 text-zinc-400 hover:bg-zinc-800",
              )}
            >
              {cat}
            </Link>
          );
        })}
      </nav>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/80 bg-[#09090e] py-20 text-center px-4 max-w-md mx-auto space-y-4">
          <div className="p-3 rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-500">
            <SearchX className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              No events matched
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              {q
                ? `We couldn't locate active titles matching "${q}".`
                : "No live items found inside this tier."}
            </p>
          </div>
          {(category || q) && (
            <Link
              href="/events"
              className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-bold uppercase text-zinc-300"
            >
              Reset Filters
            </Link>
          )}
        </div>
      ) : (
        /* Here is the update: rendering the interactive client component */
        <EventList
          initialEvents={events}
          initialHasMore={hasMore}
          category={category}
          q={q}
        />
      )}
    </main>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
