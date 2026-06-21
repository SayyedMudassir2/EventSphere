"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keeps the menu open when hovering in, clearing any pending close triggers
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  // Adds a micro-delay before closing so cursor movement across gaps doesn't close it instantly
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // 150ms buffer time
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700 hover:border-zinc-600 transition cursor-default"
      >
        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs text-white">
          {user.email?.[0].toUpperCase()}
        </div>
        <span className="text-sm text-white">
          {user.user_metadata?.full_name || "User"}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Invisible padding bridge to close physical gap between button and dropdown */}
          <div className="absolute right-0 h-4 w-full top-10" />

          <div className="absolute right-0 top-14 w-48 bg-[#0a0a0f] border border-zinc-800 rounded-xl p-2 shadow-2xl z-50">
            <div className="px-3 py-2 border-b border-zinc-800 mb-2">
              <p className="text-xs text-zinc-400">Signed in as</p>
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>
            <Link
              href="/profile"
              className="block px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg"
            >
              Profile
            </Link>
            <Link
              href="/my-bookings"
              className="block px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg"
            >
              My Bookings
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded-lg"
              >
                Sign Out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
