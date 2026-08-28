# Simulation standards as a page (`/library/standards`)

- Provenance: owner request (2026-08-24, PIBBSS retreat): the simulation standard should live where it
  can be shared, on the website, told in the scroll-story format, with the requirements readable on the
  page. Owner direction 2026-08-26: call it "Standards", frame it as "our simulation standards", and use
  established terminology (validation level, robustness analysis, basin stability, reference frame,
  parameter provenance, pre-registration, model documentation in the spirit of the ODD protocol).
  The canonical text is `STANDARDS.md` in the Collective Intelligence Library repository; the page is
  the argument for it.
- Links back to: [`task-0009-page-prototype-programme.md`](task-0009-page-prototype-programme.md)
  (shared contracts); [`task-0014-research-areas-prototype.md`](task-0014-research-areas-prototype.md)
  (the page reuses its shell, drawing primitives, and page chrome);
  [`../../../../../DIAGRAMS.md`](../../../../../DIAGRAMS.md).
- Status: in-progress, second build (2026-08-26), awaiting owner review
- Owner: Claude session 2026-08-26
- Priority: now

## Problem

The library's simulation standard existed only as a draft document in the library repository and as a
paper in preparation. Neither is shareable as a link that explains itself. The site is the front door;
a reader arriving from a conversation should be able to see why the standard exists, what a reported
result has to include, and where to comment on it, in one scroll.

## Done when

`/library/standards` renders the seven-step story with its figure, the ten reporting requirements, the
five validation levels, and the closing links; it is in the CI Library nav; `pnpm build` is green; the
owner has read the copy and approved it.

## What was built

- `src/content/standards.ts`: all copy and figure labels, typed (`StandardsPageContent`). Seven steps
  keyed on `StandardsStepState`; captions, annotations, and a legend per scene; the ten requirements;
  the validation levels; the closing links.
- `src/components/standards/StandardsFigure.tsx`: one figure, seven scenes, drawn with the
  research-areas primitives (`figurePrimitives.tsx`) so the two pages share one drawing style. Legend
  per scene, title and description on the SVG, no dependence on page copy.
- `src/components/standards/StandardsStory.tsx`: chapter head, `VisualEssay` (`anchorPrefix="story"`),
  the requirements as a numbered list, the validation levels, closing. Page chrome classes (`column`,
  `rule`, `chapterHead`, `closing`, `linkGrid`) and the drawing classes come from
  `research-areas.module.css`; only the two list layouts are page-local (`standards.module.css`).
- `src/pages/library/standards.astro`: `Layout` + `PageHeader` + the story, same font imports as the
  research page.
- `src/content/site.ts`: nav child "Standards" under CI Library, between Explanation and Dev Roadmap.

## Decisions taken without the owner (reversible)

1. **Canonical route, no prototype twin.** This is a new page requested by the owner, not a redesign of
   an existing one, so it was built at its canonical route and put in the nav. A
   `/library/standards/prototype` twin is a two-line page if the programme wants one.
2. **Page chrome and drawing primitives are imported from the research-areas module** instead of being
   extracted to a shared place. The guide asks for extraction once a second page proves the need; this
   is that second page. Follow-up: move `figurePrimitives.tsx` and the `column`/`rule`/`chapterHead`/
   `closing` classes to a shared story module and have both pages import it.
3. **The closing link points at the repository root**, not at `STANDARDS.md` directly, because the file
   is not yet committed there. Update the href once it lands.
4. **Validation levels are shown as L0 to L4.** The internal documents and test names use R0 to R4 for
   the same scale; the mapping is one-to-one and noted in `STANDARDS.md`.
5. **No personal names on the page.** The paper is "a paper in preparation"; the one named person is
   Elinor Ostrom, as a reference.

## Verification

- `pnpm --filter @eq-network/site test`: fixture validation and contract tests.
- `pnpm --filter @eq-network/site build`: `astro check` then a static build.
- Headless-Chrome screenshots over the DevTools protocol (2026-08-26), desktop 1440×1000: all seven
  scenes, the requirements, the levels, and the closing render; browser console clean. The first build
  had five figure defects (two labels clipped at the view-box edge, the mechanism label overflowing its
  square, the outcome label crossing the curve in two scenes); all fixed and re-shot clean. Mobile
  390×844: the essay stacks figure-over-text as the research page does; legend text is small at that
  width, same as the research page. Re-shot after the terminology pass.
- Still to do by a human: keyboard scroll to each `#story-N` anchor, reduced motion, and a read of the copy.

## Notes

- Copy voice: plain sentences, established terms, no numbers from experiments, setups not results.
- The research-areas index/shelf pattern was not reused; this page has one story, not four.
