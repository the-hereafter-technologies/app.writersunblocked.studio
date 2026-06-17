"use client";

import type { MeUser } from "@/services/api/getMe";
import type { ReferralInfo } from "@/services/api/getReferralInfo";
import { useState } from "react";

interface ReferralsPageClientProps {
  user: MeUser;
  referral: ReferralInfo;
}

export function ReferralsPageClient({ referral }: ReferralsPageClientProps) {
  const [copied, setCopied] = useState(false);

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    marginBottom: "1.5rem",
    maxWidth: "600px",
  };

  if (!referral.isEligible) {
    return (
      <div style={{ padding: "0 2rem 4rem", maxWidth: "640px" }}>
        <section style={sectionStyle}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 500,
              marginBottom: "0.75rem",
            }}
          >
            Referrals
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Your referral link is not active yet. Referral links are available
            to users who signed up from our waitlist.
          </p>
        </section>
      </div>
    );
  }

  const progressToNextReward = referral.paidReferralsCount % 3;
  const toNextReward =
    progressToNextReward === 0 && referral.paidReferralsCount > 0
      ? 3
      : 3 - progressToNextReward;

  const handleCopy = async () => {
    if (!referral.referralLink) return;
    try {
      await navigator.clipboard.writeText(referral.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select the input text
    }
  };

  return (
    <div style={{ padding: "0 2rem 4rem", maxWidth: "640px" }}>
      {/* Referral Link */}
      <section style={sectionStyle}>
        <h2
          style={{ fontSize: "16px", fontWeight: 500, marginBottom: "0.5rem" }}
        >
          Your Referral Link
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginBottom: "1.25rem",
          }}
        >
          Share this link to give new users a <strong>30-day free trial</strong>
          . When they subscribe, you earn rewards.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <input
            readOnly
            value={referral.referralLink}
            style={{
              flex: 1,
              padding: "0.625rem 0.875rem",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "monospace",
              background: "#f9fafb",
              color: "#374151",
            }}
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={handleCopy}
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              background: copied ? "#10b981" : "#111827",
              color: "#fff",
              whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </section>

      {/* Stats */}
      <section style={sectionStyle}>
        <h2
          style={{ fontSize: "16px", fontWeight: 500, marginBottom: "1.5rem" }}
        >
          Rewards
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700 }}>
              {referral.paidReferralsCount}
            </div>
            <div
              style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
            >
              Paid Referrals
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700 }}>
              {referral.freeMonthsEarned}
            </div>
            <div
              style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
            >
              Free Months Earned
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "#374151",
            marginBottom: "0.75rem",
          }}
        >
          Progress to next free month:
        </p>
        <div
          style={{
            height: "8px",
            background: "#e5e7eb",
            borderRadius: "9999px",
            overflow: "hidden",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#111827",
              width: `${(progressToNextReward / 3) * 100}%`,
              borderRadius: "9999px",
              transition: "width 0.3s",
            }}
          />
        </div>
        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          {progressToNextReward === 0 && referral.paidReferralsCount > 0
            ? "You just earned a free month! 🎉"
            : `${toNextReward} more paid referral${toNextReward !== 1 ? "s" : ""} to earn your next free month`}
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#fffbeb",
            borderRadius: "8px",
            border: "1px solid #fde68a",
          }}
        >
          <p style={{ fontSize: "12px", color: "#92400e" }}>
            <strong>How it works:</strong> For every 3 people who subscribe
            using your referral link, you get 1 month free of Starter
            automatically applied to your account.
          </p>
        </div>
      </section>
    </div>
  );
}
