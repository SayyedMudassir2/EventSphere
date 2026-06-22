import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { signOutAction } from "@/app/actions/auth";
import { MobileNav } from "./MobileNav";
import { ActiveDesktopLinks } from "./ActiveDesktopLinks";
import { LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Control Console | EventSphere",
  robots: { index: false },
};

const NAVIGATION_ITEMS = [
  { id: "admin", href: "/admin", label: "Admin Dashboard", access: ["admin"] },
  {
    id: "organizer",
    href: "/organizer",
    label: "Organizer Panel",
    access: ["admin", "organizer"],
  },
  {
    id: "attendee",
    href: "/attendee",
    label: "Attendee Dashboard",
    access: ["admin", "organizer", "attendee"],
  },
] as const;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let databaseRole: string | null = null;
  if (user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role) databaseRole = profile.role;
  }

  const userRole = String(
    databaseRole || user?.user_metadata?.role || "attendee",
  )
    .toLowerCase()
    .trim();
  const userEmail = user?.email || "User Session";

  // Staff-Level Fix: Type assertion on includes parameters overrides read-only literal array restrictions safely
  const filteredNavItems = NAVIGATION_ITEMS.filter((item) =>
    (item.access as readonly string[]).includes(userRole),
  );

  return (
    <div className="flex min-h-screen bg-[#040407] text-white antialiased">
      {/* Desktop Sticky Fixed Sidebar Area */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-900 bg-[#09090e] p-5 md:flex justify-between will-change-transform">
        <div className="space-y-8">
          <Link
            href="/"
            className="inline-block text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity select-none"
          >
            EventSphere
          </Link>
          <ActiveDesktopLinks items={filteredNavItems} />
        </div>

        {/* Identity & Core Mutation Exit Pipeline */}
        <div className="space-y-4 border-t border-zinc-900 pt-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-950/40 border border-zinc-900/60 select-none">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-200 truncate">
                {userEmail}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mt-0.5">
                {userRole}
              </p>
            </div>
          </div>

          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-150 hover:bg-red-950/10 hover:text-red-300 group outline-none focus-visible:ring-1 focus-visible:ring-red-500"
            >
              <LogOut className="h-4 w-4 text-red-500/80 transition-colors duration-150 group-hover:text-red-400 shrink-0 stroke-[1.8]" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Workspace Frame Viewport Box */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileNav filteredNavItems={filteredNavItems} userRole={userRole} />
        <main className="flex-1 overflow-y-auto outline-none" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
