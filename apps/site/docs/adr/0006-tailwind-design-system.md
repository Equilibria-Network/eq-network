# ADR-0006: Tailwind v4 as the design-system foundation

- Status: Accepted
- Date: 2026-07-28
- Supersedes: [ADR-0002](0002-visual-language-system.md) (mechanism only; the concept is retained)

## Context

[ADR-0002](0002-visual-language-system.md) established _why_ the site needs a design system: the brand
navy is hand-typed in ~23 files, every page reinvents its section header / card / hero, and nothing stops
further drift. That reasoning stands. ADR-0002's _mechanism_, however, was a bespoke stack: hand-rolled
CSS-Modules tokens plus a stylelint enforcement rig, with Tailwind and other CSS frameworks explicitly
ruled out.

The owner reversed that call: build on an established framework rather than hand-roll one, chosen for the
long term ("whatever is the ideal framework ... future"), consistent with the same forward-looking
reasoning that moved this project from a React SPA to Astro. `packages/design-system` was still empty, so
there was no bespoke work to discard.

## Decision

Adopt **Tailwind v4** as the token + utility foundation of the design system. Keep everything ADR-0002
got right: tokens defined once, pages assembled from reusable components, drift caught mechanically, and
the redesign kept as a separate second stage.

- **Tokens** live in Tailwind's `@theme` (in `src/styles/tailwind.css`): the brand palette, type
  families, spacing, radii, and breakpoints, emitted as CSS custom properties and as utilities.
- **Utilities** come from Tailwind; shared **Astro/React components** (`SectionHeader`, `PageHero`,
  `Card`, `Section`, ...) are built from those utilities at current appearance in Stage 1.
- **Integration:** the `@tailwindcss/vite` plugin (not the deprecated `@astrojs/tailwind`). Tailwind v4's
  engine is CSS-native (`@theme`, `@utility`, `@layer`), zero-config, zero-runtime.
- **Preflight is intentionally not loaded yet.** The site keeps its own reset in `global.css`; Tailwind
  is imported as theme + utilities only, so utilities coexist with the existing CSS Modules without
  changing the current look. Migrating onto preflight is part of Stage 1, done deliberately.

### Why Tailwind v4 (over the alternatives considered)

- **vs. bespoke CSS Modules + stylelint (ADR-0002):** leans on an established, documented, widely-known
  system instead of maintaining our own tokens-and-lint rig.
- **vs. UnoCSS:** UnoCSS is faster and more flexible, but a smaller community is a weaker decade-long
  bet; Tailwind is Astro's first-class, best-supported option.
- **vs. a component library (DaisyUI, shadcn/ui):** those impose a visual language, which would fight
  this site's distinctive editorial/hand-drawn brand. Tailwind imposes none.
- **vs. pure native CSS:** modern CSS is future-proof but would reinvent the utility layer we chose to
  lean on. For accessible interactive primitives in the React islands (dialog, popover, tabs) we will
  pull in **Radix primitives** selectively (headless, unstyled) rather than adopt a whole library.

The brand's signature motifs stay bespoke: the roughjs hand-drawn visuals, parallax paper texture,
localized hatch and graph-paper patterns, the section-title underline, and the dashed "honest hedge"
badge are a layer _on top of_ Tailwind, not replaced by it. Surfaces remain flat and square: the visual
language prohibits simulated elevation and tonal gradients, and treats borders as purposeful exceptions.

## Consequences

- **Enables:** change the brand in one place; assemble pages from shared pieces; a smaller shipped CSS
  payload (only used utilities); a well-known system contributors already understand.
- **Cost:** a Stage-1 migration of the ~23 hand-typed values and the ad-hoc primitives onto the token
  utilities, plus a deliberate move onto preflight. Mechanical, appearance-preserving.
- **Sequencing:** the `/brand` page (task-0007) is built first as the living prototype of the tokens and
  motifs, then the per-page redesign (task-0002 Stage 2) rolls the language out. Enforcement (a lint gate
  that rejects raw values) lands with Stage 1, replacing ADR-0002's stylelint plan with the Tailwind
  equivalent.

## Revisit when

Tailwind proves a poor fit for a specific surface, or a genuinely better-supported foundation emerges.

## Sources

[ADR-0002](0002-visual-language-system.md) (the retained concept and the drift evidence);
[`../context/10-visual-language.md`](../context/10-visual-language.md) (palette, type, motifs);
Tailwind v4 (`@theme`/`@utility`, the `@tailwindcss/vite` plugin); the owner's direction to adopt an
established framework for the long term.
