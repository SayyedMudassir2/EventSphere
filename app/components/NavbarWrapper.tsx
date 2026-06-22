"use client";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

interface NavbarWrapperProps {
  children: React.ReactNode;
}

export default function NavbarWrapper({ children }: NavbarWrapperProps) {
  const isVisible = useScrollDirection();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-transform duration-300 ease-in-out will-change-transform",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      {children}
    </header>
  );
}
