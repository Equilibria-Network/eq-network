# Trim the CI Library explainer and fold measurement into the closing arc

- Provenance: owner feedback rounds on `/library/prototype` (2026-08-07)
- Links back to: [`task-0009-page-prototype-programme.md`](task-0009-page-prototype-programme.md);
  engine-side producer `Collective Intelligence Library/experiments/library_explainer/`
  (its README documents the fixture contract and regen command)
- Status: done (2026-08-08) — executed with the owner's amended direction, which
  went further than the plan below: the failure-modes interlude ("The organising
  frame") was removed as well, and in place of the measurement segment a new
  `category` segment landed — commutative diagrams over the pipeline fixture
  showing how the engine combines functions and how that relates to applied
  category theory (arrows on one object, effect-refined types, commuting
  squares as derived parallelism, the tick as a composite and the run as its
  iterate; scene `scenes/CategoryDiagram.tsx`, stage kind `category`). Owner
  also asked the copy to carry motivation: composition as complexity from
  simplicity for larger builds, spectral graph theory as what scales and as a
  source of new metrics. Fixture handling followed option (a): engine exporter
  untouched, surplus noted in the engine README. Contracts test now pins the
  segment list ['object', 'step', 'compiler', 'category', 'matrix', 'spectral']
  and checks the commuting-square claim against the fixture's batch/hazard data.
- Owner: Claude session 2026-08-08
- Priority: now

## Where things stand

`/library/prototype` (unlisted, noindex, sitemap-excluded) explains the CI
Library from engine-exported fixtures only: six scroll segments
(object → step → compiler → *failure-modes prose* → believe → matrix →
spectral → *future-views prose*), all data from
`apps/site/src/data/library-explainer/` (pasted from the engine exporter;
ajv-validated in CI via `scripts/validate-explainer-fixtures.mjs`; contracts +
purity-guard tests in `test/library-explainer-contracts.test.mjs`). Components
live in `src/components/library-explainer/` (site-local; importing the
playground package fails a test). All checks green: site test, build, lint;
engine pytest 352.

Already removed on owner direction: the GUI-editor sketch, the run-playback
charts (too slow, uninteresting result), the visualisations sketch (replaced
by the written-out "The views this opens" prose). Code panels render
declarations as the page's read/write chips.

## The change (owner direction, verbatim intent)

1. **Remove the measurement segment** (`believe` in
   `components/library-explainer/script.ts`) entirely: the
   "Does the system still answer to its members?" counterfactual-chart step
   and both scorecard steps. The owner doesn't like them.
2. **Incorporate the good material into the later parts** instead of keeping a
   segment for it. Suggested folds (owner said "can", so use judgment):
   - The causal-instrument idea (paired same-key rollouts, influence-now)
     already lives in the future-views prose as "An influence ticker" — keep,
     maybe sharpen with one sentence from the removed step.
   - The caveats-as-data point (caveat class shipped inside the fixture,
     rendered as badges) can become one block or coda line in the
     future-views prose, or a sentence in the matrix/spectral intros.
3. **Cleanup that follows:**
   - `script.ts`: drop the segment; contracts test segment-id list becomes
     `['object', 'step', 'compiler', 'matrix', 'spectral']`; failure-modes
     interlude stays after `compiler` (check its coda still reads correctly
     once nothing "below" does paired rollouts — reword if needed).
   - Scenes `CounterfactualChart.tsx` and `Scorecard.tsx` (and the
     `counterfactual-chart` / `scorecard` stage kinds) become unused → delete
     (repo rule: deletion over dead code).
   - Fixtures `scorecard.json`, `influence-curve.json`, `runs/*.json` become
     unused by the page. Options: (a) leave the engine exporter as-is and keep
     shipping them (harmless, ~25 KB, no contract change) or (b) strip them
     from `experiments/library_explainer/` (schema + manifest + validator +
     tests change on BOTH sides — a versioned-contract edit). Recommend (a)
     for this round; note the surplus in the engine README.
4. **Verify:** `pnpm --filter @eq-network/site test`, site build, lint; visual
   pass on the dev server.

## Follow-on in the same session: promotion (2026-08-08, owner direction)

The owner then asked for a nav presence, which is the promotion moment
task-0009 anticipated:

- Nav gains a "CI Library" dropdown (first dropdown in the nav — `NavItem`
  with `children` in `content/site.ts`, dropdown rendering in
  `layout/Navbar.tsx`) holding "Showcase" → `/showcase/` and "Explanation" →
  `/library/explanation/`. The flat Showcase entry moved inside it.
- `/library/explanation` is the canonical page (indexed, in the sitemap);
  `/library/prototype` stays as the unlisted prototype route rendering the
  same component. `content/library-prototype.ts` is the shared copy source
  for both, per the showcase pattern.
- The explainer now closes with a "Going deeper" section linking the
  whitepaper PDF at `/pdfs/cilib-whitepaper.pdf` (verified: the alpha-release
  working paper, July 2026 draft).

## Next after this (separate task)

Owner wants a review of the roadmap prototype at
`http://localhost:4322/roadmap/prototype` (note the port — second dev server).
