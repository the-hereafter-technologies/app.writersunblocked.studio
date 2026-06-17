import { Login } from "@/containers/Login";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ referral?: string }>;
}) {
  const { referral } = await searchParams;
  return <Login referral={referral} />;
}
