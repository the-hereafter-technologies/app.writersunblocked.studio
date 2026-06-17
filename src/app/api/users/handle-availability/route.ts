import { type NextRequest, NextResponse } from "next/server";

const NEST_API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle");

  if (!handle) {
    return NextResponse.json(
      { error: "handle query parameter is required" },
      { status: 400 }
    );
  }

  if (!NEST_API_URL || !INTERNAL_API_SECRET) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const url = `${NEST_API_URL}/users/handle-availability?handle=${encodeURIComponent(handle)}`;

  const res = await fetch(url, {
    headers: { "x-internal-api-secret": INTERNAL_API_SECRET },
    cache: "no-store",
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
