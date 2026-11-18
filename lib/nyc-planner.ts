import { NYC_POI_DATA_VERSION, placeById, publishedPlaces } from "@/lib/nyc-places";
import type { Itinerary, NycPlace, PlaceCategory, PlanRequest, TransportSegment } from "@/lib/nyc-types";

export const NYC_PLANNER_VERSION = "nyc-controlled-planner-v2";

const EARTH_RADIUS_KM = 6371;
const MIN_STOPS = 2;
const MAX_STOPS = 6;
const MIN_VISIT_SHARE = 0.6;
const MIN_VISIT_MINUTES = 30;
const SAME_VENUE_KM = 0.08;
const MAX_WALK_PREFERENCE_KM = 4;
const COVERAGE_BONUS = 1.2;
const INTENT_COVERAGE_BONUS = 0.8;
const KEEP_BONUS = 3;
const ANCHOR_CANDIDATES = 20;
const FOOD_ONLY_VENUE_LIMIT = 4;
const FERRY_AREA = /New York Harbor|Staten Island/;
const HOURS_PER_STOP = 1.5;
const LUNCH_MINUTES = 12 * 60 + 30;
const LUNCH_OFFSET_KM_PER_HOUR = 1.5;
const AVERAGE_LEG_MINUTES = 20;
const UTILIZATION_BONUS = 3;
const INTENT_TERM_BONUS = 4;
const ANCHOR_SPACING_KM = 1;
const HOURS_PER_FOOD_VENUE = 5;
const STOP_SHORTFALL_PENALTY = 0.8;
const TRAVEL_HOUR_PENALTY = 2.5;

const WALK_LIMIT_KM: Record<PlanRequest["walkingPreference"], number> = { easy: 0.8, balanced: 1.5, active: 2.5 };
const DISTANCE_WEIGHT: Record<PlanRequest["walkingPreference"], number> = { easy: 0.9, balanced: 0.6, active: 0.35 };
const STEP_HEAVY = /\b(stairs|steps|hills)\b/i;

const CATEGORY_KEYWORDS: Record<PlaceCategory, string[]> = {
  landmark: ["landmark", "landmarks", "iconic", "famous", "history", "historic", "skyline", "observatory", "observation", "monument"],
  museum: ["museum", "museums", "art", "arts", "gallery", "galleries", "exhibit", "exhibits", "exhibition", "history", "design", "science"],
  architecture: ["architecture", "building", "buildings", "skyscraper", "skyscrapers", "cathedral", "church", "design"],
  park: ["park", "parks", "garden", "gardens", "green", "nature", "outdoor", "outdoors", "picnic", "stroll", "zoo"],
  waterfront: ["water", "waterfront", "river", "harbor", "beach", "ferry", "pier", "boardwalk", "sunset", "island"],
  food: ["food", "eat", "eating", "lunch", "dinner", "brunch", "pizza", "bagel", "bagels", "deli", "market", "snack", "dessert", "steak", "foodie"],
};

const STOPWORDS = new Set([
  "about", "also", "around", "classic", "city", "day", "family", "friends", "from", "good", "great", "have", "into", "just", "kids",
  "like", "long", "love", "maybe", "more", "morning", "afternoon", "evening", "museum", "museums", "near", "nice", "night", "park",
  "parks", "place", "places", "plus", "relaxed", "short", "some", "that", "then", "there", "this", "time", "tour", "tours", "trip",
  "view", "views", "visit", "walk", "walking", "want", "what", "when", "where", "which", "with", "would", "york", "center",
]);

type Intent = { categories: Set<PlaceCategory>; terms: string[] };
type ScoredPlace = { place: NycPlace; score: number; matched: PlaceCategory[]; intentCategories: PlaceCategory[]; intentHits: string[] };
type Schedule = { segments: TransportSegment[]; visits: number[]; trimmed: boolean };
type RouteFit = { ordered: NycPlace[]; schedule: Schedule; placeSpend: number; transportMin: number; transportMax: number };
type AdjustmentPlan = { keepIds: Set<string>; excludeIds: Set<string>; seed: NycPlace[]; maxStops: number; replaced?: NycPlace; replacement?: NycPlace };

function distanceKm(a: NycPlace, b: NycPlace) {
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const start = (a.latitude * Math.PI) / 180;
  const end = (b.latitude * Math.PI) / 180;
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(start) * Math.cos(end) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function durationHours(request: PlanRequest) {
  return request.durationHours ?? (request.duration === "full_day" ? 10 : 6);
}

function startMinutes(request: PlanRequest) {
  return durationHours(request) >= 11 ? 9 * 60 : 10 * 60;
}

function stopCap(request: PlanRequest) {
  return Math.min(MAX_STOPS, Math.max(MIN_STOPS, Math.round(durationHours(request) / HOURS_PER_STOP)));
}

function readIntent(text: string): Intent {
  const tokens = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const categories = new Set<PlaceCategory>();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as Array<[PlaceCategory, string[]]>) {
    if (tokens.some((token) => keywords.includes(token))) categories.add(category);
  }
  const terms = [...new Set(tokens.filter((token) => token.length >= 4 && !STOPWORDS.has(token)))];
  return { categories, terms };
}

function findIntentHits(place: NycPlace, intent: Intent) {
  const haystack = `${place.name} ${place.neighborhood}`.toLowerCase();
  return intent.terms.filter((term) => haystack.includes(term) || (term.length > 4 && term.endsWith("s") && haystack.includes(term.slice(0, -1))));
}

function isFoodVenue(place: NycPlace) {
  return place.interests[0] === "food";
}

function foodVenueLimit(request: PlanRequest) {
  if (request.interests.length === 1 && request.interests[0] === "food") return FOOD_ONLY_VENUE_LIMIT;
  return request.interests.includes("food") || request.dining === "local" ? Math.max(1, Math.round(durationHours(request) / HOURS_PER_FOOD_VENUE)) : 1;
}

function scorePlace(place: NycPlace, request: PlanRequest, intent: Intent, keepIds: Set<string>): ScoredPlace | null {
  const matched = place.interests.filter((interest) => request.interests.includes(interest));
  const intentCategories = place.interests.filter((interest) => intent.categories.has(interest));
  const intentHits = findIntentHits(place, intent);
  if (!matched.length && !intentCategories.length && !intentHits.length) return null;
  let score = (2 * matched.length) / request.interests.length + 0.5 * matched.length + 0.8 * Math.min(intentCategories.length, 2) + 1.2 * Math.min(intentHits.length, 3);
  if (request.dining === "local" && isFoodVenue(place)) score += 0.8;
  if (request.accessibility && STEP_HEAVY.test(place.accessNote)) score -= 1.5;
  if (keepIds.has(place.id)) score += KEEP_BONUS;
  return { place, score, matched, intentCategories, intentHits };
}

function needsFerry(from: NycPlace, to: NycPlace) {
  const fromFerry = FERRY_AREA.test(from.neighborhood);
  const toFerry = FERRY_AREA.test(to.neighborhood);
  if (!fromFerry && !toFerry) return false;
  return !(from.neighborhood.includes("Staten Island") && to.neighborhood.includes("Staten Island"));
}

function legMode(km: number, request: PlanRequest): TransportSegment["recommendedMode"] {
  if (request.transportPreference === "walk") return km <= MAX_WALK_PREFERENCE_KM ? "walk" : "public_transit";
  if (request.transportPreference === "smart") {
    const walkLimit = request.accessibility ? Math.min(WALK_LIMIT_KM.easy, WALK_LIMIT_KM[request.walkingPreference]) : WALK_LIMIT_KM[request.walkingPreference];
    return km <= walkLimit ? "walk" : "public_transit";
  }
  return request.transportPreference;
}

function transportForLeg(from: NycPlace, to: NycPlace, request: PlanRequest, index: number): TransportSegment {
  const km = distanceKm(from, to);
  const ids = { fromStopId: `stop_${index}`, toStopId: `stop_${index + 1}` };
  if (needsFerry(from, to)) return { ...ids, recommendedMode: "public_transit", estimatedMinutes: { min: Math.ceil(25 + km * 2), max: Math.ceil(45 + km * 4) }, estimatedCostUsd: { min: 0, max: 5.8 * request.partySize }, uncertaintyNotice: "This leg crosses the harbor by ferry; check the ferry schedule and whether your ticket already covers it." };
  const mode = legMode(km, request);
  if (mode === "walk") return { ...ids, recommendedMode: mode, estimatedMinutes: { min: Math.max(7, Math.ceil(km * 12)), max: Math.max(12, Math.ceil(km * 16)) }, estimatedCostUsd: { min: 0, max: 0 }, uncertaintyNotice: "Walking estimates use straight-line distance, not turn-by-turn directions." };
  if (mode === "taxi") return { ...ids, recommendedMode: mode, estimatedMinutes: { min: Math.ceil(10 + km * 2), max: Math.ceil(18 + km * 4) }, estimatedCostUsd: { min: Math.ceil(8 + km * 2), max: Math.ceil(14 + km * 4) }, uncertaintyNotice: "Taxi time and cost are planning estimates; confirm them with your chosen service." };
  const tooFarToWalk = request.transportPreference === "walk";
  return { ...ids, recommendedMode: mode, estimatedMinutes: { min: Math.ceil(15 + km * 2), max: Math.ceil(28 + km * 4) }, estimatedCostUsd: { min: 2.9 * request.partySize, max: 5.8 * request.partySize }, uncertaintyNotice: tooFarToWalk ? "This leg is too far to walk comfortably, so transit is suggested; check the current route and fare before travel." : "Transit time and fare are planning estimates; check the current route and fare before travel." };
}

function averageMinutes(segment: TransportSegment) {
  return Math.round((segment.estimatedMinutes.min + segment.estimatedMinutes.max) / 2);
}

function routeKm(route: NycPlace[]) {
  return route.slice(1).reduce((total, place, index) => total + distanceKm(route[index], place), 0);
}

function lunchOffsetHours(route: NycPlace[], request: PlanRequest) {
  let clock = startMinutes(request);
  for (const place of route) {
    if (isFoodVenue(place)) return Math.abs(clock - LUNCH_MINUTES) / 60;
    clock += place.suggestedMinutes + AVERAGE_LEG_MINUTES;
  }
  return 0;
}

function orderRoute(places: NycPlace[], request: PlanRequest) {
  if (places.length < 2) return places;
  let best = places;
  let bestCost = Infinity;
  for (const start of places) {
    const ordered = [start];
    const remaining = places.filter((place) => place !== start);
    while (remaining.length) {
      const last = ordered[ordered.length - 1];
      const nearestIndex = remaining.reduce((bestIndex, candidate, index) => distanceKm(last, candidate) < distanceKm(last, remaining[bestIndex]) ? index : bestIndex, 0);
      ordered.push(remaining.splice(nearestIndex, 1)[0]);
    }
    for (const route of [ordered, [...ordered].reverse()]) {
      const cost = routeKm(route) + LUNCH_OFFSET_KM_PER_HOUR * lunchOffsetHours(route, request);
      if (cost < bestCost) { best = route; bestCost = cost; }
    }
  }
  return best;
}

function buildSchedule(ordered: NycPlace[], request: PlanRequest, allowTrim: boolean): Schedule | null {
  const segments = ordered.slice(1).map((place, index) => transportForLeg(ordered[index], place, request, index + 1));
  const transitMinutes = segments.reduce((total, segment) => total + averageMinutes(segment), 0);
  const available = durationHours(request) * 60;
  const ideal = ordered.map((place) => place.suggestedMinutes);
  const idealTotal = ideal.reduce((total, minutes) => total + minutes, 0);
  if (transitMinutes + idealTotal <= available) return { segments, visits: ideal, trimmed: false };
  if (!allowTrim) return null;
  const minimum = ideal.map((minutes) => Math.min(minutes, Math.max(MIN_VISIT_MINUTES, Math.round(minutes * MIN_VISIT_SHARE))));
  const minimumTotal = minimum.reduce((total, minutes) => total + minutes, 0);
  if (transitMinutes + minimumTotal > available) return null;
  const share = idealTotal === minimumTotal ? 0 : (available - transitMinutes - minimumTotal) / (idealTotal - minimumTotal);
  const visits = ideal.map((minutes, index) => Math.max(minimum[index], Math.floor((minimum[index] + (minutes - minimum[index]) * share) / 5) * 5));
  return { segments, visits, trimmed: true };
}

function fitRoute(places: NycPlace[], request: PlanRequest, allowTrim: boolean): RouteFit | null {
  const ordered = orderRoute(places, request);
  const schedule = buildSchedule(ordered, request, allowTrim);
  if (!schedule) return null;
  const placeSpend = ordered.reduce((total, place) => total + place.planningAllowanceUsd * request.partySize, 0);
  const transportMin = schedule.segments.reduce((total, segment) => total + (segment.estimatedCostUsd?.min ?? 0), 0);
  const transportMax = schedule.segments.reduce((total, segment) => total + (segment.estimatedCostUsd?.max ?? 0), 0);
  if (placeSpend + transportMin > request.totalBudgetUsd) return null;
  return { ordered, schedule, placeSpend, transportMin, transportMax };
}

function readAdjustment(request: PlanRequest): AdjustmentPlan {
  const adjustment = request.adjustment;
  const previous = (adjustment?.previousPlaceIds ?? []).map((id) => placeById[id]).filter((place): place is NycPlace => Boolean(place));
  if (!adjustment || !previous.length) return { keepIds: new Set(), excludeIds: new Set(), seed: [], maxStops: stopCap(request) };
  if (adjustment.action === "replace") {
    const replaced = previous[Number(adjustment.targetStopId?.replace("stop_", "")) - 1];
    const kept = previous.filter((place) => place !== replaced);
    const candidate = adjustment.replacementPlaceId ? placeById[adjustment.replacementPlaceId] : undefined;
    const replacement = candidate && candidate !== replaced && !kept.includes(candidate) ? candidate : undefined;
    return { keepIds: new Set(kept.map((place) => place.id)), excludeIds: new Set(replaced ? [replaced.id] : []), seed: replacement ? [replacement, ...kept] : kept, maxStops: previous.length, replaced, replacement };
  }
  return { keepIds: new Set(previous.map((place) => place.id)), excludeIds: new Set(), seed: [], maxStops: adjustment.action === "shorten" ? Math.min(previous.length, stopCap(request)) : stopCap(request) };
}

function coveredThemes(places: NycPlace[], request: PlanRequest, intent: Intent) {
  const interests = new Set(places.flatMap((place) => place.interests.filter((interest) => request.interests.includes(interest))));
  const intentThemes = new Set(places.flatMap((place) => place.interests.filter((interest) => intent.categories.has(interest))));
  const intentTerms = new Set(places.flatMap((place) => findIntentHits(place, intent)));
  return { interests, intentThemes, intentTerms };
}

function growRoute(start: NycPlace[], scored: ScoredPlace[], request: PlanRequest, intent: Intent, maxStops: number) {
  const selected = [...start];
  const foodLimit = foodVenueLimit(request);
  while (selected.length < maxStops) {
    const covered = coveredThemes(selected, request, intent);
    const foodCount = selected.filter(isFoodVenue).length;
    const ranked = scored
      .filter(({ place }) => !selected.includes(place) && !(isFoodVenue(place) && foodCount >= foodLimit))
      .map(({ place, score, matched, intentCategories, intentHits }) => {
        const nearestKm = selected.length ? Math.min(...selected.map((stop) => distanceKm(stop, place))) : 0;
        const coverage = COVERAGE_BONUS * matched.filter((interest) => !covered.interests.has(interest)).length
          + INTENT_COVERAGE_BONUS * intentCategories.filter((interest) => !covered.intentThemes.has(interest)).length
          + INTENT_TERM_BONUS * Math.min(1, intentHits.filter((term) => !covered.intentTerms.has(term)).length);
        return { place, nearestKm, value: score + coverage - DISTANCE_WEIGHT[request.walkingPreference] * nearestKm };
      })
      .filter(({ nearestKm }) => !selected.length || nearestKm >= SAME_VENUE_KM)
      .sort((a, b) => b.value - a.value);
    const next = ranked.find(({ place }) => fitRoute([...selected, place], request, selected.length < MIN_STOPS));
    if (!next) break;
    selected.push(next.place);
  }
  return selected;
}

function routeQuality(route: NycPlace[], scoredById: Map<string, ScoredPlace>, request: PlanRequest, intent: Intent) {
  const fit = fitRoute(route, request, true);
  if (!fit) return -Infinity;
  const covered = coveredThemes(route, request, intent);
  const relevance = fit.ordered.reduce((total, place, index) => total + (scoredById.get(place.id)?.score ?? 0) * Math.sqrt(fit.schedule.visits[index] / 60), 0);
  const visitMinutes = fit.schedule.visits.reduce((total, minutes) => total + minutes, 0);
  const travelMinutes = fit.schedule.segments.reduce((total, segment) => total + averageMinutes(segment), 0);
  const utilization = UTILIZATION_BONUS * Math.min(1, visitMinutes / (durationHours(request) * 60)) - TRAVEL_HOUR_PENALTY * (travelMinutes / 60);
  const coverage = 2 * COVERAGE_BONUS * covered.interests.size + 2 * INTENT_COVERAGE_BONUS * covered.intentThemes.size + INTENT_TERM_BONUS * Math.min(covered.intentTerms.size, 3);
  const shortfall = STOP_SHORTFALL_PENALTY * Math.max(0, stopCap(request) - route.length);
  return relevance + coverage + utilization - shortfall - DISTANCE_WEIGHT[request.walkingPreference] * routeKm(fit.ordered);
}

function selectPlaces(scored: ScoredPlace[], request: PlanRequest, intent: Intent, adjustment: AdjustmentPlan) {
  const seeded: NycPlace[] = [];
  for (const place of adjustment.seed) {
    if (seeded.length < adjustment.maxStops && fitRoute([...seeded, place], request, true)) seeded.push(place);
  }
  if (seeded.length) return growRoute(seeded, scored, request, intent, adjustment.maxStops);
  const scoredById = new Map(scored.map((entry) => [entry.place.id, entry]));
  const anchors: ScoredPlace[] = [];
  for (const entry of [...scored].sort((a, b) => b.score - a.score)) {
    if (anchors.length >= ANCHOR_CANDIDATES) break;
    if (anchors.some((anchor) => distanceKm(anchor.place, entry.place) < ANCHOR_SPACING_KM) || !fitRoute([entry.place], request, true)) continue;
    anchors.push(entry);
  }
  let best: NycPlace[] = [];
  let bestQuality = -Infinity;
  for (const anchor of anchors) {
    const route = growRoute([anchor.place], scored, request, intent, adjustment.maxStops);
    const quality = routeQuality(route, scoredById, request, intent);
    const betterLength = route.length >= MIN_STOPS && best.length < MIN_STOPS;
    if (betterLength || ((route.length >= MIN_STOPS) === (best.length >= MIN_STOPS) && quality > bestQuality)) { best = route; bestQuality = quality; }
  }
  return best;
}

function insufficiencyReason(scored: ScoredPlace[], request: PlanRequest, intent: Intent, adjustment: AdjustmentPlan) {
  if (!scored.length) return "No published NYC places match these interests yet. Add another interest or describe what you want to do.";
  const travelers = `${request.partySize} traveler${request.partySize === 1 ? "" : "s"}`;
  const affordable = scored.filter(({ place }) => place.planningAllowanceUsd * request.partySize <= request.totalBudgetUsd);
  if (affordable.length < MIN_STOPS) return `Only ${affordable.length} matching place${affordable.length === 1 ? "" : "s"} fit a $${request.totalBudgetUsd} budget for ${travelers}. Increase the budget or add free interests such as parks or landmarks.`;
  const withoutBudgetLimit = { ...request, totalBudgetUsd: Number.MAX_SAFE_INTEGER };
  if (selectPlaces(scored, withoutBudgetLimit, intent, adjustment).length >= MIN_STOPS) return `A $${request.totalBudgetUsd} budget for ${travelers} cannot cover two matching stops plus transit fares. Increase the budget or switch to walking-friendly interests.`;
  return `${durationHours(request)} hours is not enough for two matching stops plus travel time. Add time or choose interests with shorter visits.`;
}

function formatClock(totalMinutes: number) {
  const minutes = ((totalMinutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function stopReason(place: NycPlace, request: PlanRequest, scored: ScoredPlace | undefined, adjustment: AdjustmentPlan) {
  if (adjustment.replacement === place && adjustment.replaced) return `Replaces ${adjustment.replaced.name} as you requested.`;
  const matched = place.interests.filter((interest) => request.interests.includes(interest));
  const parts: string[] = [];
  if (matched.length) parts.push(`Matches your ${matched.length > 2 ? `${matched.slice(0, -1).join(", ")}, and ${matched[matched.length - 1]}` : matched.join(" and ")} interests.`);
  if (scored?.intentHits.length) parts.push(`Fits ${scored.intentHits.slice(0, 2).map((term) => `"${term}"`).join(" and ")} from your request.`);
  else if (!matched.length && scored?.intentCategories.length) parts.push(`Fits the ${scored.intentCategories.slice(0, 2).join(" and ")} theme${scored.intentCategories.length > 1 ? "s" : ""} in your request.`);
  if (request.dining === "local" && isFoodVenue(place)) parts.push("Adds a local food stop.");
  return parts.join(" ") || "Selected from the published NYC catalog.";
}

function planWarnings(request: PlanRequest, fit: RouteFit, adjustment: AdjustmentPlan) {
  const warnings = ["Planning allowances are not live prices.", "This route does not book tickets, navigation, or transport."];
  if (fit.schedule.trimmed) warnings.push("Some visits were shortened to fit your available hours.");
  if (adjustment.replacement && !fit.ordered.includes(adjustment.replacement)) warnings.push(`${adjustment.replacement.name} did not fit your time or budget, so Wayly chose the closest fit instead.`);
  if (request.accessibility) warnings.push("Step-free access is not verified in this catalog; confirm accessibility with each venue before travel.");
  if (request.dining === "vegetarian") warnings.push("Vegetarian options are not tagged in this catalog; check menus near your route.");
  if (request.dining === "coffee") warnings.push("Coffee stops are not part of this catalog; look for one near your route.");
  return warnings;
}

export function planNycItinerary(request: PlanRequest): { itinerary: Itinerary | null; insufficiencyReason?: string } {
  const intent = readIntent(request.intentText);
  const adjustment = readAdjustment(request);
  const scored = publishedPlaces
    .filter((place) => !adjustment.excludeIds.has(place.id))
    .map((place) => scorePlace(place, request, intent, adjustment.keepIds))
    .filter((entry): entry is ScoredPlace => Boolean(entry));
  const selected = selectPlaces(scored, request, intent, adjustment);
  const fit = selected.length >= MIN_STOPS ? fitRoute(selected, request, true) : null;
  if (!fit) return { itinerary: null, insufficiencyReason: insufficiencyReason(scored, request, intent, adjustment) };

  const scoredById = new Map(scored.map((entry) => [entry.place.id, entry]));
  const hours = durationHours(request);
  let clock = hours >= 11 ? 9 * 60 : 10 * 60;
  const stops = fit.ordered.map((place, index) => {
    const time = formatClock(clock);
    clock += fit.schedule.visits[index] + (fit.schedule.segments[index] ? averageMinutes(fit.schedule.segments[index]) : 0);
    return { id: `stop_${index + 1}`, placeId: place.id, name: place.name, time, durationMinutes: fit.schedule.visits[index], expectedSpendUsd: place.planningAllowanceUsd * request.partySize, reason: stopReason(place, request, scoredById.get(place.id), adjustment), sourceName: place.sourceName, sourceUrl: place.sourceUrl };
  });
  const neighborhoods = [...new Set(fit.ordered.map((place) => place.neighborhood))].slice(0, 3);
  const itinerary: Itinerary = {
    id: `nyc_${crypto.randomUUID()}`,
    status: "valid",
    title: "Your NYC itinerary",
    overview: `A ${hours}-hour route with ${stops.length} stops around ${neighborhoods.join(", ")}, selected from the published NYC catalog.`,
    stops,
    transportSegments: fit.schedule.segments,
    estimatedWalkKm: Number(fit.schedule.segments.reduce((total, segment, index) => total + (segment.recommendedMode === "walk" ? distanceKm(fit.ordered[index], fit.ordered[index + 1]) : 0), 0).toFixed(1)),
    estimatedTotalSpendUsd: { min: Math.ceil(fit.placeSpend + fit.transportMin), max: Math.ceil(fit.placeSpend + fit.transportMax), status: "estimated" },
    confidenceNote: "All stops link to a published source. Opening hours, ticket availability, and live transit conditions must be checked before travel.",
    warnings: planWarnings(request, fit, adjustment),
    version: NYC_PLANNER_VERSION,
    dataVersionId: NYC_POI_DATA_VERSION,
  };
  return { itinerary };
}

export function suggestReplacements(itinerary: Itinerary, targetStopId: string | null, request: PlanRequest, limit = 3): NycPlace[] {
  const inPlan = new Set(itinerary.stops.map((stop) => stop.placeId));
  const target = placeById[itinerary.stops.find((stop) => stop.id === targetStopId)?.placeId ?? ""];
  const intent = readIntent(request.intentText);
  return publishedPlaces
    .filter((place) => !inPlan.has(place.id) && place.planningAllowanceUsd * request.partySize <= request.totalBudgetUsd)
    .map((place) => scorePlace(place, request, intent, new Set()))
    .filter((entry): entry is ScoredPlace => Boolean(entry))
    .map(({ place, score }) => {
      const shared = target ? place.interests.filter((interest) => target.interests.includes(interest)).length : 0;
      const km = target ? distanceKm(target, place) : 0;
      return { place, value: score + 0.5 * shared - DISTANCE_WEIGHT[request.walkingPreference] * km };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map(({ place }) => place);
}

export function resolveNycPlace(placeId: string) {
  return placeById[placeId];
}
