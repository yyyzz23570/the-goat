import { NextResponse } from "next/server";
import { z } from "zod";
import { nycPlanRequestSchema } from "@/lib/nyc-plan-contract";
import { NYC_PLANNER_VERSION, planNycItinerary } from "@/lib/nyc-planner";

function invalidRequest(error: z.ZodError, requestId: string) {
  return NextResponse.json(
    {
      error: {
        code: "invalid_request",
        message: "Check the trip details and try again.",
        fieldErrors: z.treeifyError(error),
      },
      requestId,
    },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  const requestId = `req_${crypto.randomUUID()}`;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "The request body must be valid JSON." }, requestId },
      { status: 400 },
    );
  }

  const parsed = nycPlanRequestSchema.safeParse(payload);
  if (!parsed.success) return invalidRequest(parsed.error, requestId);

  const result = planNycItinerary(parsed.data);
  if (!result.itinerary) {
    return NextResponse.json({
      requestId,
      mode: "insufficient_information",
      itinerary: null,
      insufficiencyReason: result.insufficiencyReason,
    });
  }

  return NextResponse.json({
    requestId,
    mode: "controlled_fallback",
    itinerary: result.itinerary,
    constraintStatus: { hardConstraintsSatisfied: true, sourceCoverage: 1 },
    versions: { dataVersionId: "nyc-poi-v1", plannerVersion: NYC_PLANNER_VERSION },
  });
}
