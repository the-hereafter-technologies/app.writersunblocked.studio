import { nestApiRequest } from "@/lib/nest-api";
import { getMe } from "@/services/api/getMe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BillingPageClient } from "./BillingPageClient";

interface SubscriptionInfo {
  status: string | null;
  offerId: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

export default async function AccountBillingPage() {
  const cookie = (await headers()).get("cookie");
  if (!cookie) {
    redirect("/login");
  }

  const me = await getMe(cookie);

  // Fetch available offers
  const offers = await nestApiRequest<
    {
      id: string;
      name: string;
      price: string;
      tier: string;
      amountCents: number;
      interval: string;
    }[]
  >({
    path: "/payments/offers",
    headers: { cookie },
    cache: "no-store",
  }).catch(() => []);

  const subscription: SubscriptionInfo = {
    status: me.subscription?.subscriptionStatus ?? null,
    offerId: me.subscription?.tier ?? null,
    trialEndsAt: me.subscription?.trialEndsAt ?? null,
    currentPeriodEnd: me.subscription?.expiresAt ?? null,
  };

  return <BillingPageClient subscription={subscription} offers={offers} />;
}
