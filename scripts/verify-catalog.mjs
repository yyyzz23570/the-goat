import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const catalog = JSON.parse(
  await readFile(new URL('../data/nyc-poi-v1.json', import.meta.url), 'utf8'),
);

assert.ok(catalog.length >= 20, 'The MVP catalog must contain at least 20 places.');

for (const place of catalog) {
  assert.equal(place.published, true, `${place.id} must be published.`);
  assert.ok(place.id && place.name, 'Every place needs an id and name.');
  assert.ok(Number.isFinite(place.latitude) && Number.isFinite(place.longitude), `${place.id} needs coordinates.`);
  assert.ok(Array.isArray(place.interests) && place.interests.length > 0, `${place.id} needs interests.`);
  assert.ok(Number.isFinite(place.planningAllowanceUsd) && place.planningAllowanceUsd >= 0, `${place.id} needs a nonnegative USD allowance.`);
  assert.ok(place.sourceUrl.startsWith('https://'), `${place.id} needs an HTTPS source URL.`);
  assert.ok(place.reviewedOn, `${place.id} needs a review date.`);
}

console.log(`Verified ${catalog.length} published NYC catalog records.`);
