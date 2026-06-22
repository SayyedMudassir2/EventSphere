import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authenticate | EventSphere",
  description:
    "Sign in or create your account on EventSphere to discover and manage events.",
  robots: { index: false, follow: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#040407]">
      {/* Brand Navigation Header */}
      <header className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-block text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          EventSphere
        </Link>
      </header>

      {/* Structured Viewport Viewport Centering Area */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
