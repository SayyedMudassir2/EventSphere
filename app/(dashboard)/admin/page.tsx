// app/dashboard/admin/page.tsx
import { getUserSession } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const { user, role } = await getUserSession();

  if (!user) redirect("/sign-in");
  if (role !== "admin") redirect("/dashboard"); // Only admins can see this

  return (
    <main className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-red-500">Admin Control Panel</h1>
      <p>Manage system-wide settings, users, and platform analytics here.</p>
    </main>
  );
}
