"use client";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import moment from "moment";
import { useMemo } from "react";
import { Button } from "../Button";
import * as Style from "./style";

const MAX_TRIAL_DAYS = 7;

/**
 * TrialStatus description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered TrialStatus component.
 */
export const TrialStatus = () => {
  const { user } = useCurrentUser();
  const subscription = user?.subscription;
  const trialEndDate = subscription?.trialEndsAt;
  const daysLeft = trialEndDate
    ? moment(trialEndDate).diff(moment(), "days")
    : 0;
  const percentTrialLeft = trialEndDate
    ? Math.max(0, Math.min(100, (daysLeft / MAX_TRIAL_DAYS) * 100))
    : 0;

  const isTrialOver = trialEndDate
    ? moment().isAfter(moment(trialEndDate))
    : false;

  const status = useMemo(() => {
    if (!subscription) return null;

    // If trial has ended but subscription is still active, show "trialEnded" status
    if (
      subscription.subscriptionStatus === "active" &&
      trialEndDate &&
      moment().isAfter(moment(trialEndDate))
    ) {
      return "trialEnded";
    }

    if (subscription.subscriptionStatus === "trialing") return "trialing";
    if (subscription.subscriptionStatus === "canceled") return "trialEnded";
    return subscription.subscriptionStatus;
  }, [subscription, trialEndDate]);

  if (!status) return null;

  const statusContent = {
    trialing: {
      title: `You have ${daysLeft} days left on your free trial!`,
      description:
        'Lock in "Early Bird" pricing before your trial ends. Limited spots remaining.',
    },
    trialEnded: {
      title: "Your trial has ended.",
      description:
        "Your work is safe — upgrade to keep writing and unlock everything you built.",
    },
    active: {
      title: "Your subscription is active.",
      description: "Thank you for subscribing! Enjoy your writing journey.",
    },
  };

  const currentStatus = statusContent[status as "trialing" | "trialEnded"];

  if (!currentStatus) return null;

  return (
    <Style.Container>
      <h6>{currentStatus.title}</h6>
      <p>{currentStatus.description}</p>
      {trialEndDate && !isTrialOver && status !== "active" && (
        <div className="progress-bar">
          <span style={{ width: `${percentTrialLeft}%` }}></span>
        </div>
      )}
      {status !== "active" && <Button label="Upgrade for $10/month" />}
    </Style.Container>
  );
};
