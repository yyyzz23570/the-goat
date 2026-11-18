# Milestone 1 Traceability

## Stakeholder need

**SN.1 — Budget-aware visitor:** A visitor needs to see a short NYC plan that
uses only reviewed places and makes the group's USD planning allowance visible.

## Trace

| Trace element | Evidence |
| --- | --- |
| Stakeholder need | `SN.1` above |
| Requirement | `RQ-PLAN-03`, `RQ-PLAN-04`, and `RQ-PLAN-05` in `SPEC.md` |
| System behavior | `POST /api/plan` validates the request and returns a constrained itinerary |
| Code | `app/api/plan/route.ts`, `lib/nyc-plan-contract.ts`, `lib/nyc-planner.ts`, `lib/nyc-places.ts` |
| User-facing proof | `app/page.tsx` renders stops, source links, group allowances, estimated total, and limitations |
| Deterministic check | `npm run verify:catalog` confirms 200 published records with source and image fields |

## Live demonstration script

1. State the System of Interest: “Wayly NYC creates a short, budget-visible
   itinerary from a published NYC catalog; live tickets, hours, and transit are
   external systems.”
2. On `/`, enter six hours, two travelers, a USD total budget, and two interests.
3. Select **Build my NYC plan** and show the returned stops, group allowances,
   estimated total, and official source links.
4. Open `SPEC.md` and trace `SN.1` to `RQ-PLAN-03` through `RQ-PLAN-05`.
5. Open `lib/nyc-planner.ts` to show the `published` filter and budget guard, then
   open `data/nyc-poi-v1.json` or `/ops` to show the source record used.
