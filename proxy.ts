// proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

type UserRole = "admin" | "organizer" | "attendee";

// Helper to determine accurate destination paths based on registration profile data
function getDashboardPath(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "organizer") return "/organizer";
  return "/attendee";
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });
  const path = request.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role as UserRole;

  const protectedRoutes = ["/organizer", "/attendee", "/admin"];
  const guestRoutes = ["/sign-in", "/sign-up"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  const isGuestRoute = guestRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Redirect guests away from Protected pages
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  // Redirect logged-in users away from Auth pages (e.g. sign-in/sign-up)
  if (user && isGuestRoute) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  // Strict RBAC (Role Based Access Control) - Admin bypassed entirely
  if (user && role !== "admin") {
    if (path.startsWith("/organizer") && role !== "organizer") {
      return NextResponse.redirect(
        new URL(`/unauthorized?role=${role}`, request.url),
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
