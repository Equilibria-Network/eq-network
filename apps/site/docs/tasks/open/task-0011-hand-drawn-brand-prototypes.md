# Restore the hand-drawn visual soul through brand prototypes

- Provenance: task-0011 (owner direction)
- Links back to:
  [`../done/task-0007-brand-page.md`](../done/task-0007-brand-page.md),
  [`../open/task-0002-visual-language-alignment.md`](../open/task-0002-visual-language-alignment.md),
  [`../open/task-0009-page-prototype-programme.md`](../open/task-0009-page-prototype-programme.md),
  [`../../context/10-visual-language.md`](../../context/10-visual-language.md)
- Status: in progress — approved scientific-notebook diagram system promoted to `/thesis` 2026-07-30;
  broader site adoption remains staged
- Owner: unassigned
- Priority: before task-0010

## Problem

The current brand system retained hatching, mathematical annotation, and measured drawing structure, but
lost the representational sketch language already present on Home and About: engraved people, hands,
objects, architecture, and scientific figures. The result is coherent but risks becoming too polished,
sterile, and generic as it spreads across the site.

The objective is not simulated notebook paper, rotated cards, handwritten interface labels, or arbitrary
rough borders. The interface can remain clean and white. The hand-drawn soul comes from an illustration
system based on line engraving, cross-hatching, woodcut density, and old scientific or newspaper printing.

## Goal

Build one no-index working identity at `/brand/prototype` which refines—not replaces—the approved brand
page. Retain its white space, navy/blue palette, hatching, blueprint precision, approved marks, and current
tooltip behavior. Add a bounded scientific-notebook layer wherever the site depicts active reasoning:
Kalam mathematical notation, diary-like marginalia, graphite arrows, and pencil-drawn complex systems.

### Current implementation

- [x] Canonical prototype at `/brand/prototype`
- [x] First A/B/C interface-roughness pass rejected and removed
- [x] Rejected comparison routes, contracts, and specimens removed
- [x] Kalam selected for rare equations, hypotheses, arrows, and working annotations
- [x] C1 marginalia selected as the card/aside grammar
- [x] E1 pencil network selected and refined with curved repeated graphite strokes
- [x] Existing canonical tooltip retained
- [x] Scientific-notebook grammar tested in a programmable interactive D3 renderer at
      `/explainer/notebook-prototype`, with a reference-led clean study over one persistent world model
- [x] Renderer separates D3 state/layout from deterministic hand-drafted SVG primitives; the prototype API
      supports mixed edge gestures, open and pressure-marked contours, multiple node shapes, text labels,
      and inline SVG marks
- [x] Clean study promoted to canonical `/explainer` after restoring the seven visual meanings of the
      deployed page rather than reusing one generic network composition for every step
- [x] Approved connector-grammar prototype promoted to canonical `/thesis`; former `/explainer` and
      prototype URLs retain compatibility redirects
- [x] Shared `VisualEssay` figure region flattened: the D3 boundary remains, while visible frames,
      registration marks, and figure/status chrome are removed
- [x] Diagram semantics recorded in the visual-language contract and centralized as `--diagram-*` tokens;
      color remains redundant with shape, line, label, and position
- [x] Seven-state desktop/mobile browser regression covers narrative anchors, SVG accessible text,
      hydration, interaction count, state changes, and horizontal overflow
- [x] Dense society/equilibrium scenes reduced to a persistent 20-node model with selectively pruned
      edges; triangles and institutional marks now use straight drafted contours. Open, lightly hatched,
      and densely cross-hatched fills redundantly distinguish human, AI, and institutional actors
- [x] Strategic-state colors explicitly keyed wherever used: green/cooperate, red/defect, and—only in the
      uncertainty scene—amber/unresolved
- [x] Redundant numeric state controls removed in favor of the document scroll; the expanded flat drawing
      field keeps a persistent shape key and scene-specific relationship annotation
- [x] Defection, equilibrium, and bridge connectors derive from live geometry. The final state presents
      Equilibria as one participant in a distributed translation mesh, not a central clearinghouse
- [x] Mathematical marginalia reconciled with the diagrams: siloing uses sparse between-field edges and
      the bridge state adds peer-to-peer translation edges
- [ ] Prove the drawing grammar in a second, structurally different simulation before promoting it from the
      explainer prototype into the shared visual-essay package
- [ ] Reconcile the selected combination into the visual-language contract and reusable primitives

### Connector grammar revision — 2026-07-30

- [x] Owner selected the RoughJS medium two-pass profile across three deterministic seeds.
- [x] Direct, shallow/deep bow, and soft-S routes promoted as canonical connector geometry.
- [x] Solid, long-dash, short-dash, open-dot, and dense-dot patterns approved visually; non-solid
      meanings remain local to each diagram and must appear in its legend.
- [x] Shared `notebook-connector-medium-v1` token consumed by the stroke lab and canonical DAG.
- [x] Recompose the complete seven-step thesis story using the approved
      connector grammar and the existing typed `VisualEssay` document.
- [x] Match the canonical DAG's desktop mark scale and consolidate shape/fill, color/state, and
      connection keys into one lower-left legend row.
- [ ] Use the completed thesis renderer plus one structurally different playground scene to define
      the smallest honest tool/package contract.

## Shared specimen set

The prototype must demonstrate:

- approved navy and reversed Lorenz marks;
- common `PageHeaderContent` hierarchy;
- navigation and footer;
- marginalia card, tooltip, and mathematical-notation states;
- one mathematical or graph-theory figure;
- one small network or complex-system transition;
- desktop and mobile compositions;
- hover, keyboard focus, reduced-motion, and no-JavaScript fallbacks.

## Implementation boundaries

- Keep content in typed modules; prototype routes must not fork the canonical brand copy.
- Establish reusable illustration, figure, caption, and print-treatment contracts.
- Use the existing Home/About sketches as first-party visual references.
- Use the image-generation workflow for new representational raster illustrations when the existing asset
  library cannot express the required subject; retain prompts, references, lineage, and optimized outputs.
- Kalam is self-hosted only for rare equations, marginal questions, and working annotations; ordinary
  headings, prose, navigation, and controls retain the standard type system.
- Keep live text, controls, the approved mark, and accessibility-critical structure crisp.
- Promote only owner-approved, bounded treatments. The clean diagram palette and flat figure region were
  approved for `/thesis` on 2026-07-30; representational illustration and broader page treatments
  remain prototype-only.
- Treat the current drawing module as an incubating API, not a universal graph framework. Preserve the seam
  between domain state, layout, drawing grammar, and marks; promote only the primitives shared by a second
  real renderer so thesis-specific assumptions do not become global contracts.

## Evaluation rubric

Score each direction against:

1. Distinctive human character without visual clutter.
2. Continuity with the approved mark, navy/white identity, mathematics, graphs, and hatching.
3. Readability and accessibility across scales.
4. Ability to produce coherent pages—not merely a compelling hero.
5. Reusability through typed contracts and bounded components.
6. Runtime performance and reduced-motion behavior.
7. Ease of authoring new visual-story and editorial pages.

Record the approved constraints in the visual-language contract before beginning task-0010.

## Verification

- Explainer evidence is recorded in
  [`../../audits/2026-07-30-explainer-verification.md`](../../audits/2026-07-30-explainer-verification.md).
- Connector-grammar prototype evidence is recorded in
  [`../../audits/2026-07-30-explainer-connector-prototype-verification.md`](../../audits/2026-07-30-explainer-connector-prototype-verification.md).
- Former comparison routes redirect to the canonical `/thesis` page.
- `pnpm check` passes.
- The selected system is visually reviewed at desktop and mobile sizes.
- Keyboard, contrast, motion, hydration, and performance checks are documented.
- Generated assets, if any, include source prompts/manifests and production-optimized outputs.
- The canonical `/brand` page remains unchanged until explicit owner approval.

## Done when

The selected prototype has owner approval, reusable sketch primitives and constraints are documented,
and task-0010 can inherit a visual identity with restored hand-drawn character.
