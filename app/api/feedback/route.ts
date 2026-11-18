import { NextResponse } from "next/server";
import { z } from "zod";
import { getFeedback, saveFeedback } from "@/lib/store";

const feedbackSchema = z.object({
  itineraryId: z.string().min(1),
  rating: z.enum(["helpful", "not_helpful"]),
  satisfactionScore: z.number().int().min(1).max(5).optional(),
  trustScore: z.number().int().min(1).max(5).optional(),
  issueType: z.enum(["data", "fit", "route", "transport", "budget", "walking", "other"]).optional(),
  note: z.string().max(500).optional(),
  itineraryVersion: z.string().max(120).optional(),
  dataVersionId: z.string().max(120).optional(),
});

export async function GET() {
  return NextResponse.json({ feedback: await getFeedback() });
}

export async function POST(request: Request) {
  try {
    const payload = feedbackSchema.parse(await request.json());
    const result = await saveFeedback({ ...payload, createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, requestId: `req_${crypto.randomUUID()}`, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Feedback could not be saved right now.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
