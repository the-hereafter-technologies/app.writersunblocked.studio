"use client";

import { NestApiError, nestApiRequest } from "@/lib/nest-api";
import { useSearchParams } from "next/navigation";
import { type ComponentProps, type FormEvent, useState } from "react";
import { Button } from "../Button";
import * as Styled from "./style";

export interface WaitlistFormProps extends ComponentProps<"form"> {}

const oauthErrorMessages: Record<string, string> = {
  not_on_waitlist:
    "Your email isn't on the waitlist yet. Sign up below to join.",
  not_confirmed: "Please confirm your waitlist email before signing in.",
  pending_approval:
    "You're on the waitlist! You'll get access as soon as you're approved.",
};

export const WaitlistForm = ({ ...props }: WaitlistFormProps) => {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref")?.trim() || undefined;
  const oauthError = searchParams.get("error")?.trim() || "";
  const oauthErrorMessage = oauthErrorMessages[oauthError];
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await nestApiRequest<{ ok: boolean }>({
        path: "/waitlist",
        method: "POST",
        body: { email, referralCode },
      });
      setSuccess(true);
      setMessage(
        "Welcome aboard. Check your email to confirm your waitlist spot."
      );
      setEmail("");
    } catch (err) {
      setSuccess(false);
      setMessage(
        err instanceof NestApiError ? err.message : "Could not join waitlist."
      );
    }
  };

  return (
    <>
      {oauthErrorMessage && (
        <Styled.Message $success={false}>{oauthErrorMessage}</Styled.Message>
      )}
      <Styled.Wrap onSubmit={onSubmit} {...props}>
        <Styled.Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Button type="submit" label="Join Waitlist" />
        {message && (
          <Styled.Message $success={success}>{message}</Styled.Message>
        )}
      </Styled.Wrap>
      <p style={{ fontSize: 12, marginLeft: 20, marginTop: 12 }}>
        Free to join. No credit card required.
      </p>
    </>
  );
};
