"use client";

import { nestApiRequest } from "@/lib/nest-api";
import { useEffect } from "react";

function getReferredByCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )referredBy=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function clearReferredByCookie() {
  // biome-ignore lint: referral codes are not secrets; document.cookie is the only browser API for clearing non-httpOnly cookies
  document.cookie =
    "referredBy=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
}

/**
 * Reads the `referredBy` cookie set on the invite page.
 * If present, calls POST /users/me/referral/apply immediately and clears
 * the cookie so it cannot re-apply on refresh. If the referral is applied
 * a sessionStorage flag is set so the onboarding checkout slide can surface
 * the 30-day trial messaging.
 */
export const ReferralApplier = () => {
  useEffect(() => {
    const code = getReferredByCookie();
    if (!code) return;

    // Clear immediately — prevent double-apply on refresh
    clearReferredByCookie();

    nestApiRequest<{ applied: boolean; trialEndsAt?: string }>({
      path: "/users/me/referral/apply",
      method: "POST",
      body: { code },
    })
      .then((result) => {
        if (result.applied) {
          sessionStorage.setItem("referral_just_applied", "1");
        }
      })
      .catch(() => {
        // Silently swallow — referral is a bonus, not critical path
      });
  }, []);

  return null;
};
