# "AI-assisted page" tag on AI-drafted pages

- Provenance: owner request (2026-08-26): a small tag on pages whose text was partly or mainly written
  by an AI model, with a hover note that says so; wanted on Showcase, Explanation, Standards, and the Dev
  Roadmap.
- Links back to: [`../../adr/0004-i18n-readiness.md`](../../adr/0004-i18n-readiness.md) (strings in
  content); the canonical tooltip specimen on `/brand/prototype`.
- Status: in-progress, first build (2026-08-26), awaiting owner review
- Owner: Claude session 2026-08-26
- Priority: now

## Problem

Several public pages are drafted by an AI model from the team's instructions and material. Readers
should be able to see that at a glance and learn what it means without leaving the page.

## Done when

The four pages show the tag under their header copy; hover and keyboard focus reveal the note; the note
is readable by assistive technology; `pnpm build` is green; the owner has confirmed the level set on
each page.

## What was built

- `src/content/authorship.ts`: the tag label, its accessible name, and one note per level
  (`partly`, `mainly`). No model is named; add one there if the team wants to.
- `src/components/layout/AuthorshipTag.astro`: a pill button ("AI-assisted text") with a
  `role="tooltip"` note linked by `aria-describedby`; revealed on `:hover` / `:focus-within`, no JS,
  reduced-motion safe. Styled after the brand prototype's tooltip specimen (ink on paper inverted,
  mono, short). Owner direction 2026-08-26 (second pass): pinned to the top-right corner of the header
  so it is seen first, label says "text" rather than "page", note cut to two short sentences.
- `src/components/layout/TaggedHeader.astro`: a relative wrapper that takes the page header as its
  slot and pins the tag to its top-right, aligned with the header's content column. A wrapper rather
  than a header prop, so `PageHeader.astro` (being edited in another session) stays untouched:
  - `/showcase` → `partly`
  - `/library/explanation` → `mainly`
  - `/library/standards` → `mainly`
  - `/library/roadmap` → `mainly` (the slot is passed inside `PipelinePrototype.astro`, which owns that
    page's header)

## Decisions taken without the owner (reversible)

1. **Levels are a guess except two.** The owner said the showcase is "not as much" (→ `partly`) and the
   standards page was drafted in this session (→ `mainly`). Explanation and Dev Roadmap are set to
   `mainly` pending the owner's word; each is a one-word change in the page file.
2. **The research roadmap at `/roadmap` is not tagged.** "Roadmap" in the request was read as the CI
   Library Dev Roadmap, which sits with the other three in the nav. Adding it is one line in
   `roadmap.astro` if the `Roadmap` component gains a header slot.
3. **Wording says "an AI language model", not a product name.** The note also states that the team
   directs, edits, and is responsible for what is published.

## Verification

- `pnpm --filter @eq-network/site build` (type-check and static build).
- Headless-Chrome screenshots (2026-08-26) of the tag at rest and with the note open (focus via
  script) on all four pages: renders and opens on each. Side observation, not caused by this change:
  `/library/explanation` throws React error #418 (a hydration mismatch) in the `LibraryExplainer`
  island; the untagged twin `/library/prototype` throws the same, so it predates the tag. Worth its own
  task.
- Still to do by a human: hover on a real pointer, VoiceOver/NVDA read of the button and note.
