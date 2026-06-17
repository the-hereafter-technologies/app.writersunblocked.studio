"use client";

import React from "react";
import styled from "styled-components";
import { Button } from "@/components/Button";

const Section = styled.section`
  padding: 84px 24px 56px;
  text-align: center;
  background:
    radial-gradient(1200px 280px at 50% -10%, rgba(127, 119, 221, 0.16), transparent 70%),
    linear-gradient(180deg, #fdfbf8 0%, #f5f2ed 100%);
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.15;
  color: ${({ theme }) => theme.palette.brand.black};
  max-width: 840px;
  margin: 0 auto 16px;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.palette.brand.black};
  max-width: 640px;
  margin: 0 auto 28px;
`;

const Actions = styled.div`
  display: inline-flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

export default function Hero() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const googleSignInUrl = apiBase ? `${apiBase}/auth/google` : "/";

  return (
    <Section>
      <Title>Keep Writing When the Story Goes Quiet</Title>
      <Subtitle>
        Tag characters with @mentions, let Predictive Intelligence map who they
        are from your prose, then get three validated directions when you hit a
        wall.
      </Subtitle>
      <Actions>
        <a href="/waitlist">
          <Button variant="accent">Join Waitlist</Button>
        </a>
        <a href={googleSignInUrl}>
          <Button variant="ghost">Sign in with Google</Button>
        </a>
      </Actions>
    </Section>
  );
}
