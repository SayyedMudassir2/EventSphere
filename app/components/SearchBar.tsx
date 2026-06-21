// app/components/SearchBar.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to events page with a search query param
      router.push(`/events?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-md bg-white/5 border border-white/10 rounded-full p-2 flex items-center"
    >
      <Search className="w-5 h-5 ml-3 text-white/50" />
      <input
        type="text"
        placeholder="Search for events..."
        className="w-full bg-transparent border-none outline-none px-4 py-2 text-white placeholder:text-white/30"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-medium transition"
      >
        Search
      </button>
    </form>
  );
}
