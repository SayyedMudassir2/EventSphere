// app/forgot-password/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Recovery | EventSphere",
  description:
    "Securely recover your enterprise event credential vectors or reset system access passes.",
  robots: {
    index: false, // Guardrail: Prevents search systems from listing functional authentication states
    follow: false,
  },
};
