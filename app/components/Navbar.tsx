import React from "react";
import UserMenu from "@/app/components/UserMenu";
import Link from "next/link";
import { getUserSession } from "@/lib/auth-helpers";
import NavbarWrapper from "@/app/components/NavbarWrapper";

export default async function Navbar() {
  const { user, role } = await getUserSession();

  return (
    <NavbarWrapper>
      <nav className="w-full bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between py-6 px-8 max-w-7xl mx-auto">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  strokeWidth="2"
                />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              EventSphere
            </span>
          </Link>

          {/* Center Navigation Links */}
          <div className="flex gap-8 text-sm font-medium items-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>

            <Link
              href="/events"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Events
            </Link>

            {/* Dynamic Role-Based Panel Rendering */}
            {user && role === "organizer" && (
              <Link
                href="/dashboard/organizer"
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
              >
                Organizer Panel
              </Link>
            )}

            {user && role === "admin" && (
              <Link
                href="/admin"
                className="text-red-400 hover:text-red-300 font-bold transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-6">
            {!user ? (
              /* Signed Out Links */
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all shadow-lg shadow-indigo-900/20"
                >
                  Get Started for free
                </Link>
              </>
            ) : (
              /* Signed In Profile Only */
              <UserMenu user={user} />
            )}
          </div>
        </div>
      </nav>
    </NavbarWrapper>
  );
}
