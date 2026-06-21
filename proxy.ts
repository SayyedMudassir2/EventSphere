import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type UserRole = "admin" | "organizer" | "attendee" | string;

// Helper to determine accurate destination paths based on registration profile data
function getDashboardPath(role: UserRole): string {
  // ✅ ROUTE GROUP FIX: Parenthesis folders like (dashboard) do not appear in the URL path.
  if (role === "admin") return "/organizer"; // points to app/(dashboard)/organizer/page.tsx
  if (role === "organizer") return "/organizer"; // points to app/(dashboard)/organizer/page.tsx
  return "/"; // The attendee dashboard is the root homepage (app/(dashboard)/page.tsx)
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

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

  // 1. Define Route Sets (Removed "/dashboard" since it doesn't exist in your URLs)
  const protectedRoutes = ["/organizer", "/attendee", "/admin"];
  const guestRoutes = ["/sign-in", "/sign-up"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  const isGuestRoute = guestRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // 2. Redirect logged-in users away from Auth pages (e.g. sign-in/sign-up)
  if (user && isGuestRoute) {
    const role = user.user_metadata?.role as UserRole;
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  // 3. Redirect guests away from Protected pages
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
