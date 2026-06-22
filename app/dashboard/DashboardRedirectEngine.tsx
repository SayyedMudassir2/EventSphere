// app/dashboard/DashboardRedirectEngine.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RedirectProps {
  targetUrl: string;
  role: string;
}

export function DashboardRedirectEngine({ targetUrl, role }: RedirectProps) {
  const router = useRouter();

  // Optimized parallel prefetch & immediate route push strategy
  useEffect(() => {
    router.prefetch(targetUrl);
    router.replace(targetUrl);
  }, [targetUrl, router]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#040407] px-6 text-center antialiased select-none">
      {/* Premium Cinematic Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full space-y-6">
        {/* Luxury Micro-Spinner Container */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[1.5px] border-zinc-800/40" />
          <div className="absolute inset-0 rounded-full border-[1.5px] border-t-zinc-200 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-duration-[650ms]" />
        </div>

        {/* Text Presentation Tier */}
        <div className="space-y-1.5">
          <h1 className="text-[13px] font-medium tracking-[0.06em] text-zinc-200 uppercase font-sans">
            Initializing Console
          </h1>
          <p className="text-[11px] tracking-wide text-zinc-500 font-normal">
            Redirecting profile context to secure{" "}
            <span className="text-zinc-400 capitalize font-mono font-medium">
              {role}
            </span>{" "}
            node...
          </p>
        </div>
      </div>
    </div>
  );
}
