"use client";

import { nestApiRequest } from "@/lib/nest-api";
import { updateNotifications } from "@/services/api/userActions";
import { useEffect, useState, useTransition } from "react";

interface NotificationPreferences {
  productUpdates: boolean;
  weeklyDigest: boolean;
  referralUpdates: boolean;
  trialReminders: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  productUpdates: true,
  weeklyDigest: true,
  referralUpdates: true,
  trialReminders: true,
};

const PREF_LABELS: Record<
  keyof NotificationPreferences,
  { label: string; description: string }
> = {
  productUpdates: {
    label: "Product updates",
    description: "New features, improvements, and announcements.",
  },
  weeklyDigest: {
    label: "Weekly digest",
    description: "A summary of your writing activity each week.",
  },
  referralUpdates: {
    label: "Referral updates",
    description: "When someone you referred subscribes.",
  },
  trialReminders: {
    label: "Trial reminders",
    description: "Reminders before your trial ends.",
  },
};

export default function AccountNotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    nestApiRequest<{ notificationPreferences: NotificationPreferences | null }>(
      {
        path: "/users/me",
        cache: "no-store",
      }
    )
      .then((me) => {
        if (me.notificationPreferences) {
          setPrefs({ ...DEFAULT_PREFS, ...me.notificationPreferences });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateNotifications(prefs as unknown as Record<string, boolean>);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        // handle error
      }
    });
  };

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    marginBottom: "1.5rem",
    maxWidth: "600px",
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>
          Loading preferences…
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 2rem 4rem", maxWidth: "640px" }}>
      <section style={sectionStyle}>
        <h2
          style={{ fontSize: "16px", fontWeight: 500, marginBottom: "1.5rem" }}
        >
          Email Notifications
        </h2>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {(
            Object.keys(PREF_LABELS) as Array<keyof NotificationPreferences>
          ).map((key) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1, paddingRight: "2rem" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#111827",
                  }}
                >
                  {PREF_LABELS[key].label}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "2px",
                  }}
                >
                  {PREF_LABELS[key].description}
                </div>
              </div>

              {/* Toggle switch */}
              <button
                role="switch"
                aria-checked={prefs[key]}
                onClick={() => handleToggle(key)}
                style={{
                  flexShrink: 0,
                  width: "44px",
                  height: "24px",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  background: prefs[key] ? "#111827" : "#d1d5db",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: "3px",
                    left: prefs[key] ? "23px" : "3px",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={handleSave}
            disabled={isPending}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: isPending ? "wait" : "pointer",
              border: "none",
              background: "#111827",
              color: "#fff",
            }}
          >
            {isPending ? "Saving…" : "Save Preferences"}
          </button>
          {saved && (
            <span style={{ fontSize: "13px", color: "#10b981" }}>Saved!</span>
          )}
        </div>
      </section>
    </div>
  );
}
