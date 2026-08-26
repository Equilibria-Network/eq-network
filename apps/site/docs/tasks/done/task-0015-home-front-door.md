# Home as a front door (`/prototype`)

- Provenance: owner direction (2026-08-20) from the communications whiteboard session: replace the
  brochure home (hero + off-site publication cards + "Who This Matters To" services pitch) with a
  front door that routes visitors in the first screen.
- Links back to:
  [`task-0009-page-prototype-programme.md`](../open/task-0009-page-prototype-programme.md) (this was
  Home's P3 prototype);
  [`task-0014-research-areas-prototype.md`](../open/task-0014-research-areas-prototype.md) (the
  research-areas section derives from its content).
- Status: done — promoted to `/` on 2026-08-26 after owner approval of the third pass
- Owner: Claude session 2026-08-20
- Priority: now

## Decisions locked by the owner (2026-08-20)

1. **Structure: front door.** Hero, position strip, three doors (Think / Build / Run), an
   areas-at-a-glance strip, a Writing card grid, a derived papers shelf, a who/how-in strip. No
   audience columns: the "Who This Matters To" services pitch is cut, not moved.
   (2026-08-20, second pass: owner kept the blog cards and asked for more overview density on the
   first screen-fulls; the Writing grid is sourced from the Substack archive and the glance strip
   from the research-areas one-liners.)
2. **Tagline kept:** "Designing new forms of collective intelligence." The org is described as a
   research network, a decentralised organisation working to bring forth a new field, computational
   collective intelligence design.
3. **Stance: diagnostic, not rejectionist.** The position strip states the break with game theory as
   "the wrong foundation to build on" and the alternative as policies acting on information flows on
   a cybernetic foundation. The hard "we reject game theory" phrasing was considered and set aside:
   it collides with `/thesis` (which uses bad-equilibria language to diagnose) and the org name.
4. **Lorenz attractor stays** as the hero figure.
5. **No playground door.** The showcase is the Run door; the playground dials sit at the end of the
   showcase. `/playground` is not linked from the home.
6. **Research promoted** (same session): `/research` now renders the research-areas page; the old
   pipeline graph page is gone from the route (the `ResearchGraph` component remains on `/roadmap`).

## Second pass (owner direction 2026-08-21)

Owner review of the first pass: the hero was stretched (four-line display title, attractor shrunk to
340px), the position strip's game-theory claim was not useful on a home page, the Think / Build / Run
doors were not the main thing, the research-areas names ("how fast does a group settle, and when does
it ring") read as jargon outside a release note, and the page had almost no pictures. The ask: rework
from scratch as a **map of the site** that shows institutional legibility, keeps "Papers in motion",
and pulls more of what the thesis, roadmap and other pages already say.

Decisions taken in the rework:

1. **Hero = landing variant, figure-led.** `PageHeader` gained a bounded `asideWidth="half"` option
   (landing only): equal columns, title scaled to `clamp(2.5rem, 4.4vw, 4.4rem)`. The Lorenz frame
   fills its column at `clamp(420px, 72vh, 760px)` tall, which reproduces the legacy hero's figure
   size. `PageHeader` also gained an `after-copy` slot; the home uses it for an "On this page" index
   so the first screen routes the visitor.
2. **Position strip and doors cut.** Replaced by a **facts strip** (legal form, advisors'
   institutions, partner, latest venue, open code) directly under the hero.
3. **One section per part of the site, each borrowing that part's own content**: thesis (three beats
   from `explainerContent.steps`, by id), roadmap (five phases with the `/img/roadmap` portraits from
   `roadmapPhases`), CI Library (the four `labContent.pipeline` sketches plus showcase / dev roadmap /
   GitHub links), research areas (topic label derived from each area's eyebrow, the `oneLiner`, piece
   count; the question-style `name`s are not shown on the home), papers in motion (unchanged
   derivation), writing, people (team, advisors with affiliations, partners from `team.ts` /
   `about.ts`), closing.
4. **Writing grid no longer ragged.** `splitWriting()` puts the posts that carry an image in a 4-up
   card row and the rest in a compact dated list.
5. **Pure helpers in `home.ts`**: `splitWriting`, `phaseSummary` (tagline after the colon),
   `areaTopic` (eyebrow → plain topic label). No copy forked from other pages.

## Third pass (owner direction 2026-08-26)

Owner review of the second pass, walked top to bottom. Kept as they were: the hero and its
tagline, the roadmap phases, the CI Library section with its four numbered interface sketches,
the research areas and the Writing grid.

1. **Facts strip cut.** Legal form, partner, latest venue and code did not earn the first screen.
   The code link already lives under the library and in the closing. `FrontFact` and
   `homeFrontContent.facts` are removed.
2. **Thesis in the owner's words.** "Three of its beats" sampled from the scroll story is gone;
   `thesis.points` now carries three short points written for the home: loops spread (poisoned
   wells and cooperative clusters alike); start the positive loops early, so integrating AI agents
   into society at scale leaves positive environments behind; one language across disciplines
   (democratic decision-making, social choice, economics, mechanism design modelled from one
   perspective). The lead sentence is "to understand how a system works, you have to understand how
   it cooperates at larger scales". The `stepIds` field and the `explainerContent` import are gone.
3. **Library links cut to one line each.** Showcase: "A basic toy model of gradual disempowerment."
   Dev roadmap: "Where we are going next." GitHub: just the link.
4. **People: photographs, no partners, no public record.** Team and advisors render the about
   prototype's `prototypeImage` (falling back to `image`), so Aaron Halpern appears in his
   photograph rather than the sketch; the plates are grayscale like the about prototype and cut
   4:5 like the roadmap portraits, and each links to `/about`. Partners and the `/legal` link are
   cut from the home (they stay on `/about`). `partnersLabel` and `recordLink` are removed from the
   contract.
5. **Closing is an invitation to collaborate**: system dynamics or agent-based models for better
   policy proposals, or the foundations of the science; write to us. It gains `id="collaborate"`
   (the footer already owns `#contact`) and an entry in the hero's in-page index.
6. **Papers in motion cut** (same session, follow-up). Too few public pieces yet for a shelf on the
   home; the papers stay on `/research` under each area. `latest` leaves the contract and the
   `latestPieces` helper is removed with it.

Open question for the owner: the people section links to the canonical `/about`. If the about
prototype (`/about/prototype`, photographs throughout) is promoted first, nothing changes; if the
home is promoted first, the link lands on the sketch version until then.

## What was built

| Piece                                                      | Where                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| Typed contract + copy (`HomeFrontContent`, `latestPieces`) | `src/content/home.ts` (appended; legacy content untouched) |
| Sections below the hero (thesis … people, closing)         | `src/components/home-front/FrontDoor.astro`                |
| Route (canonical `/`; `/prototype` redirects to it)        | `src/pages/index.astro`                                    |

- The hero reuses the shared `PageHeader` (editorial variant) with the existing `LorenzAttractor`
  island in its `visual` slot. No fork of the header.
- Door sublabels import each destination page's own header copy (thesis, research areas, roadmap,
  library explanation, dev roadmap, showcase), so home and destination cannot drift apart.
- The papers shelf is `latestPieces(take, 'paper')`: a pure function over the research-areas
  pieces (statuses published / accepted / working paper, papers only so the Writing grid owns the
  posts, newest first, five shown, status tags reused from the research-areas UI labels).
- The Writing grid (`homeFrontContent.writing`) lists the nine Substack-archive posts with their
  subtitles; the four cards that had images on the old home keep them, and the two pieces that
  deliberately linked to LessWrong keep those links. This list is hand-curated by design (it tracks
  the Substack, which the repo cannot see at build time).

## Owner review checklist (before promotion)

- [ ] Hero, position strip, and who-strip copy.
- [ ] Door membership and order.
- [ ] Desktop and narrow width, reduced motion, keyboard.
- [x] Promotion (2026-08-26): the front-door composition is `/`, `/prototype` redirects to it, and
      the legacy `Hero`/`Publications`/`Audience` islands and `homeContent` fields are removed.

## Follow-ups (not in this task)

- Research-areas copy rewrite (tracked in task-0014): one sentence per beat, quotes sampled from the
  papers. The Latest shelf inherits any copy fix automatically.
- Nav: decide whether `Research` returns to the top nav now that `/research` is the promoted page.
- The thesis closing links still point at `/playground/`; owner direction here says the playground
  is reached through the showcase. Reconcile when the thesis closing is next edited.
