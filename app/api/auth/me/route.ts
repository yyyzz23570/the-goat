import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: {
        code: "AUTH_PREVIEW_UNAVAILABLE",
        message: "Account services are not configured in this local preview.",
        retryable: false,
      },
      requestId: `req_${crypto.randomUUID()}`,
    },
    { status: 503 },
  );
}
