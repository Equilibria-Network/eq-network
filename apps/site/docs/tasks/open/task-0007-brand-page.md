# Build a public brand page (/brand)

- Provenance: task-0007 (owner request)
- Links back to: [`../../context/10-visual-language.md`](../../context/10-visual-language.md),
  [`../../adr/0006-tailwind-design-system.md`](../../adr/0006-tailwind-design-system.md),
  [`../../adr/0002-visual-language-system.md`](../../adr/0002-visual-language-system.md) (superseded),
  [`task-0002-visual-language-alignment.md`](task-0002-visual-language-alignment.md),
  [`../deferred/task-0005-visual-asset-regeneration.md`](../deferred/task-0005-visual-asset-regeneration.md)
- Status: v1 built 2026-07-28 (`src/pages/brand.astro` + `src/content/brand.ts`, linked from the footer;
  not yet deployed) — iterating on visual polish and the generated hero asset
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

## Reframing (2026-07-28): prototype, not a locked brand

The owner's direction: **there is no identity yet — we are exploring.** The page is a surface for
**prototypes** that reinvent and elevate the identity; we iterate, settle, and only then does it become
the real brand page that informs the rest of the site. Do **not** catalogue the inherited look.

Cornerstones to keep (owner-endorsed): the **Lorenz attractor** (hero animation + the mark) and the
**hatched card**. Aesthetic target: **hatched / sketch / blueprint / measured but minimal** — clear
lines, sharp edges, purposeful — in the spirit of tailwindcss.com, with the structure of a clean
institutional brand page (ref: cesia.org/brand). The background texture is **only** to avoid flat white;
its colour/design is not endorsed (use a CSS hatch, not the green photo).

### Prototype v1 — "blueprint" direction (built 2026-07-28)

`src/pages/brand.astro` + `src/content/brand.ts`. A measured/blueprint exploration: a drawn hairline
sheet with corner ticks, a fine 45° diagonal hatch as the ground, mono annotations (IBM Plex Mono),
tight display type (Space Grotesk, self-hosted via `@fontsource`), sharp edges throughout, and a
restrained ink/accent/void/paper/line palette. Sections: mark, colour, type, system (the hatched cards).

**The mark was reinvented**: regenerated from the Lorenz equations as a clean single SVG path (a few
orbits, not a scribble) via `scripts/gen-lorenz-mark.mjs` — 11 KB each vs the old 518 KB hand-traced
logo. Four weights in `public/img/brand/marks/` (navy / reversed-white / thin / accent).

The earlier "catalogue the existing look" version and its generated hand-drawn hero were **scrapped** on
owner feedback.

### Open / to iterate (this is a draft, expect churn)

- This is one direction. Iterate on the owner's reaction; other directions are on the table.
- The Lorenz mark needs owner sign-off, then it should replace the site logo (`public/img/logo/`) and
  favicon; currently only the `/brand` marks use it.
- Space Grotesk / IBM Plex Mono are a **proposed** pairing (self-hosted, no CDN), swappable.
- The rest of the site chrome (navbar/footer) is still the old look; it clashes with the prototype and
  is redesigned later (task-0002 Stage 2) once the identity settles.
- `og:image` social card can be derived from the mark once the direction is settled (task-0001 A8).
- Not yet deployed (pending the push decision).
