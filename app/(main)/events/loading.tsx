import React from "react";

export default function Loading() {
  // Budgeting for 6 items prevents Layout Shift (CLS) on larger viewports
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div
      className="max-w-6xl mx-auto py-12 px-6 w-full"
      aria-label="Loading events calendar"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Page Title Skeleton with Strict Aspect Ratio */}
      <header className="mb-10 select-none pointer-events-none">
        <div className="h-10 w-48 bg-zinc-800/60 rounded-lg animate-pulse" />
      </header>

      {/* Grid Layout Configured for Core Web Vitals (CLS Prevention) */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {skeletonCards.map((index) => (
          <article
            key={index}
            className="flex flex-col h-105 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 select-none pointer-events-none"
          >
            {/* Aspect-Ratio Box to match actual event images exactly */}
            <div className="w-full aspect-video bg-zinc-800/60 rounded-xl mb-5 animate-pulse" />

            {/* Meta Tags (Date/Location) Placeholder */}
            <div className="h-4 bg-zinc-800/40 rounded w-1/4 mb-3 animate-pulse" />

            {/* Content Flex Container to push footer element down */}
            <div className="flex-1 space-y-3">
              {/* Event Title Line 1 & 2 */}
              <div className="h-6 bg-zinc-800/70 rounded w-11/12 animate-pulse" />
              <div className="h-6 bg-zinc-800/70 rounded w-2/3 animate-pulse" />

              {/* Event Description (Shorter lines for realism) */}
              <div className="h-4 bg-zinc-800/40 rounded w-full animate-pulse pt-2" />
              <div className="h-4 bg-zinc-800/40 rounded w-5/6 animate-pulse" />
            </div>

            {/* Bottom Action Area (Price / CTA button placeholder) */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800/50">
              <div className="h-5 bg-zinc-800/50 rounded w-16 animate-pulse" />
              <div className="h-9 bg-zinc-800/80 rounded-xl w-24 animate-pulse" />
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
