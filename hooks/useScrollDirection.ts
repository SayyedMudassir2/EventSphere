"use client";

import { useState, useEffect, useRef } from "react";

/**
 * High-performance, memory-isolated viewport scroll direction vector hook.
 * Engineered with RequestAnimationFrame throttling to guarantee 60FPS thread execution.
 */
export function useScrollDirection(threshold = 100) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Sync starting baseline immediately to avoid hydration structural jumps on first load
    lastScrollY.current = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const deltaY = lastScrollY.current - currentScrollY;

      if (currentScrollY <= threshold) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false); // Scrolling Down: Smoothly collapse the global navigation
      } else if (deltaY > 15) {
        setIsVisible(true); // Scrolling Up: Intent captured - instantly display the menu with 15px deadzone
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false; // Reset lock to allow the next window animation frame execution loop
    };

    const handleScrollThrottled = () => {
      if (!ticking.current) {
        // Offloads loop polling calculations directly into the browser's native compositing layer tick
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    // Passive listener tells the browser that this script will never intercept or prevent native touch scroll loops
    window.addEventListener("scroll", handleScrollThrottled, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollThrottled);
    };
  }, [threshold]);

  return isVisible;
}
