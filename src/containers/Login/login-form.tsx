"use client";

import { AuthForm } from "@writersunblocked/ui/app";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import * as Styled from "./style";

async function readError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return payload?.error ?? "Something went wrong. Please try again.";
}

export const LoginForm = () => {
  const router = useRouter();

  const handleValidEmail = useCallback(async (email: string) => {
    const response = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    const payload = (await response.json()) as { codeLength: number };
    return payload.codeLength;
  }, []);

  const handleSubmit = useCallback(
    async ({ email, code }: { email: string; code: string }) => {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      router.push("/");
      router.refresh();
    },
    [router],
  );

  return (
    <Styled.FormContainer>
      <AuthForm
        onValidEmail={handleValidEmail}
        onSubmit={handleSubmit}
        placeholder="Enter your email address"
        buttonLabel="Login"
      />
    </Styled.FormContainer>
  );
};
