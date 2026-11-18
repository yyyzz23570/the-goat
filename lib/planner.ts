import { publishedPlaces } from '@/lib/nyc-places';
import type { Itinerary, Place, PlanRequest } from '@/lib/types';

function maximumStops(durationHours: number) {
  if (durationHours <= 4) return 2;
  if (durationHours <= 8) return 3;
  return 4;
}

function score(place: Place, interests: PlanRequest['interests']) {
  return place.interests.filter((interest) => interests.includes(interest)).length;
}

export function buildItinerary(request: PlanRequest): Itinerary | null {
  const candidates = publishedPlaces()
    .map((place) => ({ place, score: score(place, request.interests) }))
    .filter((candidate) => candidate.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.place.planningAllowanceUsd - right.place.planningAllowanceUsd,
    );

  const ranked = candidates.length
    ? candidates.map((candidate) => candidate.place)
    : publishedPlaces();
  const selected: Place[] = [];
  let totalAllowanceUsd = 0;

  for (const place of ranked) {
    const groupAllowanceUsd = place.planningAllowanceUsd * request.partySize;
    if (
      selected.length < maximumStops(request.durationHours) &&
      totalAllowanceUsd + groupAllowanceUsd <= request.totalBudgetUsd
    ) {
      selected.push(place);
      totalAllowanceUsd += groupAllowanceUsd;
    }
  }

  if (!selected.length) return null;

  const notes = [
    'The total is a planning allowance, not a ticket quote or booking confirmation.',
    'Confirm hours, tickets, access, weather, and transport with each source before travel.',
  ];
  if (!candidates.length) {
    notes.unshift('No exact interest match was available; the route uses the published NYC catalog.');
  }

  return {
    title: `${request.durationHours}-hour NYC plan`,
    stops: selected.map((place) => ({
      ...place,
      groupAllowanceUsd: place.planningAllowanceUsd * request.partySize,
    })),
    totalAllowanceUsd,
    remainingBudgetUsd: request.totalBudgetUsd - totalAllowanceUsd,
    notes,
    sources: selected.map(({ name, sourceName, sourceUrl }) => ({
      name,
      sourceName,
      sourceUrl,
    })),
  };
}
