"use client";

import { deleteAccount, updateName } from "@/services/api/userActions";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function AccountMePage() {
  const { user, refetch } = useCurrentUser();
  const router = useRouter();
  const [nameValue, setNameValue] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }
    setNameError(null);
    startTransition(async () => {
      try {
        await updateName(trimmed);
        await refetch();
        setNameSuccess(true);
        setTimeout(() => setNameSuccess(false), 3000);
      } catch {
        setNameError("Failed to save name. Please try again.");
      }
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") return;
    startTransition(async () => {
      try {
        await deleteAccount();
        router.push("/login?deleted=true");
      } catch {
        setShowDeleteConfirm(false);
        setDeleteConfirmText("");
      }
    });
  };

  const currentName = user?.name ?? "";

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    marginBottom: "1.5rem",
    maxWidth: "600px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "#6b7280",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "0.625rem 0.875rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
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
      {/* Account Info */}
      <section style={sectionStyle}>
        <h2
          style={{ fontSize: "16px", fontWeight: 500, marginBottom: "1.5rem" }}
        >
          Account Info
        </h2>

        {user?.image && (
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={labelStyle}>Profile Picture</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.image}
              alt="Profile"
              width={64}
              height={64}
              style={{ borderRadius: "50%", display: "block" }}
            />
          </div>
        )}

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={labelStyle}>Email</label>
          <div
            style={{
              ...inputStyle,
              backgroundColor: "#f9fafb",
              color: "#6b7280",
            }}
          >
            {user?.email ?? "—"}
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            Managed by Google. Cannot be changed here.
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name-input" style={labelStyle}>
            Display Name
          </label>
          <input
            id="name-input"
            type="text"
            style={inputStyle}
            defaultValue={currentName}
            onChange={(e) => setNameValue(e.target.value)}
            placeholder="Your name"
          />
          {nameError && (
            <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
              {nameError}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            style={{ ...btnStyle, background: "#111827", color: "#fff" }}
            onClick={handleSaveName}
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Save Changes"}
          </button>
          {nameSuccess && (
            <span style={{ fontSize: "13px", color: "#10b981" }}>Saved!</span>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section
        style={{
          ...sectionStyle,
          border: "1px solid #fca5a5",
          marginBottom: 0,
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#dc2626",
            marginBottom: "0.5rem",
          }}
        >
          Danger Zone
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginBottom: "1.25rem",
          }}
        >
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            style={{
              ...btnStyle,
              background: "#fee2e2",
              color: "#dc2626",
            }}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete my account
          </button>
        ) : (
          <div>
            <p
              style={{
                fontSize: "13px",
                marginBottom: "0.75rem",
                color: "#374151",
              }}
            >
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              style={{
                ...inputStyle,
                borderColor: "#fca5a5",
                marginBottom: "0.75rem",
              }}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
            />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                style={{
                  ...btnStyle,
                  background:
                    deleteConfirmText === "DELETE" ? "#dc2626" : "#e5e7eb",
                  color: deleteConfirmText === "DELETE" ? "#fff" : "#9ca3af",
                  cursor:
                    deleteConfirmText === "DELETE" ? "pointer" : "not-allowed",
                }}
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || isPending}
              >
                {isPending ? "Deleting…" : "Confirm Delete"}
              </button>
              <button
                style={{ ...btnStyle, background: "#f3f4f6", color: "#374151" }}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
