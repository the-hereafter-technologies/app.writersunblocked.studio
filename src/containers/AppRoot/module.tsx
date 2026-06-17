import { nestApiRequest } from "@/lib/nest-api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as Style from "./style";

interface MeResponse {
  trialEndsAt?: string;
}

export interface AppRootProps {
  children: React.ReactNode;
}

/**
 * AppRoot description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered AppRoot component.
 */
export const AppRoot = async ({ children }: AppRootProps) => {
  const cookie = (await headers()).get("cookie");
  let me: MeResponse | null = null;
  console.log("me", me);

  try {
    me = await nestApiRequest<MeResponse>({
      path: "/users/me",
      headers: cookie ? { cookie } : undefined,
      cache: "no-store",
    });
  } catch {
    me = null;
  }
  if (!me) {
    redirect("/login");
  }

  return <Style.Container>{children}</Style.Container>;
};
