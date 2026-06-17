"use client";

import GoogleIcon from "./logo.svg";
import * as Styles from "./style";

export const LoginWithGoogle = ({ mode }: { mode?: "signup" | "login" }) => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  const googleSignInUrl = (() => {
    if (!apiBase) return null;
    const params = new URLSearchParams();
    if (mode) params.set("mode", mode);
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
