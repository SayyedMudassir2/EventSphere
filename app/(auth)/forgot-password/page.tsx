"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import {
  ArrowLeft,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Inline helper for clean class merging without extra dependencies
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Client-side pre-flight email syntax validation
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Executes inside a React Transition to keep UI interactions non-blocking
    startTransition(async () => {
      try {
        // Core Next.js Server Action Execution
        await requestPasswordReset(trimmedEmail);
        setIsSubmitted(true);
      } catch (err: any) {
        // Generic fallback messaging to mitigate malicious email enumeration attacks
        setError("An error occurred. Please try again later.");
      }
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col justify-center bg-[#09090b] px-4 py-12 text-zinc-100 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      {/* Structural Ambient Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950 to-zinc-950 pointer-events-none" />

      <div className="relative mx-auto w-full max-w-md space-y-6">
        {/* Branding & Back Navigation Links */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Sign In
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-inner text-indigo-400 backdrop-blur-md">
            <KeyRound className="h-5 w-5 stroke-[1.5]" />
          </div>

          <header className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {isSubmitted ? "Check your inbox" : "Forgot password?"}
            </h1>
            <p className="mx-auto max-w-sm text-sm text-zinc-400 leading-relaxed">
              {isSubmitted
                ? `If an account exists for ${email}, you will receive a secure reset loop link shortly.`
                : "No worries. Enter your registered email address, and we'll dispatch link credentials instantly."}
            </p>
          </header>
        </div>

        {/* Form Entry / Core Card Presentation Container */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Dynamic Error Messaging Alert Layer */}
              {error && (
                <div
                  className="flex items-start gap-3 rounded-xl border border-red-900/30 bg-red-950/10 p-3.5 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 stroke-[1.8]" />
                  <p className="font-medium leading-normal">{error}</p>
                </div>
              )}

              {/* Form Input Control */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <Mail className="h-4 w-4 stroke-[1.8]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isPending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={cn(
                      "block w-full rounded-xl border bg-zinc-950/40 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 backdrop-blur-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50",
                      error
                        ? "border-red-900/50 focus:border-red-500 focus:ring-red-500/10"
                        : "border-zinc-800/80",
                    )}
                  />
                </div>
              </div>

              {/* Interactive Submit Target Button */}
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-indigo-500 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
                    <span>Processing Secure Request...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          ) : (
            /* Conversion Confirmation Success State View */
            <div className="space-y-6 py-2 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/30 border border-emerald-800/50 text-emerald-400">
                <CheckCircle2 className="h-5 w-5 stroke-[1.8]" />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Didn&apos;t receive the electronic dispatch authorization?
                  Check your secondary folders or spam structures.
                </p>
              </div>

              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
              >
                Try an alternative address
              </button>
            </div>
          )}
        </div>

        {/* Global Context Help Footer */}
        <footer className="text-center">
          <p className="text-xs text-zinc-500">
            Need localized engineer pipeline support?{" "}
            <a
              href="mailto:Support@event-sphere.com"
              className="text-zinc-400 hover:text-zinc-300 underline underline-offset-4 transition-colors"
            >
              Contact Systems Desk
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
