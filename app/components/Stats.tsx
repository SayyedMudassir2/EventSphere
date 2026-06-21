import { createClient } from "@/lib/supabase-server";

export const revalidate = 3600;

export default async function Stats() {
  const supabase = await createClient();

  // Fetch counts efficiently
  const { count: eventsCount } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true });

  const { count: usersCount } = await supabase
    .from("profiles") // Assumes you have a profiles table
    .select("id", { count: "exact", head: true });

  const { count: organizersCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "organizer");

  // You can define your logic for "Cities" based on your schema
  const { data: cities } = await supabase.from("events").select("location");

  const uniqueCities = new Set(cities?.map((e) => e.location)).size;

  const data = [
    { label: "Events Hosted", value: `${eventsCount || 0}+` },
    { label: "Happy Attendees", value: `${usersCount || 0}+` },
    { label: "Organizers", value: `${organizersCount || 0}+` },
    { label: "Locations", value: `${uniqueCities || 0}+` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-white/10 pt-12 w-full max-w-4xl">
      {data.map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
          <div className="text-sm text-white/50">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
