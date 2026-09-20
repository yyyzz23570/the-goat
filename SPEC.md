# SPEC.md — Wayly / the-goat

Course-stage specification outline for Cornell SYSEN 5151.

This file is a **section framework only**. It does not invent product behavior, APIs, or future features. Fill a section only when the team has agreed content from the Innoslate model, course report, or existing repository documents.

Related files:

- Product concept: [`README.md`](README.md)
- System boundary: [`docs/context.md`](docs/context.md)
- Environment: [`docs/environment.md`](docs/environment.md)
- Initial toolchain decision: [`docs/decisions/0001-initial-toolchain.md`](docs/decisions/0001-initial-toolchain.md)

---

## 1. Document information

- Course: SYSEN 5151
- Team repository: `the-goat`
- Product name: Wayly / 途鉴
- Document type: course-stage specification outline
- Status: structure only; requirements not yet baselined in this repository

## 2. Purpose and scope

- Purpose of the system (see README OpsCon)
- Geographic scope for this course repository: **New York**
- In-scope for the current course stage
- Out of scope / not claimed by this repository
- Relationship to the current Beijing implementation source and the planned New York adaptation after migration

## 3. Operational concept (OpsCon)

- Traveler goal and expected use in New York
- High-level flow: preference input → Wayly result → traveler review/adjustment
- Operations-console concept
- Assumptions and non-promises (tickets, live hours, navigation, payments)

## 4. System context and boundary

- System of interest: Wayly System
- External entities: Traveler, LLM API, Map Provider API
- Context interactions (see `docs/context.md`)
- Modeling authority: Innoslate / course report (to be confirmed against this outline)

## 5. Stakeholders

- Traveler
- Course team
- Other stakeholders TBD / To be confirmed

## 6. Needs

- Traveler needs TBD / To be confirmed
- Operations / verification needs TBD / To be confirmed
- Course documentation and repository needs

## 7. System requirements

- Functional requirements TBD / To be confirmed
- Non-functional requirements TBD / To be confirmed
- Do not add requirements that are not agreed by the team

## 8. External interfaces

- Traveler ↔ Wayly System
- Wayly System ↔ LLM API
- Wayly System ↔ Map Provider API
- Interface names, protocols, and payloads: TBD / To be confirmed

## 9. Constraints and assumptions

- This repository is the course project repository
- Lab 0 currently provides a hard-coded API and a page that renders it; that is not the full Wayly product
- Do not reimplement the full application in parallel with the teammate migration
- Technology choices: see ADR `0001-initial-toolchain.md`; unresolved items remain TBD

## 10. Verification and validation

- Course documentation completeness
- Lab 0: `python -m pytest -q` and GitHub Actions
- Consistency with Innoslate and the course report TBD / To be confirmed
- Full product verification belongs with the migrated application files once they are in this repository

## 11. Open items

- Canonical LLM provider for the course model
- Canonical map provider for the course model
- Message formats for each context interaction
- Exact layout of the migrated application in this repository (owned by the teammate doing the migration)
