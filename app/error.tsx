"use client";

import { useEffect, startTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("APPLICATION_ERROR:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-400">
          Failed to load this section of the page.
        </p>
        <button
          onClick={() => startTransition(() => reset())}
          className="rounded-md bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-500"
        >
          Retry Section
        </button>
      </div>
    </div>
  );
}
