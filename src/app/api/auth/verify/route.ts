import { getJwtCookieOptions } from "@/lib/auth-cookie";
import { NestApiError, nestApiRequest } from "@/lib/nest-api";
import { NextResponse } from "next/server";

const NO_ACCOUNT_MESSAGE =
  "We couldn't find an account for that email. Create an account on our website first, then come back to log in.";

function getSiteApiHeaders(): HeadersInit {
  const siteApiKey = process.env.SITE_API_KEY;
  if (!siteApiKey) {
    throw new Error("SITE_API_KEY is required");
  }

  return {
    "x-site-api-key": siteApiKey,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    const email = body.email?.trim();
    const code = body.code?.trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 },
      );
    }

    const result = await nestApiRequest<{ token: string; isNew: boolean }>({
      path: "/auth/email/verify",
      method: "POST",
      body: { email, code },
      headers: getSiteApiHeaders(),
      credentials: "omit",
    });

    if (result.isNew) {
      return NextResponse.json({ error: NO_ACCOUNT_MESSAGE }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("jwt", result.token, getJwtCookieOptions());

    return response;
  } catch (error) {
    if (error instanceof NestApiError) {
      const payload = error.payload as {
        message?: string | string[];
        error?: string;
      };
      const message = Array.isArray(payload.message)
        ? payload.message.join(", ")
        : (payload.message ?? payload.error ?? error.message);

      if (message.toLowerCase().includes("referral")) {
        return NextResponse.json({ error: NO_ACCOUNT_MESSAGE }, { status: 400 });
      }

      return NextResponse.json({ error: message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 });
  }
}
