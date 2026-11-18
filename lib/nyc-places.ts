import rawPlaces from "@/data/nyc-poi-v1.json";
import type { NycPlace } from "@/lib/nyc-types";

export const NYC_POI_DATA_VERSION = "nyc-poi-v1" as const;

export const places = rawPlaces as NycPlace[];
export const nycPlaces = places;
export const publishedPlaces = places.filter((place) => place.published);
export const placeById = Object.fromEntries(
  publishedPlaces.map((place) => [place.id, place]),
) as Record<string, NycPlace>;
