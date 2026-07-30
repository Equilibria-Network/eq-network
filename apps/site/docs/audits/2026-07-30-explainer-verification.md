# Explainer visual, semantic, and runtime verification

- Date: 2026-07-30
- Scope: canonical `/explainer`, shared `VisualEssay` shell, and notebook renderer
- Evidence classes: browser regression, manual visual review, static build checks, local synthetic HTTP
  timing

## Outcome

The canonical explainer preserves the seven-stage argument of the deployed reference while using the
promoted scientific-notebook drawing grammar. The page scroll is the sole state selector. The drawing is a
flat, expanded SVG region beside the independently scrolling narrative.

The persistent model now uses 20 actors. Dense scenes prune non-essential edges without changing the
intended transformation: one social fabric, cascading defection, separated equilibria, uncertain futures,
four research lenses, disciplinary silos, and a connected research mesh.

## Encoding contract

- Circle/open fill = human; drafted triangle/light one-way hatch = AI agent; drafted square/dense
  cross-hatch = institution.
- The shape key persists across all seven scenes because those meanings persist.
- Scenes two and three explicitly key green as cooperate and red as defect. Scene four adds amber as
  unresolved. Actor type remains encoded by shape and fill treatment, so color does not silently change
  what triangle, circle, or square means.
- Research-field colors are redundantly identified by a labeled field boundary and stable spatial
  position.
- “Resources · decisions · information” is scene-one annotation describing what social relationships
  carry. It is not presented as a universal edge legend.
- Connectors derive their endpoints from live node geometry and terminate outside node boundaries.
- The local-payoff annotation is placed beside its target and uses a two-control-point cubic S gesture.
  Other connectors remain straight or single-bend only when that is the clearest route.

## Scene-by-scene clarity check

| Scene           | Visual claim                                          | Explicit keys and annotations                                                                            | Connector check                                                                               |
| --------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1 · Society     | One connected actor network                           | Persistent actor-type/fill key; relations explicitly carry resources, decisions, and information         | Ordinary relationships stop at node boundaries                                                |
| 2 · Defection   | A local strategic choice propagates through neighbors | Green/cooperate and red/defect key; `local payoff ↑`; `collective welfare ↓`                             | Payoff label sits beside the initiating red actor; short cubic S arrow targets that actor     |
| 3 · Equilibria  | Cooperative and defective regions can both be stable  | Green/cooperate and red/defect key; `E₁ / better for all`; `E₂ / stable but worse`                       | Blocked unilateral move routes through clear space above the two regions                      |
| 4 · Uncertainty | The same network admits unresolved strategic outcomes | Green/cooperate, red/defect, and amber/unresolved key; question marks and “Which future becomes stable?” | No causal arrow is asserted; nested possible-world contours remain non-directional            |
| 5 · Knowledge   | Four mature model families study one shared question  | Every field has a code, name, color boundary, and scene-specific subtitle                                | No between-field edges are asserted                                                           |
| 6 · Silos       | Knowledge exists inside four disconnected subnetworks | Same named field boundaries; central translation gap; venue/formalism/synthesis note                     | Within-field edges only                                                                       |
| 7 · Bridge      | Translation grows as a distributed mesh               | Same named field boundaries; small `EQ` participant; translate/compose/test note                         | Four direct between-field links plus one Equilibria-assisted diagonal; no central-flow arrows |

## Mathematical marginalia

| Scene       | Notation                         | Claim                                                        |
| ----------- | -------------------------------- | ------------------------------------------------------------ |
| Society     | `G = (V, E)`                     | Society is represented as actors and relationships.          |
| Defection   | `uᵢ(D, s₋ᵢ) > uᵢ(C, s₋ᵢ)`        | Defection can be a locally preferred response.               |
| Equilibria  | `s* ∈ NE ∧ W(s*) < W(ŝ)`         | A stable state can have lower welfare than an alternative.   |
| Uncertainty | `P(Gₜ₊₁ \| Gₜ, π) = ?`           | The next network state is unresolved under current policy.   |
| Knowledge   | `M = {m_CAI, m_CSS, m_AF, m_CS}` | Four model families address parts of the shared problem.     |
| Silos       | `\|E_between\| ≪ \|E_within\|`   | Between-field translation edges are sparse.                  |
| Bridge      | `eq ∈ V ; E_bridge ⊂ V × V`      | Equilibria participates as a node adding peer-to-peer edges. |

The final scene deliberately avoids a hub-and-spoke topology. Four direct between-field connections form
a distributed backbone; Equilibria adds one diagonal bridge as a participant, not a central clearinghouse
through which all information must flow.

## Automated evidence

- `pnpm lint` — pass.
- `pnpm test` — pass.
- `pnpm build` — pass, including `astro check`.
- Scoped Prettier check for all explainer, visual-essay, content, changelog, ADR, and task files — pass.
- Seven-state browser smoke — pass at desktop and 390 px mobile; every state hydrated, exposed SVG
  accessible text, retained 20 keyboard-addressable actors, and produced no horizontal overflow or browser
  error. The regression checks every equation and explanatory label listed above, persistent actor
  semantics, scene-specific strategic-state legends, three distinct fill treatments, and a short cubic
  payoff connector.
- `git diff --check` — pass.

The repository-wide `pnpm format:check` remains blocked by the pre-existing unformatted
`src/components/brand/lorenzMarks.ts`, which this pass did not modify.

## Performance evidence

Question: does the expanded SVG introduce an obvious local delivery regression?

- Target: local Astro development server on port 4321.
- Workload: five sequential HTTP GETs, mixed cache, unshaped local network, no warm-up.
- Median TTFB: 17.170 ms.
- Median total time: 21.061 ms.
- Median transfer: 106,392 bytes.
- HTTP status: 200 with no redirect.
- Verdict: `not_evaluated`; no explainer-specific performance budget has been adopted.

This is synthetic HTTP evidence from a development server. It does not render the page, execute the
transitions, or establish Core Web Vitals. A local Lighthouse attempt produced an incomplete empty
artifact and is excluded from the evidence. The next useful performance measurement is a repeated
production-preview browser lab run with a calibrated device/network profile.
