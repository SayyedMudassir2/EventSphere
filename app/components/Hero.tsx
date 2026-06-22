import Link from "next/link";
import {
  Music,
  Laptop,
  Trophy,
  Utensils,
  Palette,
  Briefcase,
} from "lucide-react";
import CategoryChip from "./CategoryChip";
import SearchBar from "./SearchBar";
import Stats from "./Stats";

const CATEGORIES = [
  { icon: Music, label: "Music" },
  { icon: Laptop, label: "Tech" },
  { icon: Trophy, label: "Sports" },
  { icon: Utensils, label: "Food" },
  { icon: Palette, label: "Arts" },
  { icon: Briefcase, label: "Business" },
] as const;

export default function Hero() {
  return (
    <section
      className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 pt-16 text-center select-none"
      aria-labelledby="hero-heading"
    >
      {/* High-Velocity Value Metric Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm animate-fade-in">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
        New premium live experiences added weekly
      </div>

      {/* SEO Intent Optimized Typography Headline Stack */}
      <h1
        id="hero-heading"
        className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
      >
        Discover Live Experiences <br className="hidden sm:inline" />
        <span className="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          That Inspire & Matter
        </span>
      </h1>

      {/* Conversion Framework Body Copy */}
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
        Secure instant ticket access for elite concerts, technical workshops,
        premier sports meets, and curated dining experiences in your city.
      </p>

      {/* Search Bar Input Context Section */}
      <div className="mt-10 w-full max-w-2xl mx-auto">
        <SearchBar />
      </div>

      {/* Clickable On-Page Discovery Category Vectors */}
      <nav
        className="mt-10 flex flex-wrap justify-center gap-2.5"
        aria-label="Browse by interest"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            href={`/events?category=${encodeURIComponent(cat.label.toLowerCase())}`}
            className="group block outline-none transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <CategoryChip icon={cat.icon} label={cat.label} />
          </Link>
        ))}
      </nav>

      {/* Dynamic Operational Trust Aggregates */}
      <div className="mt-16 w-full border-t border-zinc-900/60 pt-10">
        <Stats />
      </div>
    </section>
  );
}
