"use server";
import { nestApiRequest } from "@/lib/nest-api";
import { headers } from "next/headers";

export const updateName = async (name: string) => {
  const cookie = (await headers()).get("cookie");
  return nestApiRequest<{ id: string; name: string }>({
    path: "/users/me",
    method: "PATCH",
    body: { name },
    headers: cookie ? { cookie } : undefined,
  });
};

export const updateHandle = async (handle: string) => {
  const cookie = (await headers()).get("cookie");
  return nestApiRequest<{ id: string; handle: string | null }>({
    path: "/users/me/handle",
    method: "PATCH",
    body: { handle },
    headers: cookie ? { cookie } : undefined,
  });
};

export const updateNotifications = async (
  preferences: Record<string, boolean>
) => {
  const cookie = (await headers()).get("cookie");
  return nestApiRequest<{ id: string }>({
    path: "/users/me/notifications",
    method: "PATCH",
    body: preferences,
    headers: cookie ? { cookie } : undefined,
  });
};

export const deleteAccount = async () => {
  const cookie = (await headers()).get("cookie");
  return nestApiRequest<{ ok: boolean }>({
    path: "/users/me",
    method: "DELETE",
    headers: cookie ? { cookie } : undefined,
  });
};
