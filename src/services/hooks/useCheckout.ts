"use client";

import { nestApiRequest } from "@/lib/nest-api";
import { getCheckoutUrl } from "@/services/api/getCheckoutUrl";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface Offer {
  id: string;
  tier: "starter" | "writer" | "pro";
  priceId?: string;
  name: string;
  description: string;
  price: string;
  amountCents?: number;
  currency?: string;
  interval: string;
  badge?: string;
  isActive: boolean;
  includes?: string[];
}

export interface SpecialOffer {
  id: string;
  label: string;
  linkedOfferSlug: string;
  showLabel: boolean;
  offers: Offer[];
}

export interface UseCheckoutResult {
  regularOffers: Offer[];
  specialOffers: SpecialOffer[];
  customOffers: Offer[];
  isLoading: boolean;
  error: Error | null;
  getEffectiveOffer: (tierSlug: string, interval: "month" | "year") => Offer | undefined;
  createCheckoutSession: (
    offerId: string,
    successUrl: string,
    cancelUrl: string
  ) => Promise<void>;
}

export const useCheckout = (): UseCheckoutResult => {
  const [regularOffers, setRegularOffers] = useState<Offer[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [customOffers, setCustomOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Promise.all([
      nestApiRequest<Offer[]>({ path: "/payments/offers" }),
      nestApiRequest<SpecialOffer[]>({ path: "/payments/special-offers" }),
      nestApiRequest<Offer[]>({ path: "/payments/custom-offers" }),
    ])
      .then(([regular, special, custom]) => {
        setRegularOffers(regular);
        setSpecialOffers(special);
        setCustomOffers(custom);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err : new Error("Failed to load offers")
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getEffectiveOffer = useCallback(
    (tierSlug: string, interval: "month" | "year"): Offer | undefined => {
      const special = specialOffers.find(
        (entry) => entry.linkedOfferSlug === tierSlug
      );
      const specialMatch = special?.offers.find(
        (offer) => offer.interval === interval
      );
      if (specialMatch) {
        return specialMatch;
      }

      return regularOffers.find(
        (offer) =>
          offer.tier === tierSlug && offer.interval === interval
      );
    },
    [regularOffers, specialOffers]
  );

  const createCheckoutSession = useCallback(
    async (offerId: string, successUrl: string, cancelUrl: string) => {
      const url = await getCheckoutUrl({ offerId, successUrl, cancelUrl });
      window.location.href = url;
    },
    []
  );

  return {
    regularOffers,
    specialOffers,
    customOffers,
    isLoading,
    error,
    getEffectiveOffer,
    createCheckoutSession,
  };
};
