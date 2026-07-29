# ADR-0008: Share editorial and landing variants of the page header

- Status: Accepted
- Date: 2026-07-29
- Amends: [ADR-0007](0007-visual-essay-system.md) (the visual-essay introduction only)

## Context

The first shared `PageHeader` made Legal, Privacy, About, and Products consistent, but the visual-essay
shell still owned a separate full-viewport introduction. Promoting the Thesis prototype exposed the drift:
the same eyebrow, title, description, reference, status, and date concepts had different markup and
spacing depending on the page family.

The owner requested one reusable header contract with two presentations: a compact editorial header and a
full-viewport landing header. Content below the header remains free to vary.

## Decision

`PageHeader.astro` owns both presentations through an explicit `variant`:

- `editorial` is the default for ordinary content and policy pages.
- `landing` fills the viewport below the navigation bar and presents the title beside supporting copy,
  prompt, optional visual, and metadata.

Both variants consume the same `PageHeaderContent` properties: eyebrow, title, subtitle, short
summary, and optional prompt. Visual essays no longer have to render their own hero; `VisualEssay`
accepts `showHeader={false}` when its route composes the shared landing header.

Page-specific full-viewport experiences may intentionally use a different component only when their
interaction begins inside the first viewport and cannot fit the page-header contract.

## Consequences

- Typography, spacing, metadata, and the top-bar-to-header transition change in one place.
- A visual essay keeps ownership of sticky reading behavior and its renderer, but not general page chrome.
- The route owns the single `<h1>` and composes static page chrome around the interactive island.
- Adding presentation flags for one page is discouraged. A new variant requires a second real consumer or
  a documented interaction constraint.

## Compliance

- Standard page routes import `PageHeader.astro`.
- Full-viewport headers use `variant="landing"` instead of recreating the visual-essay hero markup.
- `pnpm check` type-checks all header consumers.
