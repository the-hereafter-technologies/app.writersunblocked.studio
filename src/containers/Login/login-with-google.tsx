"use client";

import GoogleIcon from "./logo.svg";
import * as Styles from "./style";

function getSignupReturnTo(): string | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) {
    return undefined;
  }

  return `${siteUrl}/signup/profile`;
}

export const LoginWithGoogle = ({ mode }: { mode?: "signup" | "login" }) => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  const googleSignInUrl = (() => {
    if (!apiBase) return null;
    const params = new URLSearchParams();
    if (mode) params.set("mode", mode);
    if (mode === "signup") {
      const returnTo = getSignupReturnTo();
      if (returnTo) {
        params.set("returnTo", returnTo);
      }
    }
    const qs = params.toString();
    return `${apiBase}/auth/google${qs ? `?${qs}` : ""}`;
  })();

  return (
    <Styles.LoginWithGoogleButton
      type="button"
      onClick={() => {
        if (googleSignInUrl) {
          window.location.href = googleSignInUrl;
        }
      }}
      disabled={!googleSignInUrl}
      aria-disabled={!googleSignInUrl}
    >
      <GoogleIcon />
      Continue with Google
    </Styles.LoginWithGoogleButton>
  );
};
