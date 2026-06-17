import { nestApiRequest } from "@/lib/nest-api";

export interface ReferralInfo {
  isEligible: boolean;
  referralLink?: string;
  paidReferralsCount: number;
  freeMonthsEarned: number;
}

export const getReferralInfo = async (
  cookie: string
): Promise<ReferralInfo> => {
  return nestApiRequest<ReferralInfo>({
    path: "/users/me/referral",
    headers: { cookie },
    cache: "no-store",
  });
};
