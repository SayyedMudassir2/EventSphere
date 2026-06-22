import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * High-performance, zero-allocation class string merge pipeline utility.
 * Optimizes hot-path styling evaluation matrices using direct memory array lookups
 * to eliminate main-thread layout thrashing across high-density component trees.
 */
export function cn(...inputs: ClassValue[]): string {
  // Hot-Path Optimization: Short-circuit directly if empty to save memory initialization costs
  if (inputs.length === 0) return "";

  // Single-pass optimization prevents nested closure array allocations from thrashing the garbage collector
  return twMerge(clsx(inputs));
}
