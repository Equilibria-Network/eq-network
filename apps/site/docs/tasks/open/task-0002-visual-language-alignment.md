# Improve and align the site's UI/UX on a shared, enforceable design system

- Provenance: task-0002 (umbrella)
- Links back to: [`../../adr/0006-tailwind-design-system.md`](../../adr/0006-tailwind-design-system.md) (foundation, accepted),
  [`../../adr/0002-visual-language-system.md`](../../adr/0002-visual-language-system.md) (concept, superseded),
  [`../../context/10-visual-language.md`](../../context/10-visual-language.md),
  [`../../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md`](../../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md)
- Status: in progress — foundation is **Tailwind v4** ([ADR-0006](../../adr/0006-tailwind-design-system.md),
  wired 2026-07-28); `PageHeader`, `PageSidebar`, and `VisualEssay` now establish initial contracts.
  Prototype-first per-page migration was owner-approved 2026-07-29 and is sequenced in
  [`task-0009`](task-0009-page-prototype-programme.md).
- Owner: unassigned
- Priority: soon (large)

> **Mechanism update (2026-07-28):** the design-system foundation is Tailwind v4, not the bespoke
> CSS-Modules-plus-stylelint plan described in the Stage-1 bullets below. Read those bullets for _what_
> Stage 1 delivers (tokens defined once, shared `.u-container`/`.u-section` and `SectionHeader`/`PageHero`/
> `Card` primitives, a lint gate); the _how_ is now Tailwind `@theme` + `@utility` + components, per
> ADR-0006. The completed `/brand` page
> ([task-0007](../done/task-0007-brand-page.md)) is the rendered identity reference.

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
- [ ] Extract the shared components (`SectionHeader`, `PageHero`, `Card`, `ClosingCTA`)
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

- [x] **Explainer redesign** — the hardest drift (off-palette red/green, hard-coded greys, non-standard
      headings). Prototype added at `/explainer/prototype` on 2026-07-28. It preserves `/explainer`, applies the
      measured identity, and evolves one persistent D3-solved world network through all seven thesis
      states. Incentive, equilibrium, uncertainty, and research-field layers enter around the same agents
      rather than replacing them. Two earlier renderers remain parked as unlinked drafts.
      The reusable shell and page-specific renderer boundary are proposed in
      [ADR-0007](../../adr/0007-visual-essay-system.md). Owner approved it and the prototype was promoted to
      `/explainer` on 2026-07-29. The owner then selected the clean scientific-notebook direction and
      promoted it on 2026-07-30 with narrative parity against the deployed seven-diagram sequence. The
      follow-up refinement uses the document scroll as the sole state selector, expands the flat drawing
      field, simplifies the persistent network, and treats Equilibria as one bridging node in a
      distributed translation mesh.
- [ ] **Roadmap redesign** — 90% aligned; decide whether it adopts the section-header underline motif and the
      canonical hero, and polish.
- [ ] **Lab redesign** — decide whether `LabHero` conforms to or intentionally varies the interior hero; align
      the badge/leaderboard/scenario styling.
- [ ] **Home / about** — currently the reference; a lighter pass to confirm they _are_ the standard
      (and fold any improvements back into the tokens/components). Products is excluded pending
      [`task-0012`](../deferred/task-0012-retire-products-route.md).
- [ ] **Research** — bring onto the system.
- [x] **404** — rebuilt on the measured visual identity with graph notation, sharp actions, and responsive
      scoped styling (2026-07-29).

Open cross-cutting design decisions that Stage 2 will need to settle (per page or globally):

- Restore the earlier hand-drawn, pencil-sketch, and Excalidraw-adjacent character without sacrificing
  legibility or reusable structure. Explore and select this through
  [`task-0011-hand-drawn-brand-prototypes.md`](task-0011-hand-drawn-brand-prototypes.md)
  before scaling the next editorial-page batch.
- The scientific-diagram semantic palette is now bounded by shared `--diagram-*` tokens. General interface
  status colors remain a separate decision.
- Flat surfaces are settled globally: square cards and controls, no simulated elevation or tonal
  gradients, and borders only where they communicate a functional, diagrammatic, or editorial boundary.
  CSS-generated hatch and graph-paper patterns remain part of the brand when localized.
- Whether the two-column serif hero is the universal interior-hero, or pages may vary it.

## Relationship to task-0001

Stage 1 overlaps task-0001 Phase 6 (M1/M4/M8/M9). Do the token/component foundation **once, here**;
task-0001 references it rather than duplicating it.
