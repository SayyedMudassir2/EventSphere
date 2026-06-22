import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-red-500">
            404 Error
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-400">
            The event or page you are looking for does not exist, has been
            moved, or is temporarily unavailable.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#0a0a0f] transition hover:bg-gray-200 active:scale-[0.98]"
        >
          Return to EventSphere
        </Link>
      </div>
    </div>
  );
}
