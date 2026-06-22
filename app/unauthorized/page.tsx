"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userRole = String(searchParams.get("role") || "attendee")
    .toLowerCase()
    .trim();

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-[#09090e] p-6 sm:p-10 text-center shadow-2xl shadow-black/50 select-none animate-fade-in">
      {/* High-Fidelity Tactical Visual Anchor */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
        <ShieldAlert className="h-6 w-6 stroke-[1.8]" />
      </div>

      <h1 className="mt-5 text-xl font-bold tracking-tight text-white sm:text-2xl">
        Access Disallowed
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        Your current authentication tier token (
        <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
          {userRole}
        </span>
        ) does not hold valid clearance privileges to traverse this operational
        console pathway.
      </p>

      {/* Action Escape Nodes Vector Block */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 text-xs font-bold uppercase tracking-wide">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-3 text-zinc-300 transition-all duration-150 hover:bg-zinc-800 hover:text-white active:scale-[0.98] outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Go Back
        </button>
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white shadow-md shadow-indigo-600/10 transition-all duration-150 hover:bg-indigo-500 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Home className="h-3.5 w-3.5" /> Return Home
        </button>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-[#040407] px-4 py-12 sm:px-6 lg:px-8 text-white">
      {/* 
        Strict Static Optimization Boundary:
        Isolating route-search parameters prevents Next.js from de-optimizing the complete dashboard build graph 
      */}
      <Suspense
        fallback={
          <div className="w-full max-w-md h-72 rounded-2xl border border-zinc-800/80 bg-[#09090e] p-10 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-zinc-900" />
            <div className="h-4 bg-zinc-900 rounded w-1/3" />
            <div className="h-3 bg-zinc-900 rounded w-2/3" />
          </div>
        }
      >
        <UnauthorizedContent />
      </Suspense>
    </main>
  );
}
