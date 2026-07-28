# Visual language (the design contract)

Genre: reference (Diátaxis). This is the canonical description of the site's visual language, inferred from
the home page and the consistent about/products treatments. **The home page is the spec;** this doc turns
that tribal knowledge into a written contract so humans and agents build new pages that match.

When it and the running site disagree, the site wins and this doc gets fixed. When a _new page_ disagrees
with this doc, the page is drifting — fix the page.

Status note: the tokens and primitives below are the **target** system. Much of it currently lives as
copy-pasted CSS values rather than tokens; see [ADR-0003](../adr/0003-visual-language-system.md) (proposed)
and [`../tasks/open/task-0002-visual-language-alignment.md`](../tasks/open/task-0002-visual-language-alignment.md)
for the migration. Where a token name below does not yet exist in `apps/site/src/styles/variables.css`, it is
proposed, not current.

## Colour

- **Brand primary (navy) `#003B7E`** — `--color-primary`, with a 7-step ramp (`--color-primary-dark` …
  `--color-primary-lightest`).
- **Accent light-blue `#4AB3F4`** — `--color-secondary` / `--color-blue-accent`. Decorative and for small
  accents; too light for body text on white (fails contrast).
- **Text `#000000`** — `--text-color`, on white `--bg-color`.
- **Muted text is opacity on `--text-color`, not a grey hex.** The canonical idiom is `opacity: 0.85`
  (muted), `0.65` (quiet), `0.5` (faint). Do **not** introduce `#999`/`#666`/etc. for quieter text.
- **Semantic status colours** (problem/solution/uncertain reds, greens, oranges) exist only in the
  explainer/lab visuals and are **not yet ratified** — see ADR-0003 / task-0002 P6. Until ratified, do not
  add new off-palette status colours.

## Type

- **Two families, on purpose:** system sans for body and UI; **Georgia/Times serif** (`--ff-serif`) for
  interior-page hero titles and long-form descriptions. Serif = editorial gravitas; sans = product/UI.
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
  PostCSS `@custom-media`, which is why they must be centralized — see ADR-0003.)
- **Radius:** `--radius-sm 3px` (chips/badges/CTAs), `--radius-md 8px` (frames/link cards), `--radius-lg
12px` (feature cards). **Shadow:** `--shadow-card` (`0 4px 12px rgba(0,59,126,.1)`).

## Signature motifs (the actual brand)

1. **Hand-drawn roughjs visuals** — the differentiator (hero, explainer network/society, lab scenarios).
   Sketchy strokes, `roughness` ~0.4–1.2, navy + accent palette.
2. **Parallax paper texture** — a fixed full-viewport texture at `opacity: 0.03` behind transparent content.
3. **Textured-paper card with a tilting shadow-card hover** — publications and roadmap phase cards.
4. **Section-title underline accent** — a left-aligned `2.5rem` heading with an `80px × 3px`
   `--color-primary` underline (`title::after`). This is the section-header signature.
5. **Dashed "honest hedge" badge** — `1px dashed` border, muted uppercase micro-label, for
   "in design / illustrative / assumptions." A genuine lab idiom.
6. **Two-column serif interior hero** — `4.5rem` uppercase Georgia title + serif description, `1fr 1.2fr`.
7. **Animation:** `transition … var(--transition-speed) ease`; card hovers use the overshoot easing
   `cubic-bezier(0.34,1.56,0.64,1)`. All rAF loops must honour `prefers-reduced-motion` (see audit-0002 A4).

## When you add or edit a page — checklist

- [ ] Wrap sections with the shared container/section utilities, not a new `.container` block.
- [ ] Use a `<SectionHeader>` (title + underline) — do not hand-roll the heading + `::after`.
- [ ] Interior hero: use `<PageHero>` (serif, two-column) unless there is a ratified reason to vary.
- [ ] Colours and font sizes come from tokens. **No raw hex** outside `variables.css`; **no raw rem** for
      type — use `--fs-*`.
- [ ] Quieter text = opacity on `--text-color`, never a grey hex.
- [ ] Breakpoints come from the named set.
- [ ] New interactive/animated visuals honour `prefers-reduced-motion`.

Enforcement (stylelint rules that will fail CI on violation) is described in
[ADR-0003](../adr/0003-visual-language-system.md).
