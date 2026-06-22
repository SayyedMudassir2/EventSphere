import Link from "next/link";

const PLATFORM_LINKS = [
  { href: "/events", label: "Browse Events" },
  { href: "/sign-up", label: "Create Account" },
  { href: "/organizer/create", label: "Host an Event" },
] as const;

const CATEGORIES = [
  "Music",
  "Tech",
  "Sports",
  "Food",
  "Arts",
  "Business",
] as const;

const SOCIAL_LINKS = [
  { href: "https://github.com/sayyedmisna/event-sphere", label: "Source Code" },
  { href: "https://www.linkedin.com/in/misnasayyed/", label: "LinkedIn" },
  { href: "https://github.com/sayyedmisna/", label: "GitHub" },
] as const;

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-zinc-900 bg-[#040407] pt-12 pb-6 tracking-tight select-none"
      aria-label="Global Site Sitemap"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Author Authority Content Block */}
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-lg font-bold text-white tracking-tight">
            EventSphere
          </h2>
          <p className="text-xs leading-relaxed text-zinc-400 max-w-xs sm:text-sm">
            The premier platform to discover, design, and book elite tickets for
            local concerts, workshops, and sports spectacles near you.
          </p>
          <div className="text-[11px] leading-relaxed text-zinc-500 max-w-sm pt-2">
            Engineered by{" "}
            <a
              href="https://www.linkedin.com/in/misnasayyed/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-400 hover:text-indigo-400 transition-colors underline outline-none"
            >
              Sayyed Misna
            </a>
            , S.Y. B.Sc. Computer Science scholar at Ismail Yusuf College.
          </div>
        </div>

        {/* Semantic Action Navigation Track */}
        <nav className="space-y-4" aria-label="Platform Essentials">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Platform
          </h3>
          <ul className="space-y-2.5 text-xs font-medium">
            {PLATFORM_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-400 transition-colors duration-150 hover:text-white outline-none focus-visible:text-indigo-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Semantic Category Discovery Track */}
        <nav className="space-y-4" aria-label="Event Categories">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Categories
          </h3>
          <ul className="space-y-2.5 text-xs font-medium">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/events?category=${cat.toLowerCase()}`}
                  className="text-zinc-400 transition-colors duration-150 hover:text-white outline-none focus-visible:text-indigo-400"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Copyright & Core Repository Tracking Layer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-zinc-500">
        <span>
          &copy; {new Date().getFullYear()} EventSphere. All rights reserved.
        </span>

        <nav
          className="flex items-center gap-4 text-zinc-400"
          aria-label="Developer Profiles"
        >
          {SOCIAL_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center gap-4">
              {i > 0 && (
                <span className="text-zinc-800" aria-hidden="true">
                  |
                </span>
              )}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-150 outline-none focus-visible:text-indigo-400"
              >
                {link.label}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
