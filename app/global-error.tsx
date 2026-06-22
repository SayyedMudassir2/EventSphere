"use client";

import { useEffect } from "react";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to production monitoring systems (e.g., Sentry, LogRocket, Datadog)
    console.error("CRITICAL_ROOT_ERROR:", error);
  }, [error]);

  return (
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] font-sans text-white p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-red-500">
              Application Error
            </h1>
            <p className="text-gray-400 text-sm">
              A critical structural error occurred. We have been notified and
              are looking into it.
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-gray-600 bg-gray-950 p-2 rounded select-all">
                ID: {error.digest}
              </p>
            )}
          </div>
          <button
            onClick={() => reset()}
            className="w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0a0a0f] transition hover:bg-gray-200 active:scale-[0.98]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
