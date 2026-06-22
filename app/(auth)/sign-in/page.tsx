"use client";

import { useActionState, startTransition } from "react";
import Link from "next/link";
import { signInAction } from "@/app/actions/auth";

// Staff engineering type-fix wrapper to handle legacy single-argument server actions cleanly
type ActionResponse = { error?: string | null } | null;

const wrappedSignInAction = async (
  _prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> => {
  try {
    await signInAction(formData);
    return null;
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please try again.",
    };
  }
};

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(
    wrappedSignInAction,
    null,
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Welcome back to{" "}
          <span className="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            EventSphere
          </span>
        </h1>
        <p className="text-sm text-zinc-400">
          New to EventSphere?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Get Started for Free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form
          onSubmit={handleSubmit}
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isPending}
              placeholder="••••••••"
              className="w-full rounded-md border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
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
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
