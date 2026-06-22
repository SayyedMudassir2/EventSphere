import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 select-none"
      aria-labelledby="cta-heading"
    >
      {/* 
        High-Fidelity Premium Conversion Module 
        Replaced harsh orange-blue gradients with a deep tech palette incorporating fine mesh pattern grids 
      */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#09090e] p-8 sm:p-12 lg:p-16 shadow-2xl shadow-indigo-950/5">
        {/* Hardware-Accelerated Static Background Mesh Matrix */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[16px_16px] will-change-transform"
          aria-hidden="true"
        />

        {/* Subtle Brand Ambient Glow Backing Layer */}
        <div
          className="absolute -left-1/4 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Micro-Value Hook */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3 w-3 fill-indigo-400/20" /> Launch Your
            Brand
          </div>

          {/* SEO Optimized Intent Conversion Header */}
          <h2
            id="cta-heading"
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl max-w-2xl leading-[1.15]"
          >
            Host Your Own Spectacular Live Experience
          </h2>

          {/* Value Prop Body Copy */}
          <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
            Reach thousands of active local attendees instantly. Use our premier
            event engine toolbelt to schedule listings, process tickets
            securely, and scale your organization audience.
          </p>

          {/* Tactical Micro-Interactive Target Button Group */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto text-xs font-bold tracking-wide uppercase">
            <Link
              href="/sign-up?role=organizer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-white shadow-md shadow-indigo-600/10 transition-all duration-150 hover:bg-indigo-500 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Start as Organizer
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 px-8 py-3.5 text-zinc-300 transition-all duration-150 hover:bg-zinc-800 hover:text-white active:scale-[0.98] outline-none focus-visible:border-zinc-700"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
