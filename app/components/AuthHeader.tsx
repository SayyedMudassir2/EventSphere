import Link from "next/link";

export default function AuthHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-zinc-900 bg-[#040407]/80 backdrop-blur-md select-none will-change-transform"
      aria-label="Authentication"
    >
      <nav
        className="mx-auto flex max-w-7xl items-center px-4 py-3.5 sm:px-6 lg:px-8"
        aria-label="Brand"
      >
        {/* Core Brand Identity Vector Block */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
          aria-label="EventSphere Home"
        >
          <div className="rounded-lg bg-indigo-600 p-2 transition-colors duration-150 group-hover:bg-indigo-500">
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
      </nav>
    </header>
  );
}
