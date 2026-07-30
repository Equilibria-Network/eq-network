# Explainer connector-grammar prototype verification

- Date: 2026-07-30
- Scope: noindex `/explainer/prototype`
- Comparison route: canonical `/explainer`
- Evidence: seven-state browser regression, desktop screenshots, mobile overflow check, static build

## Outcome

The prototype now renders the complete thesis rather than an isolated specimen. It consumes the same
typed `thesisDocument` and `VisualEssay` scroll-state shell as the canonical page, while selecting the
prototype-only `notebook-v1` connector grammar.

All seven scenes retain their original claim and transition:

1. integrated society;
2. local defection cascade;
3. fragmented equilibria;
4. uncertain futures;
5. four research lenses;
6. disconnected fields;
7. a distributed translation mesh.

The canonical route continues to select the legacy `drafted` grammar. Scale, rough connectors, and the
new legend composition are gated by `data-connector-grammar="notebook-v1"`.

## Approved drawing vocabulary exercised

- Connector profile: `notebook-connector-medium-v1`.
- Deterministic seeds: `1103`, `4409`, and `7919`.
- Geometry: direct, shallow bow, deep bow, and soft S.
- Patterns: solid, long dash, short dash, open dot, and dense dot.
- Direction: RoughJS-rendered open `->` tips, kept solid when the shaft is dashed or dotted.
- Motion: the same D3-resolved positions drive nodes and connector geometry throughout each 760 ms
  state transition.

Pattern meanings remain local to the thesis renderer and appear in every scene's legend. For example,
long dashes mean weakened or broken ties in the defection and equilibria scenes, open dots mean possible
or unobserved ties under uncertainty, and short dashes mean translation edges in the final scene.

## Scale and legend review

Prototype nodes are scaled to 1.55 times the legacy thesis marks, producing approximately the same
32–36 px desktop presence as the canonical DAG specimen. The expanded force layout increases link
distance and collision clearance without changing the canonical layout.

Every scene uses one compact lower-left legend row in this order:

1. shape and fill;
2. color and strategic state, when present;
3. connection pattern and direction.

The longest variant—defection/equilibria with shape, two strategic states, and two connection
types—fits on one row without clipping. Mathematical marginalia remains on the separate baseline below
the legend.

## Browser evidence

- Prototype seven-state smoke: pass.
- Canonical seven-state smoke: pass.
- Each route hydrates all seven scroll states and renders 20 focusable node controls.
- Prototype scenes expose an actor legend, a connection legend with at least two computed line patterns,
  and the scene-specific strategic-state legend where required.
- Node selection and release update `aria-pressed` and reveal the neighborhood annotation.
- The defection payoff connector remains a short cubic S route and avoids the label block.
- The 390 px check reports `documentWidth === viewport === 390`; no horizontal page overflow or browser
  exception was observed.

Seven 1440 × 1000 desktop screenshots were inspected together and individually. The enlarged nodes,
field layouts, annotation arrows, legend row, and mathematical baseline remain unclipped across all
states.

## Static evidence

- `pnpm --filter @eq-network/site exec astro check` — pass.
- `pnpm build` — pass for the site and playground workspaces.
- Scoped Prettier check for the changed renderer, grammar, content, route, test, and policy files — pass
  after formatting.
- `git diff --check` — pass.

## Package boundary exposed by this recreation

The second real diagram confirms a useful shared core, but not yet a universal graph package. The
extractable seam is:

- named connector profile and deterministic seed;
- direct/bow/S resolved geometry;
- solid/dash/dot pattern;
- optional open direction tip;
- semantic legend entry;
- resolved D3 source and target positions.

The thesis state machine, force-layout choices, scene annotations, field frames, and narrative timing
remain renderer-specific. A structurally different playground scene should be the next validation case.
Only the primitives shared by the DAG, thesis, and that scene should become the first `DiagramSpec`
package contract.
