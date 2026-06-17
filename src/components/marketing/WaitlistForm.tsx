"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@/components/Button";
import { nestApiRequest, NestApiError } from "@/lib/nest-api";
import { useSearchParams } from "next/navigation";

const Wrap = styled.form`
  max-width: 520px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Input = styled.input`
  flex: 1;
  min-width: 220px;
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  background: ${({ theme }) => theme.palette.brand.darkPaper};
  padding: 10px 12px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
`;

const Message = styled.p<{ $success?: boolean }>`
  width: 100%;
  text-align: center;
  margin-top: 8px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ $success }) => ($success ? "#166534" : "#b91c1c")};
`;

export default function WaitlistForm() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref")?.trim() || undefined;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrap onSubmit={onSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <Button type="submit" variant="accent" loading={loading}>
        Join Waitlist
      </Button>
      {message && <Message $success={success}>{message}</Message>}
    </Wrap>
  );
}
