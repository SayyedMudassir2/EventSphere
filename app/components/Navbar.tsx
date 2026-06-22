import Link from "next/link";
import { getUserSession } from "@/lib/auth-helpers";
import UserMenu from "@/app/components/UserMenu";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", access: "public" },
  { href: "/events", label: "Events", access: "public" },
  { href: "/organizer", label: "Organizer Panel", access: "organizer" },
  { href: "/admin", label: "Admin Panel", access: "admin" },
] as const;

export default async function Navbar() {
  const session = await getUserSession();
  const user = session?.user ?? null;
  const userRole = String(session?.role || "")
    .toLowerCase()
    .trim();

  return (
    <NavbarWrapper>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-900 bg-[#040407]/80 backdrop-blur-md select-none will-change-transform">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand Identity Vector Block */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group outline-none"
            aria-label="EventSphere Home"
          >
            <div className="rounded-lg bg-indigo-600 p-2 transition-colors duration-150 group-hover:bg-indigo-500 group-focus-visible:ring-2 group-focus-visible:ring-indigo-500">
              <svg
                className="h-4 w-4 text-white stroke-[2.2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white transition-opacity group-hover:opacity-90">
              EventSphere
            </span>
          </Link>

          {/* Core Layout Strategy Links */}
          <div className="hidden items-center gap-8 text-xs font-semibold tracking-wide uppercase md:flex">
            {NAV_LINKS.map((link) => {
              if (
                link.access !== "public" &&
                (!user || userRole !== link.access)
              )
                return null;

              const isDashboard =
                link.access === "admin" || link.access === "organizer";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors duration-150 outline-none focus-visible:text-indigo-400",
                    isDashboard
                      ? "text-indigo-400 hover:text-indigo-300 font-bold"
                      : "text-zinc-400 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Intent Capture Conversion CTA Flow */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {!user ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-zinc-400 hover:text-white transition-colors duration-150 outline-none focus-visible:text-indigo-400"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-indigo-600 px-5 py-2.5 text-white shadow-md shadow-indigo-600/10 transition-all duration-150 hover:bg-indigo-500 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Get Started Free
                </Link>
              </>
            ) : (
              <UserMenu user={user} />
            )}
          </div>
        </div>
      </nav>
    </NavbarWrapper>
  );
}
