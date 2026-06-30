"use client";

import { useCheckout } from "@/services/hooks/useCheckout";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import * as Style from "./style";

export interface UpgradeForAccessProps {
  tierSlug?: string;
  onUpgrade?: (offerId: string) => void;
  onContinueFree?: () => void;
}

export const UpgradeForAccess = ({
  tierSlug = "starter",
  onUpgrade,
  onContinueFree,
}: UpgradeForAccessProps) => {
  const { user } = useCurrentUser();
  const { getEffectiveOffer, isLoading } = useCheckout();
  const [showAnnual, setShowAnnual] = useState(false);
  const [hasReferralBonus, setHasReferralBonus] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("referral_just_applied") === "1") {
      sessionStorage.removeItem("referral_just_applied");
      setHasReferralBonus(true);
    }
  }, []);

  const monthlyOffer = useMemo(
    () => getEffectiveOffer(tierSlug, "month"),
    [getEffectiveOffer, tierSlug]
  );
  const annualOffer = useMemo(
    () => getEffectiveOffer(tierSlug, "year"),
    [getEffectiveOffer, tierSlug]
  );

  const currentOffer = useMemo(() => {
    return showAnnual ? annualOffer : monthlyOffer;
  }, [showAnnual, annualOffer, monthlyOffer]);

  const interval = useMemo(() => {
    return showAnnual ? "yr" : "m";
  }, [showAnnual]);

  const handleUpgradeClick = () => {
    if (!currentOffer?.id) {
      return;
    }
    onUpgrade?.(currentOffer.id);
  };

  if (!user) {
    return null;
  }

  if (
    Boolean(user.subscription) &&
    user.subscription?.subscriptionStatus === "active"
  ) {
    return (
      <Style.IsSubscriber>
        <h5>You're a subscriber!</h5>
        <p>Thank you for subscribing and supporting our work.</p>
        <Button label="Create story" type="button" onClick={onContinueFree} />
      </Style.IsSubscriber>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <Style.Container>
      {hasReferralBonus && (
        <div
          style={{
            background: "#fef9c3",
            border: "1px solid #fde047",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            fontSize: "13px",
            color: "#713f12",
            lineHeight: 1.5,
          }}
        >
          🎉 <strong>Your invite was applied successfully.</strong> You're in
          your trial now. Upgrade anytime to activate a paid plan.
        </div>
      )}
      <div>
        <h5>You're on a trial</h5>
      </div>
      <div>
        <div className="offer-header">
          <h6>{currentOffer?.name}</h6>
          {annualOffer && monthlyOffer && (
            <div className="switch">
              <div className="save">Save 20%</div>
              <label>
                <input
                  type="checkbox"
                  checked={showAnnual}
                  onChange={() => setShowAnnual((prev) => !prev)}
                />
                <span></span>
              </label>
            </div>
          )}
        </div>
        <h4>Upgrade for more access</h4>
        {currentOffer?.includes && (
          <ul>
            {currentOffer.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <div className="buttons">
          {currentOffer && (
            <div>
              <Button
                label={`Upgrade for ${currentOffer?.price}/${interval}`}
                type="button"
                onClick={handleUpgradeClick}
              />
              <small>
                You will be temporarily redirected to checkout to complete your
                upgrade.
              </small>
            </div>
          )}
          <div>
            <Button
              label="Continue trial"
              type="button"
              onClick={onContinueFree}
            />
          </div>
        </div>
      </div>
    </Style.Container>
  );
};
