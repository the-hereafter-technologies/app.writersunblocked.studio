"use client";

import { getCheckoutUrl } from "@/services/api/getCheckoutUrl";
import type { Offer } from "@/services/hooks/useCheckout";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface SubscriptionInfo {
  status: string | null;
  offerId: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

interface BillingPageClientProps {
  subscription: SubscriptionInfo;
  offers: Offer[];
  customOffers?: Offer[];
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  trialing: "Trial",
  canceled: "Canceled",
  past_due: "Past Due",
  unpaid: "Unpaid",
};

const STATUS_COLORS: Record<string, string> = {
  active: "#10b981",
  trialing: "#f59e0b",
  canceled: "#ef4444",
  past_due: "#f59e0b",
  unpaid: "#ef4444",
};

export function BillingPageClient({
  subscription,
  offers,
  customOffers = [],
}: BillingPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = (offerId: string) => {
    startTransition(async () => {
      try {
        const url = await getCheckoutUrl({
          offerId,
          successUrl: `${window.location.origin}/account/billing?upgraded=true`,
          cancelUrl: `${window.location.origin}/account/billing`,
        });
        router.push(url);
      } catch {
        // handle error
      }
    });
  };

  const status = subscription.status;
  const trialEndsAt = subscription.trialEndsAt
    ? new Date(subscription.trialEndsAt)
    : null;
  const currentPeriodEnd = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd)
    : null;

  const daysLeftInTrial = trialEndsAt
    ? Math.max(
        0,
        Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    marginBottom: "1.5rem",
    maxWidth: "600px",
  };

  const btnStyle: React.CSSProperties = {
    padding: "0.5rem 1.25rem",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
  };

  return (
    <div style={{ padding: "0 2rem 4rem", maxWidth: "640px" }}>
      {/* Current Plan */}
      <section style={sectionStyle}>
        <h2
          style={{ fontSize: "16px", fontWeight: 500, marginBottom: "1.5rem" }}
        >
          Current Plan
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          {status && (
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: `${STATUS_COLORS[status]}20`,
                color: STATUS_COLORS[status] ?? "#374151",
              }}
            >
              {STATUS_LABELS[status] ?? status}
            </span>
          )}
          {subscription.offerId && (
            <span style={{ fontSize: "14px", color: "#374151" }}>
              {subscription.offerId}
            </span>
          )}
        </div>

        {status === "trialing" && trialEndsAt && (
          <div style={{ marginBottom: "1.25rem" }}>
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              {daysLeftInTrial > 0
                ? `${daysLeftInTrial} day${daysLeftInTrial !== 1 ? "s" : ""} remaining in your free trial`
                : "Your trial has ended"}
            </p>
            <div
              style={{
                height: "6px",
                background: "#e5e7eb",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#f59e0b",
                  width: `${Math.max(5, (daysLeftInTrial / 30) * 100)}%`,
                  borderRadius: "9999px",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        )}

        {status === "active" && currentPeriodEnd && (
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            Next billing date: {currentPeriodEnd.toLocaleDateString()}
          </p>
        )}
      </section>

      {/* Upgrade Options */}
      {status !== "active" && offers.length > 0 && (
        <section style={sectionStyle}>
          <h2
            style={{ fontSize: "16px", fontWeight: 500, marginBottom: "1rem" }}
          >
            Upgrade Your Plan
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {offers.map((offer) => (
              <div
                key={offer.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {offer.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>
                    {offer.price}/{offer.interval}
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    ...btnStyle,
                    background: "#111827",
                    color: "#fff",
                  }}
                  onClick={() => handleUpgrade(offer.id)}
                  disabled={isPending}
                >
                  {isPending ? "Loading…" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {customOffers.length > 0 && (
        <section style={sectionStyle}>
          <h2
            style={{ fontSize: "16px", fontWeight: 500, marginBottom: "1rem" }}
          >
            VIP & Team Offers
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {customOffers.map((offer) => (
              <div
                key={offer.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {offer.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>
                    {offer.price}/{offer.interval}
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    ...btnStyle,
                    background: "#111827",
                    color: "#fff",
                  }}
                  onClick={() => handleUpgrade(offer.id)}
                  disabled={isPending}
                >
                  {isPending ? "Loading…" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
