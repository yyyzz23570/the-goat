import { z } from "zod";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD for the travel date.")
  .refine((value) => !Number.isNaN(new Date(`${value}T12:00:00`).getTime()), "Enter a valid travel date.");

export const nycPlanRequestSchema = z.object({
  cityCode: z.literal("nyc"),
  date: dateSchema,
  duration: z.enum(["half_day", "full_day"]),
  durationHours: z.number().int().min(1).max(24).optional(),
  partySize: z.number().int().min(1).max(8),
  totalBudgetUsd: z.number().int().min(0).max(10_000),
  interests: z.array(z.enum(["landmark", "museum", "architecture", "park", "waterfront", "food"])).min(1),
  intentText: z.string().max(300),
  transportPreference: z.enum(["smart", "public_transit", "taxi", "walk"]),
  walkingPreference: z.enum(["easy", "balanced", "active"]),
  dining: z.enum(["no_preference", "vegetarian", "coffee", "local"]),
  accessibility: z.boolean(),
  adjustment: z.object({
    action: z.enum(["replace", "shorten", "budget"]),
    itineraryId: z.string().min(1),
    targetStopId: z.string().min(1).optional(),
    previousPlaceIds: z.array(z.string().min(1)).max(12).optional(),
    replacementPlaceId: z.string().min(1).optional(),
  }).optional(),
});
