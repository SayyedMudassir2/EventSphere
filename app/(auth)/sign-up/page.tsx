"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";

export default function SignUpPage() {
  // Directly bind the native action since its backend parameters match useActionState perfectly
  const [state, formAction, isPending] = useActionState(signUpAction, null);

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#040407]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create your{" "}
          <span className="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            EventSphere
          </span>{" "}
          account
        </h1>
        <p className="text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Next.js natively handles submission, tracking, and prevents double-submits */}
        <form
          action={formAction}
          className="space-y-5 bg-[#09090e] border border-zinc-800/80 p-8 rounded-xl shadow-2xl"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              placeholder="name@domain.com"
              className="w-full rounded-md border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              disabled={isPending}
              placeholder="••••••••"
              className="w-full rounded-md border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="role"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Join As
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                disabled={isPending}
                className="w-full appearance-none rounded-md border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 pr-8"
              >
                <option value="attendee" className="bg-[#09090e]">
                  Attendee (Discover & Book)
                </option>
                <option value="organizer" className="bg-[#09090e]">
                  Organizer (Host & Manage)
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {state?.error && (
            <div
              role="alert"
              className="rounded-md bg-red-950/40 border border-red-900/40 p-3 text-xs text-red-400 select-all"
            >
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 shadow-md shadow-indigo-600/10"
          >
            {isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
