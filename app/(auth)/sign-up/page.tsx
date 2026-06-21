"use client";
import { useActionState } from "react";
import { signUpAction } from "@/app/actions/auth";

export default function SignUpPage() {
  const [state, action] = useActionState(signUpAction, null);

  return (
    <form action={action} className="max-w-md mx-auto p-12 space-y-4">
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
      <select name="role" className="w-full p-2 bg-zinc-900">
        <option value="attendee">Attendee</option>
        <option value="organizer">Organizer</option>
      </select>
      <button type="submit" className="bg-blue-600 px-4 py-2 w-full">
        Sign Up
      </button>
    </form>
  );
}
