# Research areas as scroll stories (`/research/prototype`)

- Provenance: owner direction (2026-08-16): "turn the projects into pages that explain a
  research area as work in progress, in the style of the CI Library showcase and the explainer",
  folding in the older draft PDFs already hosted under `/pdfs/`.
- Links back to: [`task-0009-page-prototype-programme.md`](task-0009-page-prototype-programme.md)
  (this is the Research page's prototype); the canonical `/research` pipeline graph is unchanged.
- Status: open, prototype built (2026-08-16) — awaiting owner copy review and membership pruning
- Owner: Claude session 2026-08-16
- Priority: now

## What was built

`/research/prototype` (noindex; sitemap-excluded by the `/prototype` filter). One page, four
areas, each in the showcase's shape:

1. chapter head (eyebrow, question-as-title, two intro paragraphs);
2. a `VisualEssay` with four beats: **the question → why it matters → how it looks → what is
   open**; the figure column redraws per beat;
3. a shelf of the area's pieces, each with a status tag (`published / accepted / working paper /
draft / in progress / notes`), kind, year, venue, one sentence for what it asks, one for the
   setup, and a link where a public copy exists.

An index strip at the top links to the four areas; a closing block points at the library
explainer, the showcase, the newsletter, and About.

| Piece                                                          | Where                                                                                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Typed contract                                                 | `src/content/research-areas/types.ts`                                                                                       |
| Copy + figure labels, one file per area, page content in index | `src/content/research-areas/{collective-agency,dynamics,governance,infrastructure,index}.ts`                                |
| Page component (index strip, chapter heads, shelves, closing)  | `src/components/research-areas/ResearchAreasStory.tsx`                                                                      |
| Figures (four, hand-laid, per-beat scenes, legend row inside)  | `src/components/research-areas/AreaFigure.tsx` on `figurePrimitives.tsx` (reuses `notebookDrawing` outlines + connectorInk) |
| Route                                                          | `src/pages/research/prototype.astro`                                                                                        |

The four areas and their questions:

1. **Collective agency** — When do many become one?
2. **Collective dynamics** — How fast does a group settle, and when does it ring?
3. **Adaptive institutions** — Who absorbs the shocks?
4. **Simulation infrastructure** — One population, composable institutions.

## Rules the copy follows

- Setups, not results. No piece description restates a number or a headline finding
  (`CLAUDE.md` "Don't overclaim results"). Placeholder-figure drafts are tagged _in progress_ and
  say so in their setup line.
- No author names on the page except where the venue already publishes them; group drafts are
  listed by title only.
- Short sentences, plain words, no em dashes (owner direction, Aug 7).
- Nothing was newly published: every link points at a PDF or post that was already public
  (`/pdfs/*`, Substack, LessWrong, GitHub, Scholar). Drafts with no public copy have no link and
  read "Not yet public".

## Owner review checklist (before promotion)

- [ ] Area names and the four questions — rename freely; the ids stay.
- [ ] Membership: which pieces stay, move between areas, or come off. Candidates to reconsider
      (flags from the source scan): _A Natural History of Agency_, _A Spectral Model of Collective
      Active Inference_, _A Model of Predictive Governance_, _Procedural Alignment_ (unresolved
      citation marks in the hosted PDFs); _Scalar Properties of Agency_ (self-labelled experimental
      section); _Improving High Output Management through Predictions_ (page 1 states a headline
      figure); _Adaptive Institutions_ (working-group draft — the group has not OK'd a public
      listing); _Collective Agent Foundations_ (co-authored, in progress).
- [ ] Figures at desktop and narrow width, reduced motion, keyboard (DIAGRAMS.md verification list).
- [ ] Decide the promotion path: replace `/research` with this, or mount as `/research/areas`
      alongside the pipeline graph.

## Follow-ups (not in this task)

- Per-area routes (`/research/<area>`) if the single stacked page proves too long. The content
  files are already one-per-area, so this is a routing change only.
- A `PieceStatus` → venue-system sync so status tags do not drift from the vault's paper table.
