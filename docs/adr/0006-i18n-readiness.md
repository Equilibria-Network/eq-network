# ADR-0006: i18n readiness now, i18n runtime deferred

- Status: Accepted
- Date: 2026-07-28

## Context

The site is currently English-only and 100% of readers are English-speaking. There is no near-term need
for multiple languages. The owner is nonetheless considering a full internationalisation (i18n) system
eventually, for scalability, in which no user-facing copy is hardcoded in components and all "language"
lives in proper content/language files.

"i18n" conflates two separable concerns:

1. **String externalisation** — no user-facing string literal in a component; all copy lives in typed
   files under `src/content/`. This is a maintainability property the codebase already mostly has
   ("Content is data, not markup" is Principle #1 in `CONTRIBUTING.md`), with a few stragglers (section
   headings, the footer tagline, `404.astro` copy, scattered labels/alt text).
2. **The locale runtime** — locale-prefixed routes (`/en/`, `/de/`), message catalogs with
   interpolation/pluralisation, a locale switcher, per-locale `<html lang>` and Open Graph tags, and a
   fallback chain. Astro has built-in i18n routing (since 3.5), but the React islands would still need
   translated strings threaded as props or a client i18n library.

Externalisation is a prerequisite for the runtime, but it is also valuable on its own as hygiene.
Building the runtime now would be speculative infrastructure for zero non-English readers.

## Decision

Split the two concerns and act on only the cheap half now:

- **Adopt string externalisation as an enforceable invariant now:** no user-facing string literal in a
  component, page, or layout; all copy lives in `src/content/`. This is folded into the current pristine
  baseline as the expanded M6 sweep (see
  [`../tasks/open/task-0001-pristine-baseline.md`](../tasks/open/task-0001-pristine-baseline.md)).
- **Defer the i18n runtime.** Do not add locale routing, message catalogs, a locale switcher, or restructure
  `src/content/*.ts` into a locale-keyed shape until there is a real second locale. The eventual runtime is
  tracked as [`../tasks/deferred/task-0007-i18n.md`](../tasks/deferred/task-0007-i18n.md) and will get its
  own decision (this ADR, updated, or a successor) when that day comes.

The distinguishing principle: **preserve optionality cheaply (never hardcode a string) without building
the machinery speculatively (no locale runtime now).** The discipline is nearly free; the machinery is
expensive and hard to justify at the current scale.

## Consequences

- **Enables:** cleaner separation of copy from code immediately; an eventual i18n pass becomes "add a locale
  layer over an already-clean content tree" instead of a codebase-wide string hunt.
- **Constrains:** contributors must route new user-facing copy through `src/content/` rather than inlining
  it. This matches the existing convention, so the marginal cost is small.
- **Cost:** a one-time externalisation sweep of the current stragglers (the expanded M6). No runtime cost,
  no new dependency, no routing change.
- **Explicitly not done:** the content files keep their current single-locale shape; reshaping them into a
  locale dimension is part of the deferred runtime work, not this decision.

## Revisit when

A second target language is actually needed (a real reader base, a partner requirement, or an org decision
to publish in another language). At that point, decide the runtime: Astro's built-in i18n routing vs a
library, catalog format, and how React islands receive translations.

## Sources

`CONTRIBUTING.md` §2 (Principle: "Content is data, not markup"); the codebase pattern of typed copy under
`apps/site/src/content/`; Astro i18n routing (built-in since Astro 3.5, present in this project's Astro
4.16). Externalisation stragglers catalogued in the expanded M6 of task-0001.
