# Playground orientation

## Product

The playground is the accessible, browser-run tier of the Collective Intelligence Library. It lets a
researcher or curious reader manipulate toy models without installing the full JAX engine.

The coupled model leads and the other three are its legs, taken one at a time:

1. **Combined:** one population holds three conserved stocks — money, attention, votes — and the only way
   to reach across is to spend. Advertising buys an audience, an audience attracts votes, lobbying moves
   how strictly the tax is collected. No channel asks whether the spender is a person or a machine.
2. **Economy** (WP1): the money leg alone — AI capital can compound while human labor loses bargaining weight.
3. **Culture** (WP2): the attention leg alone — amplification turns attention structure into concentrated influence.
4. **Politics** (WP3): the votes leg alone — delegation drifts toward whoever already holds ballots.

Restructured 2026-08-02. Scenarios 2–4 are the standalone versions of the coupled model's three
panels, which is why the drill-down is exhaustive rather than a sampler. The governed commons and
`value_contagion` were removed: neither is a leg of the coupled model, and `value_contagion` has no
paper behind it.

**Name the legs after their papers.** WP2 is the culture paper ("Who Fills Your Head?") and its
engine model is `influence_exchange`; WP3 is the politics paper and its model is
`delegative_polity`. Until 2026-08-02 the page had these labels swapped — WP2 shown as "Politics",
WP3 as "Polity" — which was both wrong and the source of the rail's worst readability problem, two
adjacent near-synonyms a reader had no way to tell apart. The confusing scenario formerly called
"Culture" was `value_contagion`, a different model that is not WP2.

## Interaction grammar

- A scenario is selected by a stable URL hash and expands in the left navigation.
- Five or six typed story scenes appear as numbered subsections beneath it. Selecting a scene applies its
  authored preset and view, moves the shared playhead, and optionally plays to a defined tick.
- Presets are named, reproducible experimental conditions promoted beside the player.
- Settings is the only right rail and is hidden by default. Granular controls, evidence anchors, and
  modelling assumptions live there; Close gives its width back to the visualization.
- A seed changes the sampled world.
- Playback and scrubbing inspect the path, not only the endpoint.
- Rewind/forward, speed, and scrubbing use the same live playhead as metric cards and charts.
- Scenario-specific SVG views preserve the inherited showcase layout; the pipeline view makes declared
  message flow and effects visible.

## Reading layout

The canonical site header introduces the tool. Inside the reader, a compact scenario title spans the full
width and sticks to the viewport top. Scenario and story hierarchy stay left, the live system and measures
stay central, and the optional Settings rail scrolls independently on the right. The desktop reader fits
the active simulation and both measure charts in one snapped viewport. On narrow screens those regions
become one vertical reading order without horizontal overflow.

## Epistemic boundary

These are toy models and qualitative JavaScript ports. They make assumptions inspectable and help compare
mechanisms; they do not forecast real societies. Each Settings rail ends with its evidence anchor and
itemized modelling assumptions; the full reading guide explains why fixed-rule defenses are optimistic
upper bounds. A single trajectory or score is not a finding. The working paper's standard is stronger:
map regimes, validate against known anchors, compare paired seeds, and test claims across structurally
different models.

## Source material

- [`voice-notes.md`](voice-notes.md) — co-author direction, preserved verbatim.
- [`../../public/cilib-whitepaper.pdf`](../../public/cilib-whitepaper.pdf) — July 2026 alpha working paper.
- [`interface-references.md`](interface-references.md) — interaction patterns reviewed from adjacent
  modelling playgrounds, including Epoch AI's GATE.
