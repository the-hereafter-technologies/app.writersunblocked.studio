"use client";
import { useCallback, useState } from "react";
import { logout } from "./server";
import * as Style from "./style";

export type LogoutButtonProps = {
  label?: string;
};
/**
 * LogoutButton description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered LogoutButton component.
 */
export const LogoutButton = ({ label = "Logout" }: LogoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const handleLogout = useCallback(async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  }, []);
  return (
    <Style.Container onClick={handleLogout} disabled={loading}>
      {label}
    </Style.Container>
  );
};
