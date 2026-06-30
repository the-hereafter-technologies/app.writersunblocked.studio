import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedPaths = [
    "/",
    "/story",
    "/settings",
    "/account",
    "/onboarding",
  ];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const hasJwtCookie = Boolean(req.cookies.get("jwt")?.value);

  if (isProtected && !hasJwtCookie) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/(app)/:path*",
    "/story/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
  ],
};
