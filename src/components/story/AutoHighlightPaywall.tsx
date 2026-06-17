"use client";

import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.palette.brand.paper};
  border-bottom: 1px solid ${({ theme }) => theme.palette.brand.black};
`;

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem;
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.brand.darkPaper};
`;

const Title = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.brand.black};
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const Body = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
`;

const UpgradeLink = styled(Link)`
  display: inline-block;
  margin-top: 0.25rem;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.brand.black};
  text-decoration: underline;
`;

/**
 * AutoHighlightPaywall renders a notice when the user is not on an active paid plan,
 * informing them that the AI-powered auto-highlight feature is unavailable.
 */
export function AutoHighlightPaywall() {
  const { user, isLoading } = useCurrentUser();

  // Don't render during loading or for active paid subscribers
  if (isLoading || user?.subscriptionStatus === "active") {
    return null;
  }

  return (
    <Container>
      <Banner>
        <Title>
          <span>🔒</span> Auto-Highlight
        </Title>
        <Body>
          Automatic character and location detection is available on paid plans.
          Upgrade to have your world mapped as you write.
        </Body>
        <UpgradeLink href="/account/billing">Upgrade to unlock →</UpgradeLink>
      </Banner>
    </Container>
  );
}
