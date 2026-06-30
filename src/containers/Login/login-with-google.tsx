"use client";

import { getSiteUrl } from "@/lib/site-url";
import { ContinueWithGoogle } from "@writersunblocked/ui/app";

export const LoginWithGoogle = () => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  const googleSignInUrl = (() => {
    if (!apiBase) return null;

    const params = new URLSearchParams({ mode: "login" });
    const appOrigin =
      typeof window !== "undefined" ? window.location.origin : getSiteUrl();
    params.set("returnTo", `${appOrigin.replace(/\/$/, "")}/`);

    return `${apiBase}/auth/google?${params.toString()}`;
  })();

  return (
    <ContinueWithGoogle
      onClick={() => {
        if (googleSignInUrl) {
          window.location.href = googleSignInUrl;
        }
      }}
      disabled={!googleSignInUrl}
    />
  );
};
