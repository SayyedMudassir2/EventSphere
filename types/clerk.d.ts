import { CustomJwtSessionClaims } from "@clerk/nextjs/server";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "organizer" | "member";
    };
  }
}
