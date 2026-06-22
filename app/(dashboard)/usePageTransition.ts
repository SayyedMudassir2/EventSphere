"use client";

import { useTransition, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function usePageTransition() {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  // Reset the transition lock state automatically when the layout completes updates
  useEffect(() => {}, [pathname]);

  const navigateSafely = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  return { isPending, navigateSafely, activePath: pathname };
}
