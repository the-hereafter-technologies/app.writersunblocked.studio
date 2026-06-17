import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROFILE_REQUIRED_PATHS = [
  "/",
  "/story",
  "/settings",
  "/account",
  "/onboarding/story",
];

function generateOnboardingId() {
  return `ob-${Math.random().toString(36).slice(2, 11)}`;
}

async function fetchCurrentUser(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const cookie = req.headers.get("cookie");

  if (!apiBase || !cookie) {
    return null;
  }

  try {
    const res = await fetch(`${apiBase}/users/me`, {
      headers: { cookie },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as {
      name?: string | null;
      handle?: string | null;
    };
  } catch {
    return null;
  }
}

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
  const requiresCompleteProfile = PROFILE_REQUIRED_PATHS.some((p) =>
    pathname.startsWith(p)
  );
  const isUserOnboardingRoute = pathname.startsWith("/onboarding/user");
  const hasJwtCookie = Boolean(req.cookies.get("jwt")?.value);

  if (isProtected && !hasJwtCookie) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasJwtCookie && requiresCompleteProfile && !isUserOnboardingRoute) {
    const me = await fetchCurrentUser(req);
    const isProfileComplete =
      Boolean(me?.name?.trim()) && Boolean(me?.handle?.trim());

    if (!isProfileComplete) {
      const onboardingUrl = new URL(
        `/onboarding/user/${generateOnboardingId()}`,
        req.url
      );
      return NextResponse.redirect(onboardingUrl);
    }
  }

  if (hasJwtCookie && isUserOnboardingRoute) {
    const me = await fetchCurrentUser(req);
    const isProfileComplete =
      Boolean(me?.name?.trim()) && Boolean(me?.handle?.trim());

    if (isProfileComplete) {
      const dashboardUrl = new URL("/", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
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
