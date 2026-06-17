import { SettingLayout } from "@/containers/SettingLayout";
import Link from "next/link";
import type React from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/account/me", label: "Account" },
  { href: "/account/billing", label: "Billing" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/referrals", label: "Referrals" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingLayout>
      <nav
        style={{
          display: "flex",
          gap: "1.5rem",
          padding: "1.5rem 2rem 0",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "2rem",
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "#374151",
              textDecoration: "none",
              paddingBottom: "0.75rem",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </SettingLayout>
  );
}
