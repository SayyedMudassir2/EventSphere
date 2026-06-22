"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, CircleUserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type SerializedItem = { id: string; href: string; label: string };

const ICON_MAP = {
  admin: CircleUserRound,
  organizer: LayoutDashboard,
  attendee: CalendarDays,
} as const;

export function ActiveDesktopLinks({ items }: { items: SerializedItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      className="space-y-1 text-sm font-medium tracking-tight"
      aria-label="Main Console"
    >
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = ICON_MAP[item.id as keyof typeof ICON_MAP] || CalendarDays;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-400 transition-all duration-150 border select-none group will-change-[background-color,color,border-color]",
              isActive
                ? "bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20 shadow-sm shadow-indigo-500/5"
                : "border-transparent hover:bg-zinc-900/60 hover:text-white",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 stroke-[1.8] transition-colors duration-150",
                isActive
                  ? "text-indigo-400"
                  : "text-zinc-500 group-hover:text-indigo-400",
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
