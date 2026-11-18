import { z } from 'zod';

export const interestValues = [
  'landmark',
  'museum',
  'park',
  'architecture',
  'waterfront',
  'food',
  'history',
] as const;

export const planRequestSchema = z.object({
  city: z.literal('nyc'),
  date: z.string().min(1),
  durationHours: z.number().int().min(2).max(12),
  partySize: z.number().int().min(1).max(12),
  totalBudgetUsd: z.number().min(0).max(10_000),
  interests: z.array(z.enum(interestValues)).min(1).max(4),
});
