# ADR-0009: Separate page SEO metadata from human-facing headers

- Status: Accepted
- Date: 2026-07-29

## Context

The site needs coherent visible introductions without forcing search-result copy to equal the on-page
heading. Search titles and descriptions benefit from explicit subjects and keywords; people arriving on
the page benefit from a concise subtitle and a plain-language takeaway. Page-by-page markup would make both
systems drift as more prototypes are promoted.

## Decision

Redesigned pages use two shared typed contracts:

- `PageSeo` owns the HTML title, meta description, canonical path, social image metadata, indexability,
  optional keywords, and optional article dates.
- `PageHeaderContent` owns the eyebrow, visible title, subtitle, one- or two-sentence summary, and
  optional interaction prompt.

`Layout` renders `PageSeo`; `PageHeader` renders `PageHeaderContent`. A page may use different wording in
the two contracts deliberately. Repeated presentation patterns should become typed shared components at
the second real consumer, with bounded customization through props, content, or slots.

## Consequences

- Search copy can be tested and refined without rewriting the visible page introduction.
- Header semantics and visual hierarchy remain consistent across editorial and landing pages.
- Content remains explicit and statically inspectable; no SEO framework or runtime service is added.
- Legacy pages may migrate incrementally as their prototypes are redesigned.

## Compliance

- New or redesigned page content exposes `seo` and `header` fields using the shared types.
- Routes pass `seo` to `Layout` and header content to `PageHeader`.
- Prototype routes set `noindex` through `PageSeo`.
- `pnpm check` validates contract consumers.
