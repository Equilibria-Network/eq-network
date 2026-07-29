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
- **Semantic status colours** (problem/solution/uncertain reds, greens, oranges) exist only in the
  explainer/lab visuals and are **not yet ratified** — see ADR-0002 / task-0002 P6. Until ratified, do not
  add new off-palette status colours.

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
- **Radius:** `--radius-sm 3px` (chips/badges/CTAs), `--radius-md 8px` (frames/link cards), `--radius-lg
12px` (feature cards). **Shadow:** `--shadow-card` (`0 4px 12px rgba(0,59,126,.1)`).

## Signature motifs

1. **Measured drawing structure** — hairline frames, registration marks, dimensions, mono annotations,
   and title blocks. Use these to organize a page, not decorate every surface.
2. **Localized graph paper and hatch** — true white is the dominant ground. Grid belongs inside technical
   figures; hatch belongs in narrow margins, information strips, or offset shadows.
3. **Sharp hatched-header card** — a fine hatched information strip above a white body. Horizontal cards
   use an offset hatched shadow without rotation.
4. **Annotated rule** — section breaks use a full hairline with a mono label riding on it.
5. **Dashed "honest hedge" badge** — `1px dashed` border, muted uppercase micro-label, for
   "in design / illustrative / assumptions." A genuine lab idiom.
6. **Lorenz butterfly mark** — a heavy closed outer contour with three fine concentric lines in each wing.
7. **Animation:** `transition … var(--transition-speed) ease`; portrait card hovers may use the overshoot easing
   `cubic-bezier(0.34,1.56,0.64,1)`. All rAF loops must honour `prefers-reduced-motion` (see audit-0002 A4).

## When you add or edit a page — checklist

- [ ] Wrap sections with the shared container/section utilities, not a new `.container` block.
- [ ] Use the annotated-rule section treatment from `/brand`.
- [ ] Use Space Grotesk for display and IBM Plex Mono only for technical annotation.
- [ ] Colours and font sizes come from tokens. **No raw hex** outside `variables.css`; **no raw rem** for
      type — use `--fs-*`.
- [ ] Quieter text = opacity on `--text-color`, never a grey hex.
- [ ] Breakpoints come from the named set.
- [ ] New interactive/animated visuals honour `prefers-reduced-motion`.
- [ ] Grid and hatch are localized; the page remains predominantly white.

Enforcement (a lint gate that fails CI when a raw value is used instead of a token) is planned as part
of the Tailwind migration in [ADR-0006](../adr/0006-tailwind-design-system.md) and task-0002 Stage 1.
