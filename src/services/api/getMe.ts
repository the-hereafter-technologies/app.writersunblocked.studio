import { nestApiRequest } from "@/lib/nest-api";
import type { SubscriptionTier } from "@writersunblocked/ui";

export type Subscription = {
  subscriptionStatus:
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid";
  tier: SubscriptionTier;
  trialEndsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export interface MeUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  handle: string | null;
  subscriptionStatus:
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid";
  trialEndsAt: string | null;
  subscription?: Subscription | null;
}

export const getMe = async (cookie: string) => {
  return await nestApiRequest<MeUser>({
    path: "/users/me",
    headers: { cookie },
    cache: "no-store",
  });
};
