"use server";
import { nestApiRequest } from "@/lib/nest-api";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookie = (await headers()).get("cookie");
  await nestApiRequest({
    path: "/auth/logout",
    method: "POST",
    headers: cookie ? { cookie } : undefined,
  });
  (await cookies()).set("jwt", "", {
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });
  redirect("/");
}
