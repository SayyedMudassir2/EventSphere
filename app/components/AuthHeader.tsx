import Link from "next/link";

export default function AuthHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-slate-950 border-b border-white/10"
      aria-label="Authentication Header"
    >
      <nav
        className="mx-auto max-w-7xl px-6 py-4 flex items-center"
        aria-label="Global Brand Navigation"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg outline-offset-4"
          aria-label="Navigate to EventSphere Home"
        >
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            EventSphere
          </span>
        </Link>
      </nav>
    </header>
  );
}
