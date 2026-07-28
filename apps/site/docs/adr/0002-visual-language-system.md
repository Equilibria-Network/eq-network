# ADR-0002: A shared design system (tokens + reusable components + a checker)

- Status: Accepted (2026-07-28)
- Date: 2026-07-28

## The problem, in plain terms

The site has a real visual language, but it is not stored anywhere reusable — it is copy-pasted. Concretely:

- The brand navy `#003B7E` is typed by hand in ~23 CSS files. Changing the brand means editing 23 places.
  The grey shades, spacing, and font sizes are the same story.
- Each page re-writes its own "section header", "card", and "hero" from scratch, so they have drifted
  apart. Newer pages (lab, explainer, roadmap) look noticeably different from the home page.
- There is no automated check, so nothing stops the next page from drifting further.

## What this ADR proposes

Adopt a lightweight **design system** — the foundation that makes a consistent UI/UX redesign possible and
keeps it from drifting again. Three parts:

1. **Tokens** — define each colour, font size, spacing step, radius, and breakpoint **once**, with a name
   (e.g. `--color-primary`), in `variables.css`. Every file refers to the name instead of a raw value.
2. **Reusable components** — a small set of shared building blocks (`SectionHeader`, `Card`, `PageHero`,
   `Section`) so every page is assembled from the same pieces instead of reinventing them.
3. **An automatic checker (stylelint in CI)** — rejects a change that types a raw colour or an off-scale
   size instead of using a token, with a clear message. This is what makes the design system
   **enforceable by agents**: drift fails the build instead of slipping through review.

This is deliberately **lightweight** — no Tailwind, no CSS-in-JS, no design-system package. It extends the
CSS-Modules approach the site already uses, which is right for a static marketing site.

## How this relates to the actual redesign

**This ADR is the foundation, not the redesign.** The goal is to improve the UI/UX of the whole site. That
happens in two stages, deliberately kept separate (a refactoring-safety principle — do not mix a structural
change with a visual change, or you cannot tell which one caused a regression):

- **Stage 1 (this ADR):** introduce the tokens and shared components **without changing how anything looks**
  (a pixel-identical, low-risk, reversible refactor). This is pure plumbing.
- **Stage 2 (per-page redesign):** with the foundation in place, actually upgrade the look and feel,
  **one page at a time**, each as its own sub-task with its own before/after. See
  [`../tasks/open/task-0002-visual-language-alignment.md`](../tasks/open/task-0002-visual-language-alignment.md).

The token/component contract is documented in [`../context/10-visual-language.md`](../context/10-visual-language.md).

## Consequences

- **Enables:** change the brand in one place; a consistent redesign built on shared pieces; a lighter CSS
  payload; and drift caught mechanically, by agents, instead of by manual review.
- **Cost:** the Stage-1 refactor is real work (though mostly mechanical). The redesign decisions are Stage 2.

## Revisit when

The site outgrows CSS Modules (a genuinely large component library, or a second product surface). Not before.

## Sources

[`../context/10-visual-language.md`](../context/10-visual-language.md);
[audit-0002](../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md) (M1, M4, M8, M9, B8).
