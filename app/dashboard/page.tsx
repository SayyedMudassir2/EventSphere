// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardPath, type UserRole } from "@/lib/auth-utils";
import { DashboardRedirectEngine } from "@/app/dashboard/DashboardRedirectEngine";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore
    .getAll()
    .find((c) => c.name.endsWith("-auth-token"));

  if (!authCookie?.value) redirect("/sign-in");

  try {
    const session = JSON.parse(authCookie.value);
    const user = session?.user;
    if (!user) redirect("/sign-in");

    const rawRole =
      user.user_metadata?.role ||
      user.app_metadata?.role ||
      user.role ||
      "attendee";
    const role = String(rawRole).toLowerCase().trim() as UserRole;
    const targetUrl = getDashboardPath(role);

    return <DashboardRedirectEngine targetUrl={targetUrl} role={role} />;
  } catch {
    redirect("/sign-in");
  }
}
