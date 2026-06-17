"use client";

import { nestApiRequest } from "@/lib/nest-api";
import { getCheckoutUrl } from "@/services/api/getCheckoutUrl";
import { useCallback, useEffect, useState } from "react";

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

export interface UseCheckoutResult {
  offers: Offer[];
  isLoading: boolean;
  error: Error | null;
  createCheckoutSession: (
    offerId: string,
    successUrl: string,
    cancelUrl: string
  ) => Promise<void>;
}

export const useCheckout = (): UseCheckoutResult => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    nestApiRequest<Offer[]>({ path: "/payments/offers" })
      .then(setOffers)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err : new Error("Failed to load offers")
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const createCheckoutSession = useCallback(
    async (offerId: string, successUrl: string, cancelUrl: string) => {
      const url = await getCheckoutUrl({ offerId, successUrl, cancelUrl });
      window.location.href = url;
    },
    []
  );

  return { offers, isLoading, error, createCheckoutSession };
};
