# Playground documentation reconciliation — 2026-07-30

## Scope

Reconcile the repository front door, contribution contract, cross-app ADRs, site orientation, playground
architecture, tasks, performance evidence, privacy map, and development runbook with the implemented
integrated application.

## Corrections

- Replaced current-state references to the raw HTML production route with the
  `@eq-network/playground/embed` Astro integration.
- Recorded the implemented single-deployment boundary in proposed repo ADR-0003 instead of rewriting the
  accepted topology ADR.
- Updated the renderer contract from Canvas to scenario-specific SVG and documented the unchanged
  co-author showcase geometry as an invariant.
- Replaced the modal/drawer description with the right-rail Story/Settings replacement and promoted named
  conditions.
- Added the deterministic scientific and live browser gates to `CONTRIBUTING.md`, README commands, the
  architecture fitness-function table, and the runbook.
- Standardized local integrated development and smoke checks on port 4321.
- Separated the later development-server Lighthouse observation from the earlier production-preview
  baseline.
- Marked Playground as the primary product navigation target and created a deferred decision task for the
  still-present, unlinked `/products` route.
- Tracked unused Canvas prototypes and scientific kernel extraction as explicit follow-ups.

## Historical documents

Dated inherited audits and accepted ADRs retain statements that were true at their recorded time. Current
orientation, architecture, runbooks, task indexes, and README files now point to the replacement behavior.
The inherited `apps/site/prototypes/playground.html` also remains as comparison material; it is no longer a
production source.

## Verification

Completed evidence:

- in-scope Prettier checks passed;
- `pnpm lint`, `pnpm test`, and `pnpm build` passed;
- `pnpm --filter @eq-network/playground smoke:browser` passed against the canonical site server at
  `/lab/playground/` on port 4321, including desktop and 390 px mobile journeys;
- offline Markdown validation found 250 valid links, zero errors, and three intentionally excluded links;
- `git diff --cached --check` passed and staged-diff review excluded unrelated legal, brand, explainer, and
  QA-image work;
- repository-local Git identity was verified as the prescribed GitHub identity.

The aggregate `pnpm check` currently stops at `format:check` because the unrelated, uncommitted
`apps/site/src/components/brand/lorenzMarks.ts` does not pass Prettier. This reconciliation does not modify
or stage that in-progress brand file; the remaining gates were run separately and passed.

## Pending decisions

- Repo ADR-0003 and playground ADR-0001 remain `Proposed` until the owner explicitly ratifies their text.
- The `/products` redirect/archive/removal behavior remains deferred in site task-0012.
- Removing inactive renderer files requires explicit deletion approval.
