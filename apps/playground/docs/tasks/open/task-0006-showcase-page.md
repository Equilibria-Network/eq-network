# A guided showcase page before the playground

- Provenance: owner direction (Jonas, 2026-08-05, refining the 2026-08-05 restructure brief after a
  UX conversation with Markov). v2 direction same day, on review of v1: the page is an
  introduction to _gradual disempowerment_ — not to ABMs, which are the current tool and not
  inherently small; the opening arc runs scenario-forecasts → why coupled systems must be run →
  the Substack post ("Models of Society Are Built on Models of Agents") → the simulation. Visuals
  rebuilt from scratch as distributed packet-passing networks (owner sketches: spread-out nodes,
  edges shown, packets traveling them, resource depot for the economy, blue/red edge updates).
  Ending becomes playable in place: the coupled model with three dial groups of four registry
  parameters each plus preset chips. v1's separate endgames chapter is absorbed into the playable
  chapter's chips.
- Links back to: [`../../adr/0001-integrated-react-worker-workbench.md`](../../adr/0001-integrated-react-worker-workbench.md)
- Status: open
- Owner: unassigned
- Priority: now

## Problem

A cold visitor cannot tell what the playground is. `/playground` hands them the full apparatus at
once — scenario rail, condition bar, transport, metric cards, parameter tray — so they can play with
the model but never learn what an agent-based model is or why these four exist. Walking a claim and
sweeping a parameter space are different activities that want different affordances, and one screen
serving both serves neither.

## Scope

A new unlisted `/showcase` page: one linear guided flow for readers with no ABM background.

- Chapters in order: what an ABM is → the coupled world → economy → politics → culture → the
  endings on the coupled world → an explicit handoff into `/playground`, the papers, and the
  library repo.
- Watch-only affordances: play, scrub, next. No parameter tray, no preset bar; presets are staged
  by the script.
- Implemented as a second export of this package (`src/embed-showcase.ts` → `ShowcaseApp`),
  mounted by `apps/site/src/pages/showcase.astro`. All simulation machinery (worker client,
  kernel, scenes, charts, registry presets) is reused; the showcase script references scenario and
  preset ids and never duplicates parameter values.
- `/playground` is functionally unchanged; its only diff is the `PlayerIcon` extraction. `/lab`
  is untouched.

## Deliberate duplication

The playback loop exists twice (`App.tsx` inline and `src/showcase/usePlayback.ts`). Unifying them
means refactoring the canonical page's state into a hook, which this task deliberately avoids.
Follow-up: extract a shared playback hook once the showcase has survived contact with readers.

## Promotion gates

The page ships `noindex` and stays that way until, in order:

1. Owner copy review — the claims discipline binds the chapter prose (floors and provenance
   sentences from the registry's modelling notes must survive adaptation; no magnitudes without
   their context).
2. Owner decision on the nav entry (`Showcase` in `siteContent.nav.links`) and on whether `/lab`
   eventually redirects here. Both are out of scope for this task.

## Verification

- `pnpm --filter @eq-network/playground test` green, including the new
  `test/showcase-contracts.test.js` (chapter/beat contract against the registry).
- Root `pnpm build` green (playground `tsc --noEmit && vite build`, site `astro check && astro build`).
- `git diff` on `src/App.tsx` shows only the `PlayerIcon` import swap.
- Browser walkthrough at `/showcase`: chapters lazy-run on scroll-in; play/scrub/next work; each
  beat stages its promised dynamic; reduced motion suppresses autoplay; handoff hash-links land on
  the right playground scenario; `/playground` and `/lab` visually unchanged.
