# Diagram policy

Read this file before creating or changing a diagram in the site or playground. It is the canonical
contract for diagram appearance, semantics, interaction, and verification.

## Canonical example

Brand Prototype **Fig. 02 / Canonical Graph Grammar** at `/brand/prototype` is the visual reference for
this policy. Its shared implementation is
[`apps/site/src/components/explainer-prototype/DagGraphPrototype.tsx`](apps/site/src/components/explainer-prototype/DagGraphPrototype.tsx).
The complete seven-state application of the grammar lives at `/explainer/prototype` in
[`apps/site/src/components/explainer-prototype/DiagramGrammarThesis.tsx`](apps/site/src/components/explainer-prototype/DiagramGrammarThesis.tsx).
The two examples share named drawing tokens and policy, not a domain-specific graph component.

Use the no-index **Diagram Stroke Lab** at `/brand/prototype/stroke-lab` when selecting or revising
connector geometry, ink variation, or arrowheads. Each specimen has a stable
`geometry.profile.seed` identifier. Promote selected specimens into named connector tokens before
using them in production diagrams; do not tune each diagram by eye.

The currently approved token is `notebook-connector-medium-v1`, selected on 2026-07-30 from the
stroke lab's `rough-reference` profile. It uses RoughJS roughness `1`, bowing `1`, maximum randomness
offset `2`, two strokes, and seeds `1103`, `4409`, and `7919`. All three seeds were approved across
direct, shallow/deep bow, and soft-S geometry. Keep these values in the shared connector token rather
than copying them into individual diagrams.

## Objective

Draw technical ideas as a clean scientific notebook: confident ink, restrained wobble, handwritten
annotation, and enough structure that a reader can decode the figure without surrounding prose. The
result should feel deliberately drafted rather than mechanically generated and roughened afterward.

## Visual language

- Use the cleanest end of the Excalidraw aesthetic. Keep nodes and symbols precise and low-wobble.
- Draw node and symbol contours once. Disable doubled strokes and multi-stroke fills on closed shapes.
- Let connectors be slightly looser than nodes. A controlled second pass is allowed where its overlap
  creates local thick–thin–thick rhythm and occasional separation. It must never create a uniformly
  doubled outline or hairy edge.
- Use round line caps and joins. Use bold stroke width for the active or consequential path.
- Use open arrow tips shaped like `->`, generated with the same ink profile and seed family as the
  shaft. Do not attach a mechanically precise SVG marker to a rough connector. Reserve filled markers
  for a separately defined semantic state.
- Use curved annotation arrows and short underlines sparingly.
- Set labels, annotations, and display math in the vendored Kalam face. Mechanical Computer Modern or
  default KaTeX styling is outside this visual language.

## Semantic channels

Every visual channel has one stable job:

| Channel       | Meaning                                    |
| ------------- | ------------------------------------------ |
| Shape         | Role or entity type                        |
| Fill          | State                                      |
| Color         | Emphasis or category named by the legend   |
| Stroke weight | Highlighted path or selected relation      |
| Connector     | Directed relationship                      |
| Position      | Structure computed by the diagram's layout |

For social-system graphs, the default role vocabulary is an open circle for a human, a triangle for an
AI system, and a square for an institution. Default states are open, hatched, and solid. Change this
vocabulary only when the figure's domain requires it, and explain the replacement in its legend.

Encode every color meaning redundantly with stroke weight, fill treatment, shape, text, or another
visible cue.

## Connector grammar

Choose the simplest route that communicates the relationship without colliding with content:

1. **Direct:** a near-straight link when the corridor is clear.
2. **Shallow bow:** a quadratic curve around one nearby obstacle or to separate neighboring links.
3. **Deep bow:** the same gesture with more clearance for a route near the diagram edge.
4. **Soft S:** a cubic curve with two opposing control points when a link must pass between two
   occupied areas or join offset ports cleanly.

These gestures carry the same relationship semantics unless the legend says otherwise. Curvature
solves routing while preserving the edge type. Offset-S, double-S, edge-sweep, and return routes remain
experimental until explicitly selected in the stroke lab.

Solid, long-dash (`12 8`), short-dash (`6 6`), open-dot (`1 7`), and dense-dot (`1 4.5`) are all
approved connection patterns. Solid remains the ordinary default. A dashed or dotted pattern has no
global meaning: assign its semantics in the diagram's typed data and explain it in that diagram's
legend. When a shaft is dashed or dotted, keep its open arrowhead solid so direction remains legible.

Route lines through whitespace. Reposition nodes, change layer spacing, or move annotation blocks when
that improves clarity. In particular:

- Keep semantic callouts in an outer gutter and point them to nearby boundary nodes or links.
- Keep annotation leaders near the figure edge and clear of labels, nodes, equations, and the main
  network.
- Avoid edge-node and edge-label collisions before minimizing edge length.
- Separate parallel relations visibly. Avoid accidental tangencies that make two paths look joined.
- Trim connectors at shape boundaries and leave enough room for the open arrow tip.

## Legends

Every graph includes a legend inside the figure. It must decode every visual channel that appears:

- shapes and their roles;
- fill patterns and their states;
- colors and their meanings;
- ordinary, highlighted, dashed, or otherwise distinct connections;
- any nonstandard line, marker, or interaction state.

Make the legend self-contained so a screenshot of the figure remains interpretable without page copy.
On a wide figure, consolidate the keys into one compact row aligned to the lower-left. Do not stack
separate legend bands until they force the actual diagram to shrink. Keep the row in the same order:
shape/fill, color/state when present, then connections.

Calibrate primary node marks against the canonical DAG: approximately 32–36 CSS pixels across at the
desktop presentation size. A diagram may vary this for density, but nodes must not become miniature
because its coordinate system or view box is oversized.

## Geometry, rendering, and motion

Keep these layers separate:

1. **Typed domain data** describes nodes, relationships, states, annotations, and legend entries.
2. **D3** computes positions, topology, routing inputs, and simulations.
3. **Deterministic hand-drawn primitives** convert resolved geometry into paths. RoughJS is acceptable
   with fixed seeds, one stroke and low roughness for nodes, and an approved named single- or
   controlled-double profile for connectors.
4. **Semantic SVG and React** own labels, focus targets, selection, animation, and accessibility.

Use Excalidraw for storyboarding and visual exploration. Keep semantic SVG as the runtime model so
labels, interaction, animation, and accessibility remain available.

Use one resolved geometry source for both drawing and animation. Animate SVG transforms, stroke reveal,
opacity, and other presentation properties; simulations may update the same resolved positions.
Generate rough paths once per geometry change and reuse them across animation frames. Stable seeds
prevent visual flicker and make screenshots reproducible.

Support `prefers-reduced-motion`. The reduced-motion version must communicate the same state without
waiting for an animation.

## Interaction and accessibility

- Give the SVG a useful title and description.
- Make selectable nodes keyboard reachable and expose their selected state.
- Use forgiving invisible hit areas where the visible mark is small.
- Keep all essential labels as semantic text.
- Preserve the interaction when the graph scrolls horizontally on a narrow viewport.
- Keep the page itself within the viewport; only the figure's deliberate scroller may overflow.

## Content and implementation

- Keep page-facing labels and explanations in the relevant typed content file.
- Keep renderer geometry and seeds with the diagram implementation.
- Keep layout logic separate from hand-drawn path generation.
- Build redesigns on the page's noindex prototype route and leave the canonical page unchanged until
  approval.
- When a diagram grammar gains a second real use, extract shared contracts and primitives instead of
  copying the first component.

The intended shared contract is a local package with no network service. A future `DiagramSpec` should
describe nodes, links, semantic channels, annotations, legend entries, layout constraints, interaction
modes, motion phases, and named connector profiles. The renderer should accept resolved or D3-computed
positions and return semantic SVG. Keep renderer versions, connector-profile versions, and seeds
explicit so the same spec produces a reproducible image.

First validate this policy on at least two meaningfully different diagrams, then extract the smallest
shared schema that both actually need.

If there is not enough information to assign a visual meaning, or a requested diagram makes two rules
conflict, ask the owner which meaning should win and record the accepted decision here before
implementing it.

## Verification

Before reporting a diagram complete:

1. Compare it with the approved notebook direction at desktop size.
2. Inspect arrow tips, line crossings, label collisions, and legend completeness.
3. Check every interaction with pointer and keyboard.
4. Check a narrow viewport and reduced motion.
5. Confirm fixed seeds produce a stable render.
6. Run the app build and type checks.
