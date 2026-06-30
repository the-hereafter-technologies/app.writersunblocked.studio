import { nestApiRequest } from "@/lib/nest-api";
import { getMe } from "@/services/api/getMe";
import type { Offer, SpecialOffer } from "@/services/hooks/useCheckout";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BillingPageClient } from "./BillingPageClient";

interface SubscriptionInfo {
  status: string | null;
  offerId: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

const tierOrder = ["starter", "writer", "pro"] as const;

const buildBillingOffers = (
  regularOffers: Offer[],
  specialOffers: SpecialOffer[]
): Offer[] => {
  return tierOrder.flatMap((tier) => {
    const special = specialOffers.find((entry) => entry.linkedOfferSlug === tier);
    const monthly =
      special?.offers.find((offer) => offer.interval === "month") ??
      regularOffers.find(
        (offer) => offer.tier === tier && offer.interval === "month"
      );

    return monthly ? [monthly] : [];
  });
};

export default async function AccountBillingPage() {
  const cookie = (await headers()).get("cookie");
  if (!cookie) {
    redirect("/login");
  }

  const me = await getMe(cookie);

  const [regularOffers, specialOffers, customOffers] = await Promise.all([
    nestApiRequest<Offer[]>({
      path: "/payments/offers",
      headers: { cookie },
      cache: "no-store",
    }).catch(() => []),
    nestApiRequest<SpecialOffer[]>({
      path: "/payments/special-offers",
      headers: { cookie },
      cache: "no-store",
    }).catch(() => []),
    nestApiRequest<Offer[]>({
      path: "/payments/custom-offers",
      headers: { cookie },
      cache: "no-store",
    }).catch(() => []),
  ]);

  const offers = buildBillingOffers(regularOffers, specialOffers);

  const subscription: SubscriptionInfo = {
    status: me.subscription?.subscriptionStatus ?? null,
    offerId: me.subscription?.tier ?? null,
    trialEndsAt: me.subscription?.trialEndsAt ?? null,
    currentPeriodEnd: me.subscription?.expiresAt ?? null,
  };

  return (
    <BillingPageClient
      subscription={subscription}
      offers={offers}
      customOffers={customOffers}
    />
  );
}
