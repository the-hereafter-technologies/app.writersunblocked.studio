const JWT_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function getJwtCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const domain = process.env.AUTH_COOKIE_DOMAIN;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && domain ? ("none" as const) : ("lax" as const),
    ...(domain ? { domain } : {}),
    maxAge: JWT_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  };
}
