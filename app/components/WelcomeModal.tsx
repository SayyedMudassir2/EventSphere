"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  GraduationCap as Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Direct, zero-delay localStorage verification checkpoint
    const hasVisited = localStorage.getItem("hasVisitedEventSphere");
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem("hasVisitedEventSphere", "true");
    }
  }, []);

  // Structural Guard: Prevents compilation layout shifting or DOM server mismatch hydration flashes
  if (!mounted || !isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none animate-fade-in"
    >
      {/* Premium High-Fidelity Modal Architecture Box */}
      <div className="w-full max-w-md rounded-3xl border border-zinc-800/80 bg-[#09090e] p-6 sm:p-8 text-center shadow-2xl shadow-black/80 relative overflow-hidden transform transition-all duration-300 scale-[1.01] will-change-transform">
        {/* Subtle Ambient Decorative Radial Glow Background Layer */}
        <div
          className="absolute -right-20 -top-20 -z-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center space-y-5">
          {/* High-Fidelity Tactical Branding Visual Core Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="h-5 w-5 fill-indigo-400/20 stroke-[1.8]" />
          </div>

          {/* Typography Hierarchy Headline Stack */}
          <div className="space-y-1.5">
            <h2
              id="modal-headline"
              className="text-xl font-bold tracking-tight text-white sm:text-2xl"
            >
              Welcome to EventSphere
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Interactive Scholar Engineering Showcase
            </p>
          </div>

          {/* Intent Core Value Copywriting Statement */}
          <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
            Hi, I&apos;m{" "}
            <span className="font-bold text-white">Sayyed Misna</span>. This
            ecosystem stands as a production-grade showcase of my system
            architecture work. I am currently spearheading specialized technical
            models as a computer science scholar at
            <span className="font-semibold text-indigo-300">
              {" "}
              Ismail Yusuf College
            </span>
            .
          </p>

          {/* Academic Meta Badge Matrix Container */}
          <div className="w-full rounded-xl bg-zinc-950/40 border border-zinc-900/60 p-3 text-[11px] font-medium text-zinc-500 flex items-center gap-3 text-left">
            <GraduationCap className="h-4 w-4 text-zinc-600 shrink-0 stroke-[1.5]" />
            <p className="leading-normal">
              S.Y. B.Sc. Computer Science <br />
              <span className="text-zinc-600 font-normal">
                Ismail Yusuf Academic Registry
              </span>
            </p>
          </div>

          {/* High-Velocity Micro-Interactive Conversion Prompt Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-600/10 transition-all duration-150 hover:bg-indigo-500 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Explore Core Project
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
