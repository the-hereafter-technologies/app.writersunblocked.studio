"use server";
import { nestApiRequest } from "@/lib/nest-api";
import { headers } from "next/headers";

export interface GetCheckoutUrlInput {
	offerId: string;
	successUrl: string;
	cancelUrl: string;
}

export const getCheckoutUrl = async (
	input: GetCheckoutUrlInput,
): Promise<string> => {
	const cookie = (await headers()).get("cookie");
	const result = await nestApiRequest<{ url: string }>({
		path: "/payments/checkout-session",
		method: "POST",
		body: input,
		headers: cookie ? { cookie } : undefined,
	});
	return result.url;
};
