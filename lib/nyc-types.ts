export type PlaceCategory =
  | "landmark"
  | "museum"
  | "architecture"
  | "park"
  | "waterfront"
  | "food";

export type TransportPreference = "smart" | "public_transit" | "taxi" | "walk";

export type NycPlace = {
  id: string;
  name: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  interests: PlaceCategory[];
  planningAllowanceUsd: number;
  suggestedMinutes: number;
  sourceName: string;
  sourceUrl: string;
  reviewedOn: string;
  accessNote: string;
  priceNote: string;
  imageUrl: string;
  imageCreditUrl: string;
  published: boolean;
};

export type PlanRequest = {
  cityCode: "nyc";
  date: string;
  duration: "half_day" | "full_day";
  durationHours?: number;
  partySize: number;
  totalBudgetUsd: number;
  interests: PlaceCategory[];
  intentText: string;
  transportPreference: TransportPreference;
  walkingPreference: "easy" | "balanced" | "active";
  dining: "no_preference" | "vegetarian" | "coffee" | "local";
  accessibility: boolean;
  adjustment?: {
    action: "replace" | "shorten" | "budget";
    itineraryId: string;
    targetStopId?: string;
    previousPlaceIds?: string[];
    replacementPlaceId?: string;
  };
};

export type ItineraryStop = {
  id: string;
  placeId: string;
  name: string;
  time: string;
  durationMinutes: number;
  expectedSpendUsd: number;
  reason: string;
  sourceName: string;
  sourceUrl: string;
};

export type TransportSegment = {
  fromStopId: string;
  toStopId: string;
  recommendedMode: "walk" | "public_transit" | "taxi";
  estimatedMinutes: { min: number; max: number };
  estimatedCostUsd: { min: number; max: number } | null;
  uncertaintyNotice: string;
};

export type Itinerary = {
  id: string;
  status: "valid";
  title: string;
  overview: string;
  stops: ItineraryStop[];
  transportSegments: TransportSegment[];
  estimatedWalkKm: number;
  estimatedTotalSpendUsd: { min: number; max: number; status: "estimated" };
  confidenceNote: string;
  warnings: string[];
  version: string;
  dataVersionId: "nyc-poi-v1";
};

export type PlanMode = "controlled_fallback" | "insufficient_information";
