import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import WelcomeModal from "./components/WelcomeModal";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventSphere | Discover Events That Matter",
  description:
    "Find and book tickets for concerts, workshops, and sports events in your city.",
  keywords: ["events", "tickets", "concerts", "workshops", "event booking"],
  authors: [{ name: "Sayyed Misna" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth", "font-sans", geist.variable)}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body
        className={`${inter.className} bg-[#0a0a0f] text-white antialiased`}
        suppressHydrationWarning={true}
      >
        <header className="flex justify-end items-center p-4 gap-4 h-16"></header>
        <WelcomeModal />
        <main className="flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
