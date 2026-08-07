# The showcase as a scroll story

- Provenance: owner direction (Jonas, 2026-08-06, relaying reader feedback from Markov on the
  2026-08-05 showcase). The feedback: in the style of AI 2027, the page should be one scroll —
  the reader clicks nothing until the end. The owner's arc: confusion first, then the
  individual models, then the combined model with its influence diagrams, then the
  building-blocks-and-forking close. **v2 same day, owner correction on review of v1:** the
  v1 lede — "decompose into three simple machines and a diagram makes the complexity easy to
  see" — was misleading and too cheap an "oh wow". Modeling each part simply in isolation is
  what already exists and fails; the whitepaper (`cilib-whitepaper.tex`) carries the real
  story of why this complexity is approachable, and the page's job is to compress that story
  well, not to substitute a simpler one. This doc is rewritten against the whitepaper's
  argument. It supersedes the 2026-08-05 chapter order for the scroll prototype; the
  canonical `/showcase` stays unchanged until promotion. **v3 same day, owner direction on
  reviewing the P1 build: the page was far too long — cut to roughly a third.** The shipped
  flow is now: confusion (2 steps) → the basic version of each model as one slide each
  (baseline / amplified / captured) → the combined model (sealed, coupled, influence-diagram
  slot) → the building-blocks-and-forking prose → the playable ending. Nine essay steps
  total, and the contract test pins the budget (≤ 10) and the one-slide-per-machine shape.
  The one-shape act is gone as a section; its load-bearing sentence ("written as one kind of
  object, three small models can share one world") lives inside the promise step's copy. The
  per-machine assumption interludes are dropped from the prototype — the stated-plainly
  cards stay canonical on `/showcase` and reachable from the playable ending's links. The
  five-act section below is kept as the record of the fuller arc; the v3 flow is the one
  that ships. Precompute after the cut: 6 unique runs, ~390 ms headless, 2.8 MB retained.
- Links back to: [`task-0006-showcase-page.md`](task-0006-showcase-page.md) (the page being
  reworked), the whitepaper tex in the vault (the argument being compressed), `DIAGRAMS.md`
  at repo root (the diagram grammar), `apps/site/src/components/visual-essay/VisualEssay.tsx`
  (the scrollytelling engine the house rule says to reuse).
- Status: **promoted** (owner direction 2026-08-07): the scroll page is the canonical
  `/showcase`; `/showcase/prototype` mounts the same component
  (`apps/site/src/components/showcase/ShowcaseScroll.tsx`). Both stay noindex — the nav
  entry and index decision remain open owner calls (as in task-0006). Shipped alongside
  promotion: the four papers hosted at `/pdfs/` (wp1/wp2/wp3 + the CI Library whitepaper,
  copied from the vault's current builds, tex-vs-pdf freshness checked) and linked as
  cards in the playable ending, replacing the generic `/research` card. Follow-ups: the
  old chapter-based `ShowcaseApp` is no longer mounted anywhere (removal is an owner
  call), and `test/showcase-smoke.mjs` still journeys the old chapter structure — it
  needs rewriting against the scroll page before it is trusted again. Added on owner
  direction (2026-08-07, revised same day): the scoreboard as the closing section,
  AFTER the playable ending — the /lab Leaderboard component with the showcase's own
  typed board (`content/showcase-leaderboard.ts`): columns are only this page's GD
  scenarios (Money / Attention / Votes / Coupled — no Commons), rows are defense
  PORTFOLIOS (compositions of mechanisms, the benchmark's real unit) including rival
  versions (v1/v2), so the board reads as "the best score so far, per scenario" and
  the fork-as-iteration story lands visually. Illustrative badge intact; the contract
  test pins the placement, the word "illustrative", and the portfolio framing. The
  Leaderboard component gained two backward-compatible props (light scenario list,
  first-column header); /lab unchanged.
- Owner: unassigned
- Priority: now

## Problem

Two problems, one page. Form: the showcase's beats live behind clickable tabs and a transport,
so a cold reader must make roughly fourteen decisions to see the argument, and each one is an
exit. AI 2027 demonstrates the alternative — one scroll, visual state synchronized to reading
position, interaction offered only at the end. Framing: the current page (and v1 of this plan)
lets the reader conclude that the method is "model each part simply, then wire them together"
— which is indistinguishable from ordinary modular modeling and misstates the contribution.
The whitepaper's actual argument for why coupled societal dynamics are approachable is a
four-link chain, and the scroll page must compress that chain without dropping links.

## The lede, stated before the acts

What the page must leave in a reader's head, in order of importance:

1. **The obstacle is deeper than "many arrows."** Markets, information networks, and
   democratic institutions are studied by different fields whose formalisms do not compose.
   You cannot staple an economics model to a media model to a voting theorem and get a model
   of the whole. That — not just nonlinearity — is why nobody can think through the coupled
   scenario.
2. **The way in is a representational observation, not a simplification.** Nearly every
   dynamic on a population fills the same equation shape: something flows over a relation,
   arrivals combine, each node updates. A market, a listening network, and a polity differ in
   how they fill three slots — what flows, how arrivals combine, what the receiver does. The
   claim is deliberately *not* that these fields are secretly the same; they answer different
   questions. The claim is that one framework can host all of them on one population at one
   time — which is the precondition for even asking how they push on each other.
3. **Coupling is then bookkeeping, and the diagram is compiled, not drawn.** Because domains
   are layers over the same actors, "money buys attention" is one function reading the wealth
   ledger and writing the listening relation — no new machinery. Because every function
   declares what it reads and writes, the influence diagram is emitted from those
   declarations, the same way the execution order is. The picture is a receipt of the model,
   not an illustration of it.
4. **Nothing is believed on sight.** Each model must reproduce a classical result before its
   twist is trusted; each must have an honest parameter region where the failure does *not*
   occur; a claim that exists in only one model is a property of that model, not of
   economies. Disagreement is the intended interaction, and a fork produces a commensurable
   scorecard row rather than an argument.

The "oh wow" is layered across those four, in that order, and the reader's ability to read
the final diagram is the *payoff* of the compression — evidence it worked — never the claim
itself.

## The story — five acts

The spine remains one picture shown twice: the page opens on the coupled world rendered
illegible and closes on the same run and the same diagram, now readable. What changed from v1
is what happens in between: the reader doesn't get there by "three simple machines" but by
walking the four-link chain.

### Act I — The wall

1. Cold open. The combined-world collapse run at full speed: every packet lane on, no legend,
   no labels. Over it, two or three sentences of scenario prose in the AI 2027 register — an
   economy that runs without workers, a debate steered by machine voices, institutions
   answering to whoever funds them.
2. Freeze. The motion stops into the full influence diagram in deliberately unhelpful layout.
   Could you say why that run ended the way it did? Neither could we, from watching.
3. The wall itself, named precisely: the parts of this world belong to three different
   sciences, and their formalisms do not compose. Small pushes compound across systems in
   loops no single field's model contains. Is there really a way to tame this?
4. The honest promise: there is one observation this entire page rests on, and it takes a
   minute to state. No "it's simple, really" — the promise is that the complicated story
   compresses, not that it was simple all along.

### Act II — One shape (the move)

Two to three steps; this act is the lede and earns everything after it.

1. The equation, as a notebook figure: a population, a relation, something flowing; three
   slots annotated by hand — what flows, how arrivals combine, what the receiver does.
   Display math in the house handwritten register per DIAGRAMS.md.
2. The three fillings, one figure: money over market access, combining by sum, updating by
   price; attention over listening, combining by pooling, updating toward the pool; votes
   over delegation, combining by conservation, updating by the median. Different sciences,
   one shape.
3. The precision beat, verbatim discipline from the whitepaper: not secretly the same —
   these fields answer different questions. The point is that one framework can host all
   three on one population at one time. That is the precondition for asking the only
   question this page cares about: what happens when they push on each other?

### Act III — Three instances, each earning its trust

Order: money, then attention, then votes — each section handing off along the coupling edge
the reader will later watch light up (money can buy an audience; an audience attracts votes;
votes rewrite the rules money answers to). Within each machine section:

- One diagram step: the machine's loop drawn alone in the DIAGRAMS.md grammar, introduced as
  an instance of the Act II shape — the slots called out. Minimap highlights the region.
- Two to three run steps promoted from the existing tabs, with one reframing that carries
  the epistemics: the existing "below threshold" / "organic polity" / "no amplification"
  beats are not warm-up pedagogy — they are the validation discipline made visible. A model
  that can only produce the failure proves nothing; this run is the honest region where the
  dynamic does not occur, and the model earns its collapse regime by having it.
- One stated-plainly card as a full-width interlude: assumptions, the In/Out line, the
  classical anchor it reproduces, the WP source. The existing line "each subsystem uses the
  simplest mechanism that can carry its question — so that the coupling stays the object of
  study" survives verbatim; it is the correct statement of why the pieces are small, and it
  attributes the simplicity to a choice, not to the world.
- One prospective bridge: the outgoing coupling edge drawn dashed and unconnected.

### Act IV — Composition

1. Coupling as bookkeeping. The three loops slide together over one shared population; the
   coupling edges ink in one at a time, each named as what it is: a function that reads one
   layer and writes another. "Economic power buys persuasion" is an ordinary step. Nothing
   new was invented to couple the world — that is the Act II observation paying out.
2. The one rule: crossings are spending. Money is conserved and is the only thing that
   crosses; a sealed channel is exactly zero. The flywheel assembles from conservation plus
   allocation, not from authored arrows.
3. The runs, as scroll steps: sealed → coupled → citizens → collapse, existing preset order
   and existing beat copy.
4. The compiled diagram. The full influence diagram, final form — and the reveal that
   matters: this picture was not drawn. Every function declares what it reads and writes;
   the diagram is emitted from those declarations, the same way the engine derives its
   execution order. Flow edges solid, modulation edges dashed, legend in-figure.
5. The callback: the cold-open frame beside the final diagram. Same picture, second time.
   You can read it now — not because it got simpler, but because you now hold the shape it
   was compiled from.
6. One measurement step, concept not result: how would you even know, from inside, that a
   world like this is failing? The instrument the machinery exists for — perturb what people
   want, replay the same world under identical randomness, watch whether outcomes move. The
   gradual-disempowerment signature is influence-now going to zero while influence-from-birth
   still looks fine: the system responds to who you were, not to who you are. Stated as what
   the library measures, with no number attached — the coupled sweep that would produce one
   is explicitly not yet run, and the step says so.

### Act V — The discipline, then the keys

1. When a number from a toy world may be believed: the model reproduced a result you already
   trust before its twist was added; it has an honest region where the failure does not
   occur; and a claim that exists in only one model is a property of that model — so claims
   must survive being rebuilt on structurally different substrates before they travel.
2. Disagreement is the intended interaction. Every box on the diagram is a small function
   with a declared interface; whether a stranger's replacement composes is decided
   mechanically, before anything runs; and a fork produces a commensurable scorecard row on
   the same seeds, rather than an argument. The unit of contribution is a defense; the unit
   of disagreement is a fork; both have a mechanical acceptance test rather than a
   gatekeeper.
3. The playable ending: the existing `PlaygroundLite`, unchanged — the first and only
   element the reader must touch. Everything until now, you watched; this is where you
   disagree. Closing links: playground, papers, library repo.

## The diagram track

- **Grammar:** `DIAGRAMS.md` governs — shape is role, fill is state, the approved connector
  token, self-contained in-figure legends. The stock-flow-modulation vocabulary extension
  gets recorded in DIAGRAMS.md when the first figure is approved.
- **Storyboard in Excalidraw first,** per DIAGRAMS.md's own workflow. The storyboard decides
  the altitude: reader-facing diagrams live at stocks-actors-channels altitude, not the
  fields-and-transforms altitude of the pasted `*_SYSTEM` fixtures.
- **"Compiled, not drawn" must be true, not rhetorical.** Act IV step 4 makes a claim the
  build must honor: the typed diagram data derives from the engine's `system_graph()`
  fixtures (aggregated to reader altitude), every edge names the transform(s) it summarizes,
  and a test asserts the names exist in the pasted fixture and that edge type matches ledger
  metadata (write-to-ledger-field = flow, write-to-rate-field = modulation). Layout is
  authored; content is not. A figure that cannot pass this check does not ship, and if the
  aggregation step turns out to require editorial judgment beyond layout, the page's claim
  weakens to "derived from the model's declared effects" — wording follows the build, not
  the other way around.
- **One geometry, four uses:** hairball (Act I), per-machine subgraphs (Act III), assembled
  final form (Act IV), corner minimap — all from the same typed data.

## Mechanics — how "no clicks" cashes out

- Scroll selects state; time animates itself. Entering a step restages its preset, cuts to
  its tick, and autoplays — the existing beat machinery retriggered by the VisualEssay
  activation line instead of tab clicks. No scroll-scrubbed playback.
- All preset trajectories the page needs precompute at load and cache, so scrolling never
  waits. P1 measures the cost on mobile before P2 builds on it.
- The transport disappears from the essay body; a skip-to-playable affordance in the header
  is allowed. `prefers-reduced-motion` shows each step's final frame.
- Composition: stacked `VisualEssay` segments (one per act, roughly) with the stated-plainly
  cards as full-width interludes between them; steps need multi-paragraph support.
  Alternative — one mega-essay with interludes taught to VisualEssay — is more surgery for
  no reader-visible gain. Recommendation: stacked segments.
- Home decision needed at P1: `VisualEssay` lives in `apps/site`, the showcase in
  `apps/playground` — lift it to a shared package, or mount the essay site-side and pass the
  playground stage in as the `Visual`.

## What this is not

Checked against the library repo's `docs/gd-game-postmortem.md`: not a game, and it reopens
neither dead route. No branch tree, no endpoint, no live levers beyond the already-shipped
`PlaygroundLite`; the reader watches until the end. The single engine-repo item is the
diagram-fixture decision above (aggregate `system_graph()` output to reader altitude —
exporter or checked hand-aggregation), which is a fixture question, not a capability.

## Phasing

- **P0 — storyboard.** Excalidraw storyboard of every figure state (hairball, equation
  figure, three-fillings figure, machine loops, assembly, final form, minimap) plus the
  altitude decision and the vocabulary extension. Owner reviews the storyboard before
  component work; the Act I→II handoff (confusion into the one-shape move) is the beat to
  judge hardest. Note P1 was built ahead of P0 to make the scroll feel judgeable; the
  storyboard still gates all P2 diagram work.
- **P1 — the skeleton. BUILT 2026-08-06.** `/showcase/prototype` (noindex) as stacked
  VisualEssay segments using existing scenes and charts; beats promoted to steps;
  trajectories precomputed at load and the cost measured. Diagram slots render
  placeholders. Build record:
  - **Essay home decision:** the essay shell stays site-side — `ShowcaseScrollPrototype`
    (apps/site) composes the site's `VisualEssay` with stage pieces from a new
    `@eq-network/playground/showcase-scroll` export. VisualEssay gained two
    backward-compatible props (`closing` optional, `anchorPrefix` for stacked segments);
    `/thesis` unchanged.
  - **Copy single-sourcing:** the scroll script imports beats, assumption blocks, and the
    playable chapter from the canonical `script.ts` via throwing helpers, so canonical
    drift fails `test/scroll-contracts.test.js`. Two intros needed the machine-order fix
    (culture "third subsystem" → "second machine", politics "second" → "third"), done as
    asserted replacements, not forks. New Act I/II/V copy is a draft pending P3.
  - **Cost measurement (headless kernel, desktop):** 12 unique staged runs, 467 ms total,
    5.4 MB retained (largest single run 92 ms — combined/collapse). Precompute-at-load is
    cheap even at phone speeds; prewarm runs sequentially off `requestIdleCallback` and
    logs per-run cost in the console.
  - The contract test also pins the spine: cold open and Act-IV callback stage the same
    preset ("same picture twice" is a tested property), and the measurement step's copy
    must name the coupled sweep as un-run and carry no numbers.
  - **Amendment (owner direction 2026-08-07):** stages sometimes failed to start —
    root-caused to re-entry (leaving a segment pauses playback; returning re-triggered
    nothing). Fixed twice over: scrolling back into a segment now restages its active
    step, and every run stage carries a small overlaid play/pause as the manual backup.
    Autoplay on view stays the default; nothing in the essay *requires* the click, so
    Markov's rule holds in spirit. An explicit play gesture also overrides
    reduced-motion stillness, which is standard.
- **P2 — the diagram track. FIRST SLICE BUILT 2026-08-07** (owner direction: the combined
  diagram, with the copy explicit that this is an illustrative model of gradual
  disempowerment, not itself progress on the problem — more detailed models in
  development). Shipped: `influenceDiagramData.ts` (six reader-altitude variables — the
  three conserved ledgers wealth/attention/ballots as circles, capital/income/enforcement
  as boxes — and ten couplings, each naming its engine transforms, source reads, target
  writes, and dial), `InfluenceDiagram.tsx` (static semantic SVG, hand-authored layout,
  solid = flow / dashed = modulation / heavy blue = the three sealed channels, open
  arrowheads, in-figure legend, title+desc), and a traceability test against
  `LEDGER_SYSTEM` (now exported from kernel.js) that fails the build if a node names an
  unknown field, an edge names an unknown transform, an edge's reads/writes don't match
  the declarations, or a dial isn't a registry parameter. Still open in P2: the visual
  pass at desktop size per the DIAGRAMS.md checklist (label collisions, narrow viewport),
  the notebook-ink treatment (current render is clean SVG, not the RoughJS token), the
  Act-I hairball/minimap states, and the per-machine loop figures if they return.
- **P3 — the words.** Full copy pass in the five-act structure (Acts I, II, and V are
  substantially new writing; III and IV adapt existing beat copy), claims-discipline review,
  reduced-motion and narrow-viewport verification, promotion gates.

## Promotion gates

As task-0006, plus: the canonical `/showcase` is replaced only after an owner walkthrough
and a copy review under the claims discipline — with particular attention to Act II (the
one-shape claim must keep the whitepaper's precision: hosted-together, not secretly-the-same)
and Act IV step 6 (measurement stated as instrument, not result; the un-run coupled sweep
named as un-run). Diagrams additionally require the traceability test green and the
DIAGRAMS.md verification checklist before a figure is called done.

## Verification

- `pnpm --filter @eq-network/playground test` green, including the diagram traceability test
  and the showcase contract test adapted to steps.
- Root `pnpm build` green; `/playground`, `/lab`, `/thesis` visually unchanged.
- Browser walkthrough of `/showcase/prototype`: top-to-bottom scroll with no input reaches
  the playable ending; every step stages its promised dynamic; the cold-open run and the
  Act IV collapse step play the same preset; reduced motion communicates every step
  statically; narrow viewport and keyboard per the DIAGRAMS.md checklist.

## Referee paragraph

What a critic should press on. First, Act II is the highest-risk compression in the piece: an
equation on a scroll page can read as a lecture and lose the reader exactly where the lede
lives — the storyboard must find a figure that carries "one shape, three fillings" visually,
and if it cannot, the act gets rewritten around the figure that works, not defended. Second,
"compiled, not drawn" is a falsifiable claim about our own build: if the reader-altitude
aggregation needs editorial judgment beyond layout, the copy must weaken accordingly — the
page must not claim more mechanization than the fixture path actually has. Third, the
validation reframing of the organic/below-threshold beats imports the whitepaper's rule 4;
the copy must not overstate it into "these models are validated" — the anchors named on the
cards are what is reproduced, and the combined model has no paper and says so. Fourth, the
measurement step describes an instrument whose flagship coupled sweep has not been run;
one sentence of concept is the ceiling, and any number is a violation. Fifth, five acts is
longer than the current page; the trim order (a run step per machine first, the measurement
step second) should be agreed at P0, not improvised at P3.
