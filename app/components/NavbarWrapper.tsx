"use client";

import React from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

interface NavbarWrapperProps {
  children: React.ReactNode;
}

export default function NavbarWrapper({ children }: NavbarWrapperProps) {
  const isVisible = useScrollDirection();

  return (
    <div
      className={`fixed top-0 w-full z-99 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {children}
    </div>
  );
}
