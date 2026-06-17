import { Root } from "@/containers/Root";
import { getSiteUrl } from "@/lib/site-url";
import { GoogleTagManager } from "@/services/google-tag-manager";
// Import vanilla-extract CSS from UI library
import "@writersunblocked/ui/dist/ui.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import StyledComponentsRegistry from "./registry";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "WritersUnblocked — coming soon.",
  description:
    "The writing tool that reads the world you've built and shows you what it's already telling you. Join the waitlist for early access.",
  openGraph: {
    title: "WritersUnblocked — Not a better sentence. A fuller world.",
    description:
      "The writing tool that maps your world from your words. Characters, locations, plot — all connected.  Join the waitlist for early access.",
  },

  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <html lang="en">
        <head>
          <GoogleTagManager.Head />
          <meta name="grammarly" content="false" />
        </head>
        <body>
          <GoogleTagManager.Body />
          <StyledComponentsRegistry>
            <Root>{children}</Root>
          </StyledComponentsRegistry>
        </body>
      </html>
    </Suspense>
  );
}
