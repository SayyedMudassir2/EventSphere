"use client";
import { signInAction } from "@/app/actions/auth";

export default function SignInPage() {
  return (
    <form action={signInAction} className="max-w-md mx-auto p-12 space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full p-2 bg-zinc-900"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full p-2 bg-zinc-900"
        required
      />
      <button type="submit" className="bg-green-600 px-4 py-2 w-full">
        Sign In
      </button>
    </form>
  );
}
