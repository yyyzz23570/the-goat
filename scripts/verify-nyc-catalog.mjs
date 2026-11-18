import { readFile } from "node:fs/promises";

const file = new URL("../data/nyc-poi-v1.json", import.meta.url);
const places = JSON.parse(await readFile(file, "utf8"));

if (!Array.isArray(places) || places.length < 20) {
  throw new Error("The NYC catalog must contain at least 20 places.");
}

const ids = new Set();
for (const place of places) {
  if (ids.has(place.id)) throw new Error(`Duplicate place id: ${place.id}`);
  ids.add(place.id);
  for (const key of ["name", "sourceName", "sourceUrl", "imageUrl", "imageCreditUrl"]) {
    if (typeof place[key] !== "string" || !place[key]) throw new Error(`${place.id} is missing ${key}.`);
  }
  if (!Number.isFinite(place.planningAllowanceUsd) || place.planningAllowanceUsd < 0) {
    throw new Error(`${place.id} has an invalid USD planning allowance.`);
  }
  if (!place.published) throw new Error(`${place.id} must be published.`);
}

console.log(`Verified ${places.length} published NYC catalog records with source and image fields.`);
