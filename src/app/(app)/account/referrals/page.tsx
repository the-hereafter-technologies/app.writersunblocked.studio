import { getMe } from "@/services/api/getMe";
import { getReferralInfo } from "@/services/api/getReferralInfo";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReferralsPageClient } from "./ReferralsPageClient";

export default async function AccountReferralsPage() {
  const cookie = (await headers()).get("cookie");
  if (!cookie) {
    redirect("/login");
  }

  const [me, referral] = await Promise.all([
    getMe(cookie),
    getReferralInfo(cookie).catch(() => ({
      isEligible: false,
      paidReferralsCount: 0,
      freeMonthsEarned: 0,
    })),
  ]);

  return <ReferralsPageClient user={me} referral={referral} />;
}
