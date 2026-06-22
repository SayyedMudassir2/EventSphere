"use client";

import { useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function SearchInputCore() {
  const searchParams = useSearchParams();
  return (
    <input
      name="q"
      type="text"
      defaultValue={searchParams.get("q") || ""}
      placeholder="Search for concerts, workshops, or sports matches..."
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      aria-label="Search events catalog"
      className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none select-text"
    />
  );
}

export default function SearchBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = String(formData.get("q") || "").trim();

    if (query) {
      startTransition(() => {
        router.push(`/events?q=${encodeURIComponent(query)}`);
      });
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "relative flex w-full max-w-xl items-center rounded-full border border-zinc-800 bg-[#09090e]/60 p-1.5 backdrop-blur-md transition-all duration-150 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/30 will-change-[border-color,box-shadow]",
        isPending && "opacity-80 pointer-events-none",
      )}
    >
      <div className="flex flex-1 items-center pl-3">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
        ) : (
          <Search className="h-4 w-4 text-zinc-500 transition-colors duration-150" />
        )}

        {/* 
          Strict Static Optimization Boundary 
          Isolating useSearchParams protects your core above-the-fold landing bundle from de-optimizing into heavy CSR
        */}
        <Suspense
          fallback={
            <input
              disabled
              placeholder="Loading search channels..."
              className="w-full bg-transparent px-3 py-2 text-sm text-zinc-600 outline-none cursor-wait"
            />
          }
        >
          <SearchInputCore />
        </Suspense>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-indigo-600 px-6 py-2.5 text-xs font-bold tracking-wide uppercase text-white transition-all duration-150 hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        Search
      </button>
    </form>
  );
}
