"use server";

import { cookies } from "next/headers";

/**
 * Server function to clear authentication cookies.
 * Call this before redirecting to signup to ensure the user session is completely cleared.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();

  // Clear the JWT cookie on the current domain
  cookieStore.delete("jwt");

  // Also attempt to clear on the shared domain (if applicable in production)
  // The domain-scoped cookie will be automatically cleared when you set maxAge: 0
  cookieStore.set("jwt", "", {
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });
}
