"use client";

import { useEffect } from "react";

/**
 * Sets a `referredBy` browser cookie on mount.
 * Rendered on the invite page so the referral code survives navigation
 * and is picked up by ReferralApplier once the user authenticates.
 */
export const ReferralCookieSetter = ({ code }: { code: string }) => {
  useEffect(() => {
    if (!code) return;
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    // biome-ignore lint: referral codes are not secrets; document.cookie is the only browser API for non-httpOnly cookies
    document.cookie = `referredBy=${encodeURIComponent(code.toUpperCase())}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }, [code]);

  return null;
};
