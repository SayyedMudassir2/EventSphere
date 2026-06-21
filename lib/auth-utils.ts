// lib/auth-utils.ts
export type UserRole = "admin" | "organizer" | "attendee";

export function getDashboardPath(role?: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "organizer":
      return "/organizer";
    case "attendee":
      return "/attendee";
    default:
      return "/attendee";
  }
}
