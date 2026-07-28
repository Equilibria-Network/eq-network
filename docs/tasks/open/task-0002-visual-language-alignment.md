# Improve and align the site's UI/UX on a shared, enforceable design system

- Provenance: task-0002 (umbrella)
- Links back to: [`../../adr/0003-visual-language-system.md`](../../adr/0003-visual-language-system.md) (proposed),
  [`../../context/10-visual-language.md`](../../context/10-visual-language.md),
  [`../../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md`](../../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md)
- Status: proposed — awaiting owner sign-off on ADR-0003 and the per-page approach
- Owner: unassigned
- Priority: soon (large)

## Goal

**Improve the UI/UX of the whole site** and make it consistent, lighter, and hard to let drift again. The
home page sets the visual language; newer pages (`/lab`, `/explainer`, parts of `/roadmap`) have drifted and
should be upgraded — not frozen. See the design contract
[`../../context/10-visual-language.md`](../../context/10-visual-language.md).

## Two stages (kept separate on purpose)

The redesign is the goal. But it rides on a plumbing change, and mixing the two makes regressions
impossible to diagnose. So:

### Stage 1 — Foundation (mechanical, appearance-unchanged, low-risk)

Introduce the design system **without changing how anything looks yet**. This is the "pixel-identical" part,
and it is only pixel-identical because it is pure plumbing — it is _not_ the redesign.

- [ ] Add tokens to `variables.css` as aliases equal to current values; fix the `--color-bg`/`--bg-color`
      typo (audit-0002 B8).
- [ ] Replace hand-typed literals with tokens (23× `#003B7E`, grey ramp, navy filter string, redundant
      fallbacks).
- [ ] Add shared `.u-container` / `.u-section` utilities; migrate modules via `composes`.
- [ ] Extract the shared components (`SectionHeader`, `PageHero`, `Card`, `ClosingCTA`, `ProductSection`)
      at **current appearance**.
- [ ] Stand up stylelint + `@custom-media` + Prettier + a CI lint gate (do this last, so it does not fight
      the in-flight refactor).

An agent can do most of Stage 1 unsupervised because nothing should change visually — the acceptance test is
"the site looks the same, the code is now tokenized."

### Stage 2 — Per-page UI/UX redesign (the actual improvement)

With the foundation in place, upgrade the look and feel **one page at a time**, each as its own sub-task with
its own before/after and its own design decisions. Each sub-task decides what that page _should_ look like,
then builds it from the shared tokens/components (extending them where the redesign needs it).

Proposed per-page sub-tasks (to be created as `task-0002a…` when Stage 1 lands and we start each):

- [ ] **Explainer redesign** — the hardest drift (off-palette red/green, hard-coded greys, non-standard
      headings). Decide its visual treatment and rebuild on the system.
- [ ] **Roadmap redesign** — 90% aligned; decide whether it adopts the section-header underline motif and the
      canonical hero, and polish.
- [ ] **Lab redesign** — decide whether `LabHero` conforms to or intentionally varies the interior hero; align
      the badge/leaderboard/scenario styling.
- [ ] **Home / about / products** — currently the reference; a lighter pass to confirm they _are_ the standard
      (and fold any improvements back into the tokens/components).
- [ ] **Research, 404** — bring onto the system.

Open cross-cutting design decisions that Stage 2 will need to settle (per page or globally):

- The semantic status palette (problem/solution/uncertain reds/greens/oranges): confirm intent and pick
  canonical values — today red is `#e74c3c` and `#e03131`; orange is `#e67e22`/`#f08c00`/`#f59f00`.
- Card radius (8px vs 12px) and shadow style (hatched vs solid).
- Whether the two-column serif hero is the universal interior-hero, or pages may vary it.

## Relationship to task-0001

Stage 1 overlaps task-0001 Phase 6 (M1/M4/M8/M9). Do the token/component foundation **once, here**;
task-0001 references it rather than duplicating it.
