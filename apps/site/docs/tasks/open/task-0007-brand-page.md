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

## Iteration 2 (owner feedback, 2026-07-28)

Several parallel prototypes were built (`/brand` = A blueprint, `/brand/b` = engineering drawing,
`/brand/c` = cyanotype, `/brand/d` = minimal, `/brand/elements` = component options) plus a d3 graph
study (`/brand/graph`). Owner reactions:

**Locked-in likes**

- **Directions A, B, D** are all liked; **C (cyanotype) rejected** ("too deeptech modern").
- **Trunk = a combination of A + B.**
- The **faded light-grey graph-paper look from B**, paired with measurements / dimension arrows, is a
  core aesthetic to carry through (there will be many interactive elements). "Old-school math /
  architecture blueprint."
- **Research card = elements Option 2** (hatched header strip), BUT with the **existing home-page card
  behaviour**: hover tilt + hatch background (and flip for detail if needed) — do NOT invent a new hover.
- **Tooltip = elements Option 1** (solid, above).
- **Hover states**: keep the site's EXISTING hover (home/about); none of the elements-page hover options.
- The **generated hand-drawn hero was scrapped** (wrong medium); the Lorenz mark is the hero.

**The mark**

- Must be **symmetric** — both wings identical, "halfway between an infinity symbol and a butterfly."
  The asymmetric Lorenz-envelope mark and its "curve" were rejected; open/never-closing loops read as
  broken for a logo (artistic liberty is fine). Keep the **thick outer contour + thin inner** treatment.
- New options generated (`scripts/gen-lorenz-mark.mjs`, now a symmetric cardioid pair):
  `sym-concentric` (nested contours), `sym-noise` (jittered/organic inner), `sym-spiral` (continuous
  inner spiral = different topology), `sym-infinity` (flatter, more infinity-like), plus reversed/accent.
  **Awaiting owner pick** before wiring into the pages and replacing the site logo/favicon.

**Graphs / interactive visuals (e.g. the thesis page)**

- Owner did not like the static graph mocks; graphs are the hard case because they are **interactive and
  must transform** to communicate the point. Decision: **programmatic, not image generation** (image-gen
  is raster/static; only good for decorative backdrops). We are **not locked to static JS/Astro** — free
  to use **d3** (chosen: `d3-force` + `d3-selection`/`d3-transition` + `d3-drag`) or other viz frameworks.
  A first d3 prototype lives at `/brand/graph` (blueprint-styled society network on faint graph paper,
  with a state-propagation transform + reheat + drag; honours reduced-motion) plus static style studies
  (force / lattice / DAG). Think complex-systems / graph-theory aesthetics.
- Note: the thesis page graphs "not showing" on the dev server was the recurring **Vite dep-cache 504**
  (roughjs island fails to fetch after a dep change) — a dev-only artifact fixed by restarting the dev
  server; the production build is clean. Restart `astro dev` after any dependency change.

### Iteration 2b (2026-07-28, latest)

- **Mark reshaped** after the cardioid pair overlapped ("cut in the middle"): now a mirror-symmetric
  pair of Bezier **leaf wings** meeting only at base + apex (each wing kept in its own half-plane, so no
  crossing), a butterfly (owner rejected the flat/infinity tilt). `scripts/gen-lorenz-mark.mjs`; assets
  `sym-{concentric,duo,outline,noise,concentric-white,concentric-accent}.svg`. **View at `/brand/marks`**
  (gallery, light + dark, with a size test). Owner still to pick a treatment + confirm the shape.
- **Graph prototype shipped** at `/brand/graph`: a `d3-force` society network (blueprint-styled, sharp
  nodes cooperate=filled/defect=hollow, hairline+dashed edges, graph-paper ground) with run / propagate
  (BFS equilibrium spread) / reset transforms + drag, honouring reduced-motion, plus static style studies
  (force / lattice / DAG). Component `src/components/brand/GraphDemo.tsx`. Decision: **d3** is the graph
  tool; not locked to static JS (framework freedom confirmed by owner).
- Live prototype routes: `/brand` (A), `/brand/b`, `/brand/c`, `/brand/d`, `/brand/elements`,
  `/brand/graph`, `/brand/marks`.
- Recurring gotcha: after any dependency add, restart `astro dev` (Vite dep-cache 504 breaks islands in
  dev only; prod build is clean).

## Next steps (build the trunk once the mark is picked)

1. Owner picks a symmetric mark option (+ any tweak to weight / inner topology).
2. Wire the chosen mark into the pages; remove the rejected `v-*` and old `lorenz-*` / `sym-*` losers.
3. Build the **A+B trunk**: engineering-drawing structure (title block, dimension lines, registration
   ticks) + A's section rhythm, on true white, with the faded graph-paper grid used deliberately —
   including **filling the side whitespace** with grid/hatch instead of leaving it empty.
4. Adopt the chosen components: research card = option 2 + existing tilt/hatch/flip hover; tooltip = solid-above; keep the site's existing hover elsewhere.
5. Graph visuals: build out the d3 approach for the real thesis-page transforms.
6. Then task-0006 (regenerate every image to a sketch/hatch/blueprint variant) once the visual language
   is locked — do it once, against a fixed style reference, so all imagery is consistent.
