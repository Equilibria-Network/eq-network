# Visual language (the design contract)

Genre: reference (Diátaxis). This is the canonical description of the site's visual identity. The integrated
[`/brand`](../../src/pages/brand.astro) page is the rendered source of truth; this document records the
system so future page redesigns can apply it consistently.

Existing public pages still carry parts of the inherited identity. When they disagree with `/brand`, treat
that as migration work, not evidence that the identity is unsettled.

Status note: the tokens and primitives below are the **target** system. Much of it currently lives as
copy-pasted CSS values rather than tokens; the foundation is now Tailwind v4
([ADR-0006](../adr/0006-tailwind-design-system.md), superseding the bespoke plan in
[ADR-0002](../adr/0002-visual-language-system.md)), with the migration tracked in
[`../tasks/open/task-0002-visual-language-alignment.md`](../tasks/open/task-0002-visual-language-alignment.md).
The `/brand` page (`src/pages/brand.astro`) renders these tokens and motifs live and is the working
reference. Where a token below is not yet in `apps/site/src/styles/tailwind.css` (`@theme`) or
`variables.css`, it is proposed, not current.

## Colour

- **Brand primary (navy) `#003B7E`** — `--color-primary`, with a 7-step ramp (`--color-primary-dark` …
  `--color-primary-lightest`).
- **Accent light-blue `#4AB3F4`** — `--color-secondary` / `--color-blue-accent`. Decorative and for small
  accents; too light for body text on white (fails contrast).
- **Text `#000000`** — `--text-color`, on white `--bg-color`.
- **Muted text is opacity on `--text-color`, not a grey hex.** The canonical idiom is `opacity: 0.85`
  (muted), `0.65` (quiet), `0.5` (faint). Do **not** introduce `#999`/`#666`/etc. for quieter text.
- **Scientific-diagram semantics** use the shared `--diagram-*` tokens: graphite for working structure,
  green for cooperation, red for defection, amber for uncertainty, and stable green/blue/red/orange field
  identities for Cooperative AI, computational social science, agent foundations, and complex systems.
  These colors are approved for explanatory diagrams, not general interface chrome. Never rely on them
  alone: pair them with shape, line treatment, labels, or position.

## Type

- **Two families, on purpose:** **Space Grotesk** for display/headings and **IBM Plex Mono** for labels,
  annotations, coordinates, dimensions, and data. Body copy remains a legible system sans.
- **Scale (target tokens):** `--fs-hero 4.5rem`, `--fs-h1 3rem`, `--fs-h2 2.5rem`, `--fs-h3 1.75rem`,
  `--fs-lg 1.25rem`, `--fs-body 1.125rem`, `--fs-sm 0.95rem`, `--fs-xs 0.8rem`. Use a token, not a raw rem.
- **Weights:** 700 headings/tagline, 600 subheads/labels/CTAs, 500 rare. **Body:** `1.125rem / 1.7`.

## Spacing and layout

- **Container:** `max-width: 1400px; margin: 0 auto; padding: 0 2rem` (mobile: `1.5rem` ≤768, `1rem` ≤480).
  Use the shared `.u-container` utility, not a per-module redeclaration.
- **Section vertical rhythm:** editorial `6rem 0` (`--space-section`) or dense `4rem 0`
  (`--space-section-dense`); interior hero `8rem 0 4rem`.
- **Named breakpoints (target):** `--bp-sm 480`, `--bp-md 768`, `--bp-lg 992`, `--bp-xl 1400`. Use these,
  not one-off widths. (Note: CSS `var()` does not work inside `@media`; breakpoints are shared via
  PostCSS `@custom-media`, which is why they must be centralized — see ADR-0002.)

## Surface and elevation

- **Flat and square by default.** Interface panels, cards, controls, frames, and buttons use
  `border-radius: 0`. Semantic geometry such as circular actor marks, status dots, and slider thumbs is
  exempt.
- **No simulated elevation.** Do not use `box-shadow`, `text-shadow`, `filter: drop-shadow()`, offset
  pseudo-elements that read as shadows, or hover transforms whose purpose is to make an element appear
  lifted.
- **No tonal gradients.** Surfaces use solid colors. CSS gradient functions are permitted only as a
  rendering technique for discrete one-color hatch, graph-paper, registration, or rule patterns; they
  must not blend colors or imply lighting, depth, gloss, or elevation.
- **Borders are exceptional, not the layout system.** Prefer whitespace, alignment, solid field changes,
  type hierarchy, and localized hatch. Add a border or rule only when it communicates a functional
  boundary, focus state, measurement, diagram structure, or explicit editorial division.

## Signature motifs

1. **Measured drawing structure** — dimensions, mono annotations, construction lines, and title blocks can
   organize technical material, but figures are flat page regions by default. Visible card borders,
   registration marks, and status strips require a specific explanatory purpose.
2. **Localized graph paper and hatch** — true white is the dominant ground. Grid belongs inside technical
   figures; hatch belongs in narrow margins, information strips, or explanatory fields—not behind an
   object as a shadow.
3. **Sharp hatched-header card** — a square, flat white body with a fine hatched information strip. It has
   no offset layer or elevation treatment.
4. **Annotated rule** — section breaks use a full hairline with a mono label riding on it.
5. **Dashed "honest hedge" badge** — `1px dashed` border, muted uppercase micro-label, for
   "in design / illustrative / assumptions." A genuine lab idiom.
6. **Lorenz butterfly mark** — a heavy closed outer contour with three fine concentric lines in each wing.
7. **Animation:** `transition … var(--transition-speed) ease`; portrait card hovers may use the overshoot easing
   `cubic-bezier(0.34,1.56,0.64,1)`. All rAF loops must honour `prefers-reduced-motion` (see audit-0002 A4).

## Scientific-notebook diagrams

The canonical `/thesis` is the current executable reference for diagrams. Its grammar is:

- deterministic D3 layout separated from deterministic hand-drafted SVG paths;
- crisp Space Grotesk/IBM Plex Mono interface text, with Kalam reserved for equations, hypotheses, and
  working annotations;
- a predominantly white, unboxed drawing field;
- stable entities across transitions when continuity carries meaning;
- a genuinely different diagram composition when the narrative changes abstraction level;
- semantic color plus redundant shape, fill density, dash, label, and spatial cues; actor marks use open
  fill for humans, light one-way hatching for AI agents, and dense cross-hatching for institutions;
- straight-edged, lightly drafted polygons and restrained hatch fills rather than rounded,
  algorithmically perfect geometric marks;
- geometry-derived connectors that terminate at mark boundaries and route labels through reserved clear
  space;
- persistent legends for encodings that persist across scenes; scene-specific annotation must not imply a
  universal legend;
- SVG `title`/`desc`, keyboard-addressable meaningful nodes, and reduced-motion-safe transitions.

Keep renderer-specific domain state local. Promote a drawing primitive into shared infrastructure only
after another real diagram needs the same contract.

## When you add or edit a page — checklist

- [ ] Standard editorial pages start with `PageHeader.astro`; use `PageHeaderContent` (eyebrow, title,
      subtitle, one- or two-sentence summary, and optional prompt) instead of creating another
      page-specific hero.
- [ ] Full-viewport introductions use `PageHeader` with `variant="landing"`. The route composes that static
      header before an interactive island; visual essays do not copy their own version of the same chrome.
- [ ] Keep `PageSeo` search/social copy separate from the visible header copy. Repeated page patterns use
      a typed shared contract and component once there is a second real consumer.
- [ ] Long editorial/reference pages use `PageSidebar.astro` for contents navigation. Immersive landing,
      simulation, and visual-story pages may deliberately omit it.
- [ ] Wrap sections with the shared container/section utilities, not a new `.container` block.
- [ ] Use the annotated-rule section treatment from `/brand`.
- [ ] Use Space Grotesk for display and IBM Plex Mono only for technical annotation.
- [ ] Colours and font sizes come from tokens. **No raw hex** outside `variables.css`; **no raw rem** for
      type — use `--fs-*`.
- [ ] Quieter text = opacity on `--text-color`, never a grey hex.
- [ ] Breakpoints come from the named set.
- [ ] New interactive/animated visuals honour `prefers-reduced-motion`.
- [ ] Explanatory color has a non-color cue and uses the shared `--diagram-*` tokens.
- [ ] Technical figures are embedded flat unless a visible frame communicates something essential.
- [ ] Grid and hatch are localized; the page remains predominantly white.
- [ ] Surfaces are square and flat: no shadows, drop shadows, decorative rounding, or lift-on-hover
      transforms.
- [ ] Surfaces use solid fills. Any CSS gradient function draws a discrete hatch, grid, registration
      mark, or rule—not a tonal blend.
- [ ] Every visible border or rule has a functional, diagrammatic, or editorial purpose.

### Astro prose boundaries

When prose and an inline element meet across an Astro expression boundary, write the intended space
explicitly: `{sentence}{' '}<a ...>link</a>`. Source indentation is formatting, not a dependable content
space, and omitting the explicit node can render words such as `emailcontact@…`. Inline links inside a
sentence must also remain `display: inline`; reserve `inline-block` and top margins for standalone links.

Enforcement (a lint gate that fails CI when a raw value is used instead of a token) is planned as part
of the Tailwind migration in [ADR-0006](../adr/0006-tailwind-design-system.md) and task-0002 Stage 1.
