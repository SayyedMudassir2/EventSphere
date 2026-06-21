// app/components/Hero.tsx
import React from "react";
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

const Hero = () => {
  const categories = [
    { icon: Music, label: "Music" },
    { icon: Laptop, label: "Tech" },
    { icon: Trophy, label: "Sports" },
    { icon: Utensils, label: "Food" },
    { icon: Palette, label: "Arts" },
    { icon: Briefcase, label: "Business" },
  ];

  return (
    <main className="flex flex-col items-center justify-center pt-20 px-4 text-center">
      {/* Badge */}
      <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs mb-6 opacity-70">
        • New events added weekly
      </div>

      {/* Headline */}
      <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
        Discover Events <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-orange-400">
          That Matter
        </span>
      </h1>

      <p className="max-w-lg text-lg opacity-60 mb-10">
        Find concerts, workshops, sports meets, and more. Book tickets in
        seconds and create unforgettable memories.
      </p>

      <SearchBar />

      {/* Clickable Categories */}
      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {categories.map((category) => (
          <Link
            key={category.label}
            href={`/events?category=${encodeURIComponent(category.label)}`}
            className="block cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <CategoryChip icon={category.icon} label={category.label} />
          </Link>
        ))}
      </div>

      <Stats />
    </main>
  );
};

export default Hero;
