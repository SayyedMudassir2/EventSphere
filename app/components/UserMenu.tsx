"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Ticket, LogOut, ChevronDown } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

type UserMenuProps = {
  user: {
    email?: string;
    user_metadata?: { full_name?: string };
  };
};

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Intent intentional closure handler
  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  // Modern Accessibility Barrier: Close modal if an external click vector falls outside bounding boxes
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const userInitial = user.email?.[0]?.toUpperCase() || "E";
  const userFullName = user.user_metadata?.full_name || "Account Profile";

  return (
    <div
      ref={containerRef}
      className="relative inline-block select-none font-sans"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        Tactile User Trigger Button
        Engineered with clean keyboard toggle parameters and WAI-ARIA states 
      */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-[#09090e]/60 px-4 py-2 text-xs font-semibold tracking-wide text-zinc-200 backdrop-blur-md outline-none transition focus-visible:border-indigo-500/50 focus-visible:ring-1 focus-visible:ring-indigo-500/30 group will-change-[border-color,background-color]"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black tracking-normal text-white">
          {userInitial}
        </div>
        <span className="max-w-30 truncate text-zinc-300 transition-colors group-hover:text-white">
          {userFullName}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ease-out group-hover:text-zinc-400",
            isOpen && "rotate-180 text-indigo-400",
          )}
        />
      </button>

      {/* Dropdown Surface Canvas */}
      {isOpen && (
        <>
          {/* Invisible padding bridge layer eliminating tracking gaps on diagonal cursor movement layouts */}
          <div
            className="absolute right-0 h-4 w-full top-9 z-40"
            aria-hidden="true"
          />

          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 top-12 z-50 w-52 origin-top-right rounded-xl border border-zinc-800 bg-[#09090e] p-1.5 shadow-2xl shadow-black/80 animate-fade-in will-change-[transform,opacity]"
          >
            {/* Identity Profile Context Tag */}
            <div className="px-2.5 py-2 border-b border-zinc-900 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                Signed in as
              </span>
              <span className="text-xs font-semibold text-zinc-300 truncate block mt-0.5">
                {user.email}
              </span>
            </div>

            {[
              { href: "/profile", label: "Profile Settings", icon: User },
              { href: "/my-bookings", label: "My Passes Wallet", icon: Ticket },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                role="menuitem"
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-400 transition-colors duration-150 hover:bg-zinc-900/60 hover:text-white outline-none focus-visible:bg-zinc-900/60 focus-visible:text-white group"
              >
                <link.icon className="h-3.5 w-3.5 text-zinc-500 transition-colors group-hover:text-indigo-400 shrink-0 stroke-[1.8]" />
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="my-1 border-t border-zinc-900" aria-hidden="true" />

            {/* Account Exit Pipeline */}
            <form action={signOutAction} onSubmit={closeMenu}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-red-400/90 transition-colors duration-150 hover:bg-red-950/10 hover:text-red-300 outline-none focus-visible:bg-red-950/10 focus-visible:text-red-300 group"
              >
                <LogOut className="h-3.5 w-3.5 text-red-500/70 transition-colors group-hover:text-red-400 shrink-0 stroke-[1.8]" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
