"use client";

import { useState } from "react";
import { nestApiRequest } from "@/lib/nest-api";
import { Button } from "../Button";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await nestApiRequest({
        path: "/auth/logout",
        method: "POST",
      });
    } catch {
      // Even if logout fails, send the user back to marketing.
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <Button
      type="button"
      // variant="ghost"
      loading={loading}
      onClick={handleSignOut}
      label="Sign out"
    />
  );
}
