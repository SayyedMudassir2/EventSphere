import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import WelcomeModal from "./components/WelcomeModal";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "EventSphere | Discover Events That Matter",
  description:
    "Find and book tickets for concerts, workshops, and sports events in your city.",
  keywords: ["events", "tickets", "concerts", "workshops", "event booking"],
  authors: [{ name: "Sayyed Misna" }],
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth antialiased", geist.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      {/* 
        Harden the body tag against browser extension DOM injections (e.g., ColorZilla's cz-shortcut-listen)
        This instantly eliminates the console hydration mismatch warning.
      */}
      <body
        className="min-h-screen bg-[#040407] font-sans text-white antialiased"
        suppressHydrationWarning
      >
        <WelcomeModal />
        <main className="flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
