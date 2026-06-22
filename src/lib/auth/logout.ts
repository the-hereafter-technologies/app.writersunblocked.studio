"use server";

import { cookies } from "next/headers";

/**
 * Server function to clear authentication cookies.
 * Call this before redirecting to signup to ensure the user session is completely cleared.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  const domain = process.env.AUTH_COOKIE_DOMAIN;

  cookieStore.delete("jwt");

  cookieStore.set("jwt", "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  if (domain) {
    cookieStore.set("jwt", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      domain,
    });
  }
}
