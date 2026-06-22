import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | EventSphere",
    default: "EventSphere | Discover Live Concerts, Workshops & Sports Events",
  },
  description:
    "Discover and secure instant ticket access for elite music concerts, technical workshops, and premier sports events in your city.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#040407] text-white antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Structural Visual Anchor Shell */}
      <Navbar />

      <main className="flex flex-1 flex-col pt-16 outline-none" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
