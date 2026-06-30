import { NestApiError, nestApiRequest } from "@/lib/nest-api";
import { NextResponse } from "next/server";

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
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await nestApiRequest<{ ok: boolean; codeLength: number }>({
      path: "/auth/email/send-code",
      method: "POST",
      body: { email },
      headers: getSiteApiHeaders(),
      credentials: "omit",
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NestApiError) {
      const message =
        typeof (error.payload as { message?: unknown })?.message === "string"
          ? (error.payload as { message: string }).message
          : error.message;

      return NextResponse.json({ error: message }, { status: error.status });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send verification code",
      },
      { status: 500 },
    );
  }
}
