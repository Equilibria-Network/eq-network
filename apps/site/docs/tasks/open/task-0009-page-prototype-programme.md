# Prototype and migrate every public page onto shared contracts

- Provenance: task-0009 (owner request)
- Links back to:
  [`../../adr/0006-tailwind-design-system.md`](../../adr/0006-tailwind-design-system.md),
  [`../../adr/0007-visual-essay-system.md`](../../adr/0007-visual-essay-system.md),
  [`../../context/10-visual-language.md`](../../context/10-visual-language.md),
  [`task-0002-visual-language-alignment.md`](task-0002-visual-language-alignment.md)
- Status: in progress — shared editorial header/sidebar and visual-essay shell exist; Explainer promoted
- Owner: unassigned
- Priority: now (programme)

## Goal

Every public page gets a no-index prototype route where its visual-language redesign can be reviewed
without replacing production. Prototype and canonical routes consume the same typed content and shared
components. Once the owner approves a prototype, promotion changes composition rather than copying markup
or data.

This is a migration programme, not permission to make every page look identical. Standard editorial pages
share page chrome; visual essays share reading behavior; simulations and graphs keep page-specific domain
models behind those contracts.

## Promotion contract

1. Keep the canonical route unchanged while a prototype is under review.
2. Put the prototype at `/<page>/prototype` (`/prototype` for Home) and set `noindex`.
3. Extract or reconcile typed content before visual work. Prototype and canonical routes import the same
   content module; do not fork copy.
4. Reuse `PageHeader`, `PageSidebar`, `VisualEssay`, tokens, and established card/section primitives where
   their contracts fit. Extend a shared primitive only after a second real consumer proves the need.
5. Centralize asset references in typed content or a page asset manifest. A build-time check must verify
   that every local asset reference resolves and uses the correct public URL.
6. Verify desktop and mobile rendering, keyboard behavior, reduced motion, production build, and no-JS
   readability appropriate to the page.
7. Promote only after owner approval. Keep the prototype temporarily for comparison, then decide explicitly
   whether it remains as a no-index archive or is removed.

## Causal sequence

### P0 — Contracts and fitness functions (biggest unlock)

- [ ] Define the small shared page-document types: editorial header metadata, sidebar sections, actions,
      media references, and page status. Keep domain-specific content local.
- [ ] Add a deterministic local-asset validator covering typed content, CSS URLs, and static route assets.
      Make it part of `pnpm check`.
- [ ] Add a prototype-route inventory check: every in-scope canonical route has a declared prototype,
      prototype routes are `noindex`, and canonical/prototype pairs share content sources.
- [ ] Finish token migration required by task-0002 Stage 1 before page prototypes introduce more raw values.
- [ ] Add a short prototype/promotion checklist to the design contract and agent guide.

P0 prevents the two recurring failure classes: visual drift from copied components and missing media from
unverified string paths or client-only rendering.

### P1 — Static editorial pages (prove the ordinary-page contract)

These can proceed independently after P0:

Implementation detail and acceptance criteria for this batch are tracked in
[`../deferred/task-0010-about-products-roadmap-redesigns.md`](../deferred/task-0010-about-products-roadmap-redesigns.md).

1. **About** — `/about/prototype`; finish task-0008, clarify the organisation, and prove content sections,
   people, partners, and legal facts can share contracts.
2. **Roadmap** — `/roadmap/prototype`; reconcile phase data, sticky navigation, status chips, and shared
   sidebar/header behavior. Preserve the existing bottom `ResearchGraph` unchanged; redesigning it is a
   separate future task.

Products is no longer a prototype target. Playground replaced it in primary navigation; the legacy route
is tracked separately in
[`../deferred/task-0012-retire-products-route.md`](../deferred/task-0012-retire-products-route.md).

Promote the best shared primitives from these two pages before starting the complex pages.

### P2 — Data-rich and interactive pages

4. **Research** — `/research/prototype`; define a typed graph-data boundary, accessible non-graph fallback,
   and selection/detail contract.
5. **Lab** — `/lab/prototype`; keep scenarios and simulation models page-specific while reusing page chrome,
   reading keys, status semantics, and figure frames.

Research should precede Lab because its smaller graph interaction is the safer place to establish shared
graph accessibility and asset-loading conventions.

### P3 — High-identity and system routes

7. **Home** — `/prototype`; do this late because Home advertises the system established by the other pages.
8. **404** — `/404/prototype`; validate the error-state variant of the shared visual language without
   forcing ordinary page chrome onto it.
9. **Privacy** — `/privacy/prototype`; current page is already on shared editorial chrome, so prototype only
   when the next substantive iteration exists.
10. **Legal** — `/legal/prototype`; same rule as Privacy.
11. **Brand** — `/brand` is the rendered source of truth, not a migration target. The hand-drawn identity
    exploration in
    [`task-0011-hand-drawn-brand-prototypes.md`](task-0011-hand-drawn-brand-prototypes.md)
    uses `/brand/prototype/*`; select and promote its reusable primitives before dependent page work.

### Already proved

- [x] **Explainer / Thesis** — `/explainer/prototype` uses the typed `VisualEssay` contract and the persistent
      world-model renderer. Owner approved promotion to `/explainer` on 2026-07-29, then promoted the clean
      scientific-notebook renderer with seven-state narrative parity on 2026-07-30.
  - `/explainer/notebook-prototype` reuses the same essay document, shell, and persistent 20-node D3 model
    as the no-index comparison route. Canonical and prototype now share the clean narrative renderer.
- [x] **Lab playground** — the owner selected an integrated app rather than a duplicate prototype route.
      `apps/playground` supplies a stable React package export mounted at canonical, indexable
      `/playground` inside site chrome; the former Lab route redirects. See the
      [repo integration ADR](../../../../../docs/adr/0003-integrated-playground-deployment.md) and
      [completed playground task](../../../../playground/docs/tasks/done/task-0001-integrated-playground-app.md).

## Dependency graph

```text
tokens + page contracts + asset validator + prototype convention
                    │
               ┌────┴────┐
               ▼         ▼
             About    Roadmap
               └────┬────┘
                    ▼
         proven editorial primitives
                    │
             ┌──────┴──────┐
             ▼             ▼
          Research        Lab
             │             │
             └──────┬──────┘
                    ▼
           graph/simulation contracts
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
        Home       404    policy refinements
```

## Done when

- Every in-scope canonical route has an owner-reviewable, no-index prototype or an explicitly documented
  exception.
- Approved prototypes are promoted without duplicated content or page-local copies of shared primitives.
- All local assets are verified during `pnpm check`.
- Page-specific interactions have typed boundaries, accessible fallbacks, and reduced-motion behavior.
- The canonical route inventory, task index, design contract, and agent instructions agree.
