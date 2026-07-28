# Build a public brand page (/brand)

- Provenance: task-0007 (owner request)
- Links back to: [`../../context/10-visual-language.md`](../../context/10-visual-language.md),
  [`../../adr/0002-visual-language-system.md`](../../adr/0002-visual-language-system.md),
  [`task-0002-visual-language-alignment.md`](task-0002-visual-language-alignment.md),
  [`../deferred/task-0005-visual-asset-regeneration.md`](../deferred/task-0005-visual-asset-regeneration.md)
- Status: todo
- Owner: unassigned
- Priority: soon

## Problem

There is no single public page that presents the Equilibria Network brand identity. A `/brand` page is the
normal home for the logo, colour palette, typography, and usage guidance — useful for partners, press, and
contributors, and a forcing function that keeps the visual language honest (the page should render _from_
the design tokens, so drift shows up immediately).

## Done when

A `/brand` page exists (route under `src/pages/`, copy/data in `src/content/`, linked where appropriate),
presenting at least:

- **Logo** — the lockups in `public/img/logo/` (icon, icon+text, text-only), with clear/safe-space and
  "don't" examples, and download links.
- **Colour** — the palette with swatches, hex values, and token names (brand navy `#003B7E` + ramp, accent
  `#4AB3F4`, text/background), matching `src/styles/variables.css`.
- **Typography** — the two families (system sans for UI/body, Georgia/Times serif for editorial), the type
  scale, and weights.
- **Signature motifs** — hand-drawn roughjs visuals, parallax paper texture, the section-title underline,
  the textured card + tilting shadow hover, and the dashed "honest hedge" badge (see the visual-language
  contract for the canonical list).
- **Usage** — short do / don't guidance.

## Notes

- **Source of truth:** [`../../context/10-visual-language.md`](../../context/10-visual-language.md) already
  documents the palette, type, spacing, and motifs. This task turns that written contract into a rendered,
  public page. Keep the two consistent; if they disagree, the running site wins and the contract is fixed.
- **Sequencing:** ideally lands after (or alongside) the design-system foundation in
  [`task-0002-visual-language-alignment.md`](task-0002-visual-language-alignment.md) so swatches and type
  samples render from the real tokens/primitives rather than hardcoded values (dogfooding). A first version
  can be built from the documented values if the owner wants it sooner.
- **Assets:** pairs with [`../deferred/task-0005-visual-asset-regeneration.md`](../deferred/task-0005-visual-asset-regeneration.md)
  (one consistent visual identity across imagery) — the brand page is the natural place to showcase the
  result once that identity is defined.
- Follows the same content-in-`src/content/` discipline as the rest of the site (ADR-0004 / M6).
- The site domain is `eq-network.org`, so the page is `eq-network.org/brand`.
