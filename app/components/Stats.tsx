import { createClient } from "@/lib/supabase-server";
import { AlertCircle } from "lucide-react";

export const revalidate = 3600; // Efficient 1-hour ISR cache line boundary strategy

export default async function Stats() {
  const supabase = await createClient();

  // Execute high-speed head counting queries in parallel to maximize TTFB
  const [eventsRes, usersRes, organizersRes, locationsRes] = await Promise.all([
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "organizer"),
    supabase.from("events").select("location"), // Narrow query tracking coordinates directly
  ]);

  if (
    eventsRes.error ||
    usersRes.error ||
    organizersRes.error ||
    locationsRes.error
  ) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-zinc-900/60 bg-zinc-950/20 p-4 text-xs text-zinc-500 select-none max-w-sm mx-auto">
        <AlertCircle className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
        <span>Platform trust metrics temporarily settling...</span>
      </div>
    );
  }

  // Calculate distinct layout locations cleanly in memory using highly optimized O(N) execution paths
  const uniqueCities = new Set(
    (locationsRes.data || []).map((e) =>
      String(e.location || "")
        .split(",")
        .pop()
        ?.trim(),
    ),
  ).size;

  const statsMetricMatrix = [
    { label: "Live Events", value: `${eventsRes.count || 0}+` },
    { label: "Verified Users", value: `${usersRes.count || 0}+` },
    { label: "Expert Hosts", value: `${organizersRes.count || 0}+` },
    { label: "Active Cities", value: `${uniqueCities || 0}+` },
  ] as const;

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 select-none animate-fade-in tracking-tight">
      {statsMetricMatrix.map((metric) => (
        <div
          key={metric.label}
          className="text-center group border-r border-zinc-900/40 last:border-0 hidden sm:block"
        >
          <div className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl transition-colors duration-200 group-hover:text-indigo-400 font-mono">
            {metric.value}
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {metric.label}
          </div>
        </div>
      ))}

      {/* Mobile structural flex component matching small tactile viewports smoothly */}
      {statsMetricMatrix.map((metric) => (
        <div key={`${metric.label}-mobile`} className="text-center sm:hidden">
          <div className="text-2xl font-extrabold text-white font-mono">
            {metric.value}
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
