"use client";

import { useState } from "react";
import { usePageTransition } from "./usePageTransition";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  CircleUserRound,
  Loader2,
} from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

type SerializedNavItem = { id: string; href: string; label: string };

const CLIENT_ICON_MAP = {
  admin: CircleUserRound,
  organizer: LayoutDashboard,
  attendee: CalendarDays,
} as const;

export function MobileNav({
  filteredNavItems,
  userRole,
}: {
  filteredNavItems: SerializedNavItem[];
  userRole: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, navigateSafely, activePath } = usePageTransition();

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    if (activePath !== href) navigateSafely(href);
  };

  return (
    <>
      {/* Hardware-Accelerated Layout Synchronization Veil */}
      {isPending && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#040407]/70 backdrop-blur-md select-none pointer-events-none animate-fade-in">
          <div className="flex flex-col items-center gap-3 bg-[#09090e] border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            <span className="text-xs font-medium tracking-wide text-zinc-400">
              Syncing workspace assets...
            </span>
          </div>
        </div>
      )}

      <header className="flex h-14 items-center justify-between border-b border-zinc-900 bg-[#09090e] px-4 md:hidden select-none">
        <span className="text-base font-bold tracking-tight text-white">
          EventSphere
        </span>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open sheet menu"
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Backdrop Dimmer Shield */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden will-change-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Sheet Viewport Grid */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-70 transform flex-col justify-between bg-[#09090e] p-5 shadow-2xl transition-transform duration-200 ease-out md:hidden border-l border-zinc-900 will-change-transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-4 select-none">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Navigation
              </span>
              <span className="inline-block rounded-md bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-indigo-400">
                {userRole}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close sheet menu"
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="space-y-1 text-sm font-medium tracking-tight"
            aria-label="Mobile Navigation Drawer"
          >
            {filteredNavItems.map((item) => {
              const isActive =
                activePath === item.href ||
                activePath.startsWith(`${item.href}/`);
              const Icon =
                CLIENT_ICON_MAP[item.id as keyof typeof CLIENT_ICON_MAP] ||
                CalendarDays;

              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-400 border select-none transition-all duration-150 text-left will-change-[background-color,color,border-color]",
                    isActive
                      ? "bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20 shadow-sm shadow-indigo-500/5"
                      : "border-transparent hover:bg-zinc-900/60 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 stroke-[1.8] transition-colors duration-150",
                      isActive ? "text-indigo-400" : "text-zinc-500",
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <form action={signOutAction} className="border-t border-zinc-900 pt-4">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-150 hover:bg-red-950/10 hover:text-red-300 outline-none"
          >
            <LogOut className="h-4 w-4 text-red-500/80 shrink-0 stroke-[1.8]" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </>
  );
}
