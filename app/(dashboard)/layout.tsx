// app/(dashboard)/layout.tsx
import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col gap-8">
        <Link href="/" className="text-xl font-bold text-white">
          EventSphere
        </Link>

        <nav className="flex flex-col gap-4 text-sm text-zinc-400">
          <Link href="/organizer" className="hover:text-white">
            Organizer Panel
          </Link>
          <Link href="/attendee" className="hover:text-white">
            Attendee Dashboard
          </Link>
        </nav>

        <form action={signOutAction} className="mt-auto">
          <button
            type="submit"
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Sign Out
          </button>
        </form>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
