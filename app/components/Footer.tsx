import React from "react";
import Link from "next/link";

export default function Footer() {
  // Category array for easy maintenance
  const categories = ["Music", "Tech", "Sports", "Food", "Arts", "Business"];

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">EventSphere</h2>
          <p className="text-gray-400 max-w-sm">
            The ultimate platform to discover, create, and book amazing events
            near you.
          </p>
        </div>

        {/* Platform Column */}
        <div>
          <h3 className="font-semibold mb-4">Platform</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>
              <Link
                href="/events"
                className="hover:text-white transition-colors"
              >
                Browse Events
              </Link>
            </li>
            <li>
              <Link
                href="/sign-up"
                className="hover:text-white transition-colors"
              >
                Create Account
              </Link>
            </li>
            <li>
              <Link
                href="/organizer/create"
                className="hover:text-white transition-colors"
              >
                Host an Event
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories Column */}
        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/events?category=${category.toLowerCase()}`}
                  className="hover:text-white transition-colors"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
        © 2026 EventSphere. All rights reserved.
        <div className="text-xs mt-4 space-y-2">
          <div>
            This is the project of{" "}
            <b>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                Sayyed Misna
              </a>
            </b>
            . Studying in S.Y. B.Sc. C.S(Computer Science) from Ismail Yusuf
            College.
          </div>
          <div className="text-gray-400 space-x-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              View Source Code
            </a>
            <span>|</span>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <span>|</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
